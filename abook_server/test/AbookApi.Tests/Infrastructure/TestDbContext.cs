using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using AbookApi.Infrastructure;
using AbookUseCase.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AbookApi.Tests.Infrastructure
{
    internal class TestDbContext : AbookApiDbContext
    {
        public TestDbContext(
            DbContextOptions options,
            IHttpContextAccessor httpAccessor) : base(options, httpAccessor)
        {
        }

        private IEnumerable<(IMutableEntityType, PropertyInfo)> GetTypeproperties(
            ModelBuilder modelBuilder, params Type[] types)
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var prop in entityType.ClrType.GetProperties())
                {
                    if (types.Contains(prop.PropertyType))
                    {
                        yield return (entityType, prop);
                    }
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var (entityType, prop) in GetTypeproperties(
                modelBuilder, typeof(DateTimeOffset), typeof(DateTimeOffset?)))
            {
                modelBuilder
                    .Entity(entityType.Name)
                    .Property(prop.Name)
                    .HasConversion(new DateTimeOffsetToStringConverter());
            }

            modelBuilder
                .Entity<Journal>()
                .Property(j => j.AccrualDate)
                .HasConversion(
                    v => v.Value.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    v => DateTime.ParseExact(v,
                        new string[] { "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss" },
                        CultureInfo.InvariantCulture, DateTimeStyles.None)
                );
        }
    }
}
