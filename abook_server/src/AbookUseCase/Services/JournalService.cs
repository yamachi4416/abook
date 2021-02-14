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
    public class JournalService : SharedService<AbookDbContext>
    {
        public JournalService(AbookDbContext context) : base(context)
        {
        }

        public async Task<(JournalViewModel, ServiceModelState)> GetById(string id)
        {
            var user = context.GetCurrentUser();
            var journal = await context.Journals.AsNoTracking()
                .Where(j => j.Id == id)
                .IncludeAccounts()
                .SingleOrDefaultAsync();
            return (JournalViewModel.Of(journal), null);
        }

        private async Task ValidateAccounts(Journal journal, JournalEditModel model)
        {
            var accounts = await context.Accounts.AsNoTracking()
                .WhereIds(model.CreditAccount.Id, model.DebitAccount.Id, model.Fee?.Account.Id)
                .Where(a => a.Avaliable)
                .ToListAsync();

            if (journal.CreditAccountId != model.CreditAccount.Id
                && !accounts.Any(a => a.Id == model.CreditAccount.Id))
            {
                AddError("CreditAccount", SharedResource.NotAvaliableUsed);
            }

            if (journal.DebitAccountId != model.DebitAccount.Id
                && !accounts.Any(a => a.Id == model.DebitAccount.Id))
            {
                AddError("DebitAccount", SharedResource.NotAvaliableUsed);
            }

            if (journal.Fee?.AccountId != model.Fee?.Account.Id
                && model.Fee?.Account.Id != null
                && !accounts.Any(a => a.Id == model.Fee?.Account.Id && a.UseFee))
            {
                AddError("Fee.Account", SharedResource.NotAvaliableUsed);
            }
        }

        public async Task<(string, ServiceModelState)> Create(
            JournalCreateModel model)
        {
            var journal = new Journal
            {
                Id = Guid.NewGuid().ToString()
            };

            await ValidateAccounts(journal, model);

            if (IsServiceFailure)
            {
                return (null, modelState);
            }

            model.Attach(journal);

            await context.Journals.AddAsync(journal);
            await context.SaveChangesAsync();

            return (journal.Id, null);
        }

        public async Task<(JournalViewModel, ServiceModelState)> Update(
            string id,
            JournalUpdateModel model)
        {
            var journal = await context.Journals
                .Where(j => j.Id == id)
                .SingleOrDefaultAsync();

            if (journal == null)
            {
                return (null, null);
            }

            await ValidateAccounts(journal, model);

            if (IsServiceFailure)
            {
                return (null, modelState);
            }

            model.Attach(journal);

            await context.SaveChangesAsync();

            return await GetById(journal.Id);
        }

        public virtual async ValueTask<(bool, ServiceModelState)> Delete(string id)
        {
            var journal = await context.Journals
                .Where(j => j.Id == id)
                .SingleOrDefaultAsync();

            if (journal != null)
            {
                context.Journals.Remove(journal);
                await context.SaveChangesAsync();
            }

            return (true, null);
        }

        public async Task<(IEnumerable<JournalViewModel>, ServiceModelState)> Search(JournalSearchModel search)
        {
            var query = context.Journals
                .IncludeAccounts();

            if (!string.IsNullOrEmpty(search.Memo))
            {
                query = query.Where(j => j.Memo.Contains(search.Memo));
            }

            if (!string.IsNullOrEmpty(search.AccountId))
            {
                query = query.WhereUsedAccountId(search.AccountId);
            }

            if (search.JournalDiv != null)
            {
                query = query.Where(j => j.JournalDiv == search.JournalDiv);
            }

            if (search.FinanceDiv != null)
            {
                query = query.WhereUsedFinaceDiv(search.FinanceDiv);
            }

            if (search.AccrualDateStart != null)
            {
                query = query.Where(j => j.AccrualDate >= search.AccrualDateStart);
            }

            if (search.AccrualDateEnd != null)
            {
                query = query.Where(j => j.AccrualDate <= search.AccrualDateEnd);
            }

            var journlas = await query.AsNoTracking()
                .OrderBy(j => j.AccrualDate)
                .ThenBy(j => j.JournalDiv)
                .ThenBy(j => j.CreatedDate)
                .ThenBy(j => j.Id)
                .Select(j => JournalViewModel.Of(j))
                .ToListAsync();

            return (journlas, null);
        }

        public async Task<(IEnumerable<JournalBalanceModel>, ServiceModelState)> Balance(
            DateTime start, DateTime end, IEnumerable<DateTime> period)
        {
            var pxs = period
                .Where(p => p != start && p != end)
                .OrderBy(p => p);

            var balances = await pxs.Prepend(start).Zip(
                pxs.Select(d => d.AddDays(-1)).Append(end),
                (pStart, pEnd) =>
                {
                    var pKey = pStart.ToString("yyyyMMdd") + pEnd.ToString("yyyyMMdd");

                    return context.Journals
                        .Where(j => pStart <= j.AccrualDate && j.AccrualDate <= pEnd)
                        .SelectMany(j => context.Accounts
                            .Select(a => new
                            {
                                Id = a.Id,
                                DispOrder = a.DispOrder,
                                FinanceDiv = a.FinanceDiv
                            }), (j, a) => new
                            {
                                AccontId = a.Id,
                                CreditAccountId = j.CreditAccountId,
                                DebitAccountId = j.DebitAccountId,
                                Amount = j.Amount ?? 0,
                                FeeAccountId = j.Fee.AccountId,
                                FeeAmount = j.Fee.Amount ?? 0,
                                DispOrder = a.DispOrder,
                                FinanceDiv = a.FinanceDiv
                            })
                        .Where(m => m.AccontId == m.CreditAccountId
                            || m.AccontId == m.DebitAccountId
                            || m.AccontId == m.FeeAccountId)
                        .GroupBy(m => m.AccontId, m => new
                        {
                            AccountId = m.AccontId,
                            CreditAmount = m.CreditAccountId == m.AccontId
                                ? m.Amount - m.FeeAmount : 0,
                            DebitAmount = m.DebitAccountId == m.AccontId
                                ? m.Amount : m.FeeAccountId == m.AccontId ? m.FeeAmount : 0,
                            DispOrder = m.DispOrder,
                            FinanceDiv = m.FinanceDiv
                        })
                        .Select(m => new
                        {
                            Key = pKey,
                            AccountId = m.Key,
                            CreditAmount = m.Sum(g => g.CreditAmount),
                            DebitAmount = m.Sum(g => g.DebitAmount),
                            DispOrder = m.Max(g => g.DispOrder),
                            FinanceDiv = m.Max(g => g.FinanceDiv)
                        });
                })
                .Aggregate((p, m) => p.Concat(m))
                .OrderBy(m => m.Key)
                    .ThenBy(m => m.FinanceDiv).ThenBy(m => m.DispOrder)
                .Select(m => new JournalBalanceModel
                {
                    Key = m.Key,
                    AccountId = m.AccountId,
                    CreditAmount = m.CreditAmount,
                    DebitAmount = m.DebitAmount
                })
                .ToListAsync();

            return (balances, null);
        }
    }
}
