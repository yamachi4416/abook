using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AbookUseCase.Models;
using AppBase.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace AbookUseCase.Entities
{
    public abstract class AbookDbContext : DbContext
    {
        protected AbookDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<MUser> MUsers { get; set; }

        public DbSet<Abook> Abooks { get; set; }

        public DbSet<AbookMember> AbookMembers { get; set; }

        public DbSet<Account> Accounts { get; set; }

        public DbSet<Journal> Journals { get; set; }

        public abstract CurrentUser GetCurrentUser();

        protected void Audit()
        {
            var audits = ChangeTracker
                .Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified)
                .Where(e => e.Entity is Audience);

            if (audits.Any())
            {
                var currentDate = DateTimeOffset.UtcNow;
                var currentUser = GetCurrentUser();

                foreach (var e in audits)
                {
                    var audit = e.Entity as Audience;
                    audit.UpdatedDate = currentDate;
                    audit.UpdatedUserId = currentUser.Id;
                    if (e.State == EntityState.Added)
                    {
                        audit.CreatedDate = currentDate;
                        audit.CreatedUserId = currentUser.Id;
                    }
                    else
                    {
                        e.Property(nameof(audit.CreatedDate)).IsModified = false;
                        e.Property(nameof(audit.CreatedUserId)).IsModified = false;
                    }
                }
            }
        }

        protected void AuditAbookable()
        {
            var abookables = ChangeTracker
                .Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified)
                .Where(e => e.Entity is Abookable);

            if (abookables.Any())
            {
                var currentAbookId = GetCurrentUser().CurrentAbookId;

                foreach (var e in abookables)
                {
                    var abookable = e.Entity as Abookable;
                    if (e.State == EntityState.Added)
                    {
                        if (string.IsNullOrEmpty(abookable.AbookId))
                        {
                            abookable.AbookId = currentAbookId;
                        }
                    }
                    else
                    {
                        e.Property(nameof(abookable.AbookId)).IsModified = false;
                    }
                }
            }
        }

        public override Task<int> SaveChangesAsync(
            CancellationToken cancellationToken = default)
        {
            Audit();
            AuditAbookable();
            return base.SaveChangesAsync(cancellationToken);
        }

        public override Task<int> SaveChangesAsync(
            bool acceptAllChangesOnSuccess,
            CancellationToken cancellationToken = default)
        {
            Audit();
            AuditAbookable();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MUser>(b =>
            {
                b.ToTable("m_user");
                b.HasKey(m => m.Id);
            });

            modelBuilder.Entity<Abook>(b =>
            {
                b.ToTable("abook");
                b.HasKey(m => m.AbookId);
                b.HasQueryFilter(m =>
                    GetCurrentUser().MemberAbookIds.Contains(m.AbookId));
            });

            modelBuilder.Entity<AbookMember>(b =>
            {
                b.ToTable("abook_member");
                b.HasKey(m => new { m.AbookId, m.UserId });

                b.HasOne(m => m.Abook)
                    .WithMany(a => a.AbookMembers)
                    .HasForeignKey(m => m.AbookId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasQueryFilter(m => m.UserId == GetCurrentUser().Id);
            });

            modelBuilder.Entity<Account>(b =>
            {
                b.ToTable("account");
                b.HasKey(m => m.Id);

                b.HasOne<Abook>()
                    .WithMany()
                    .HasForeignKey(m => m.AbookId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasQueryFilter(m =>
                    m.AbookId == GetCurrentUser().CurrentAbookId);
            });

            modelBuilder.Entity<Journal>(b =>
            {
                b.ToTable("journal");
                b.HasKey(m => m.Id);

                b.HasOne<Abook>()
                    .WithMany()
                    .HasForeignKey(m => m.AbookId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(m => m.DebitAccount)
                    .WithMany()
                    .HasForeignKey(m => m.DebitAccountId)
                    .IsRequired();

                b.HasOne(m => m.CreditAccount)
                    .WithMany()
                    .HasForeignKey(m => m.CreditAccountId)
                    .IsRequired();

                b.OwnsOne(m => m.Fee)
                    .HasOne(m => m.Account)
                    .WithMany()
                    .HasForeignKey(m => m.AccountId);

                b.HasIndex(m => new { m.AccrualDate, m.JournalDiv, m.CreatedDate, m.Id });

                b.HasQueryFilter(m =>
                    m.AbookId == GetCurrentUser().CurrentAbookId);
            });
        }
    }
}
