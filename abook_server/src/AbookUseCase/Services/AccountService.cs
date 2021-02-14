using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AbookUseCase.Entities;
using AbookUseCase.Models;
using AbookUseCase.Resources;
using AppBase.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace AbookUseCase.Services
{
    public class AccountService : SharedService<AbookDbContext>
    {
        public AccountService(AbookDbContext context) : base(context)
        {
        }

        public virtual async Task<(AccountViewModel, ServiceModelState)> GetById(string id)
        {
            var account = await context.Accounts.AsNoTracking()
                .WhereById(id)
                .SingleOrDefaultAsync();

            return (AccountViewModel.Of(account), null);
        }

        public virtual async Task<(IEnumerable<AccountViewModel>, ServiceModelState)> GetCurrentAll()
        {
            var accounts = await context.Accounts.AsNoTracking()
                .OrderBy(a => a.FinanceDiv)
                .ThenBy(a => a.DispOrder)
                .ThenBy(a => a.Id)
                .Select(x => AccountViewModel.Of(x))
                .ToListAsync();

            return (accounts, null);
        }

        private async ValueTask UpdateUsuallyUsed(Account account)
        {
            if (account.UsuallyUsedForPayment)
            {
                await context.Accounts
                    .Where(a => a.Id != account.Id && a.UsuallyUsedForPayment == true)
                    .ForEachAsync(a => { a.UsuallyUsedForPayment = false; });
            }

            if (account.UsuallyUsedForReceipt)
            {
                await context.Accounts
                    .Where(a => a.Id != account.Id && a.UsuallyUsedForReceipt == true)
                    .ForEachAsync(a => { a.UsuallyUsedForReceipt = false; });
            }
        }

        public virtual async Task<(string, ServiceModelState)> Create(
            AccountCreateModel model)
        {
            var account = new Account
            {
                Id = Guid.NewGuid().ToString(),
            };

            model.Attach(account);

            await UpdateUsuallyUsed(account);

            account.DispOrder = (
                await context.Accounts.AsNoTracking()
                    .Where(a => a.FinanceDiv == account.FinanceDiv)
                    .MaxAsync(a => (int?)a.DispOrder) ?? 0) + 1;

            await context.Accounts.AddAsync(account);
            await context.SaveChangesAsync();

            return (account.Id, null);
        }

        public virtual async Task<(AccountViewModel, ServiceModelState)> Update(
            string id, AccountUpdateModel model)
        {
            var edit = await context.Accounts
                .WhereById(id)
                .SingleOrDefaultAsync();

            if (edit == null)
            {
                return (null, null);
            }

            model.Attach(edit);

            await UpdateUsuallyUsed(edit);
            await context.SaveChangesAsync();

            return (AccountViewModel.Of(edit), null);
        }

        public virtual async Task<(bool, ServiceModelState)> Delete(string id)
        {
            var del = await context.Accounts
                .WhereById(id)
                .SingleOrDefaultAsync();

            if (del != null)
            {
                var used = await context.Journals.AsNoTracking()
                    .WhereUsedAccountId(del.Id)
                    .AnyAsync();

                if (used)
                {
                    AddError("*", SharedResource.ServiceErrorNotDeletableOfUsed);
                }

                if (IsServiceFailure)
                {
                    return (false, modelState);
                }

                context.Accounts.Remove(del);
                await context.SaveChangesAsync();
            }

            return (true, null);
        }

        public virtual async Task<(bool, ServiceModelState)> UpdateDispOrders(IEnumerable<string> ids)
        {
            var idsmap = ids.Select((id, i) => (id, i))
                .ToDictionary(x => x.id, x => x.i);

            var accounts = await context.Accounts
                .ToListAsync();

            accounts
                .ToLookup(a => a.FinanceDiv)
                .SelectMany(xa => xa
                    .OrderBy(a => idsmap.GetValueOrDefault(a.Id, int.MaxValue))
                    .Select((acc, idx) => (acc, idx: idx + 1)))
                .ToList()
                .ForEach(x => x.acc.DispOrder = x.idx);

            await context.SaveChangesAsync();

            return (true, null);
        }
    }
}
