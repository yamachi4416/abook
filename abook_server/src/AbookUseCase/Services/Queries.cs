using System;
using System.Linq;
using AbookUseCase.Entities;
using Microsoft.EntityFrameworkCore;

namespace AbookUseCase.Services
{
    internal static class AbookQueries
    {
        public static IQueryable<Abook> WhereById(
            this IQueryable<Abook> query, string abookId)
        {
            return query
                .Where(a => a.AbookId == abookId
                    && a.AbookMembers.Any());
        }
    }

    internal static class AbookMemberQueries
    {
        public static IQueryable<string> GetMemberAbookIds(
            this IQueryable<AbookMember> query, string userId)
        {
            return query
                .IgnoreAutoIncludes()
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.Priority)
                .Select(m => m.AbookId);
        }
    }

    internal static class AccountQueries
    {
        public static IQueryable<Account> WhereById(
            this IQueryable<Account> query, string id)
        {
            return query.Where(a => a.Id == id);
        }

        public static IQueryable<Account> WhereIds(
            this IQueryable<Account> query, params string[] ids)
        {
            var iids = ids
                .Where(id => !string.IsNullOrEmpty(id))
                .ToArray();

            return query
                .Where(a => iids.Contains(a.Id));
        }
    }

    internal static class JournalQueries
    {
        public static IQueryable<Journal> WhereUsedAccountId(
            this IQueryable<Journal> query, string accountId
        )
        {
            return query
                .Where(j => j.DebitAccountId == accountId
                    || j.CreditAccountId == accountId
                    || j.Fee.AccountId == accountId);
        }

        public static IQueryable<Journal> WhereUsedFinaceDiv(
            this IQueryable<Journal> query, FinanceDiv? financeDiv
        )
        {
            return query
                .Where(j => j.DebitAccount.FinanceDiv == financeDiv
                    || j.CreditAccount.FinanceDiv == financeDiv
                    || j.Fee.Account.FinanceDiv == financeDiv);
        }

        public static IQueryable<Journal> IncludeAccounts(this IQueryable<Journal> query)
        {
            return query
                .Include(m => m.CreditAccount)
                .Include(m => m.DebitAccount)
                .Include(m => m.Fee.Account);
        }
    }
}
