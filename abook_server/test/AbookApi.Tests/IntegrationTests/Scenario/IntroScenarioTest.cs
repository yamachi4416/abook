using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AbookApi.Tests.Infrastructure;
using AbookUseCase.Entities;
using AbookUseCase.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace AbookApi.Tests.IntegrationTests.Scenario
{
    public class IntroScenarioTest : IntegrationTestTemplate
    {
        public IntroScenarioTest(AbookApiFactory factory) : base(factory)
        {
        }

        [Fact(DisplayName = "First-time users can also register journals")]
        public async Task Scenario_A()
        {
            var user = new
            {
                Id = "scenario@example.com",
                Name = "scenario user"
            };

            var client = factory.CreateClient()
                .DefaultAuthorizationBearer(user.Id, user.Name);

            {// Register User
                await client.SendAsync(request => request
                        .ApiRequest(HttpMethod.Put, "/users"))
                    .EnsureStatusCode(HttpStatusCode.OK);

                var created = await db.MUsers.IgnoreQueryFilters()
                    .FirstAsync(m => m.Id == user.Id);

                Assert.Equal(user.Id, created.Id);
                Assert.Equal(user.Id, created.Email);
                Assert.Equal(user.Name, created.Name);
            }

            {// Create Account book
                var abook = new AbookCreateModel
                {
                    Name = "new abook",
                    Memo = "new abook memo",
                    StartOfMonthDate = 1,
                    StartOfMonthIsPrev = false
                };

                // [Post] /abooks
                var created = await client.SendAsync(request => request
                        .ApiRequest(HttpMethod.Post, "/abooks")
                        .ContentWithJSON(abook))
                    .EnsureStatusCode(HttpStatusCode.Created)
                    .ResponseToObjectAsync(new { AbookId = "" });

                Assert.False(string.IsNullOrEmpty(created.AbookId));

                // [Get] /abooks/current
                var current = await client.SendAsync(request => request
                        .ApiRequest(HttpMethod.Get, "/abooks/current"))
                    .EnsureStatusCode(HttpStatusCode.OK)
                    .ResponseToObjectAsync<AbookViewModel>();

                Assert.Equal(created.AbookId, current.AbookId);
                Assert.Equal(abook.Name, current.Name);
                Assert.Equal(abook.Memo, current.Memo);
                Assert.Equal(abook.StartOfMonthDate, current.StartOfMonthDate);
                Assert.Equal(abook.StartOfMonthIsPrev, current.StartOfMonthIsPrev);
            }

            {// Create Accounts
                var accounts = new[] {
                    new AccountCreateModel
                    {
                        Name = "SALARY",
                        Color = "#100000",
                        FinanceDiv = FinanceDiv.Income,
                        Avaliable = true
                    },
                    new AccountCreateModel
                    {
                        Name = "FOOD",
                        Color = "#200001",
                        FinanceDiv = FinanceDiv.Expense,
                        Avaliable = true
                    },
                    new AccountCreateModel
                    {
                        Name = "FEE",
                        Color = "#200002",
                        FinanceDiv = FinanceDiv.Expense,
                        Avaliable = true,
                        UseFee = true
                    },
                    new AccountCreateModel
                    {
                        Name = "MONEY",
                        Color = "#300001",
                        FinanceDiv = FinanceDiv.Assets,
                        Avaliable = true
                    },
                    new AccountCreateModel
                    {
                        Name = "DEPOSIT",
                        Color = "#300002",
                        FinanceDiv = FinanceDiv.Assets,
                        Avaliable = true
                    }
                };

                foreach (var account in accounts)
                {
                    // [Post] /accounts
                    var created = await client.SendAsync(request => request
                            .ApiRequest(HttpMethod.Post, "/accounts")
                            .ContentWithJSON(account))
                        .EnsureStatusCode(HttpStatusCode.Created)
                        .ResponseToObjectAsync(new { Id = "" });

                    Assert.False(string.IsNullOrEmpty(created.Id));

                    // [Get] /accounts/{id}
                    var fetch = await client.SendAsync(request => request
                            .ApiRequest(HttpMethod.Get, $"/accounts/{created.Id}"))
                        .EnsureStatusCode(HttpStatusCode.OK)
                        .ResponseToObjectAsync<AccountViewModel>();

                    Assert.Equal(created.Id, fetch.Id);
                    Assert.Equal(account.Name, fetch.Name);
                    Assert.Equal(account.FinanceDiv, fetch.FinanceDiv);
                    Assert.Equal(account.Color, fetch.Color);
                    Assert.Equal(account.Avaliable, fetch.Avaliable);
                }
            }

            {// Create Journals

                // [Get] /accounts
                var accounts = await client.SendAsync(request => request
                        .ApiRequest(HttpMethod.Get, "/accounts"))
                    .EnsureStatusCode(HttpStatusCode.OK)
                    .ResponseToObjectAsync<AccountViewModel[]>();

                Assert.Equal(5, accounts.Count());
                Assert.Equal(new[] { 1, 1, 2, 1, 2 }, accounts.Select(m => m.DispOrder).ToArray());

                var selectAccounts = accounts
                    .ToDictionary(m => m.Name, m => new JounalEditAccountModel { Id = m.Id });

                var journals = new[] {
                    new JournalCreateModel
                    {
                        AccrualDate = DateTime.UtcNow.Date,
                        JournalDiv = JournalDiv.Income,
                        DebitAccount = selectAccounts["MONEY"],
                        CreditAccount = selectAccounts["SALARY"],
                        Amount = 190000
                    },
                    new JournalCreateModel
                    {
                        AccrualDate = DateTime.UtcNow.AddDays(1).Date,
                        JournalDiv = JournalDiv.Expense,
                        DebitAccount = selectAccounts["FOOD"],
                        CreditAccount = selectAccounts["MONEY"],
                        Amount = 16000
                    },
                    new JournalCreateModel
                    {
                        AccrualDate = DateTime.UtcNow.AddDays(2).Date,
                        JournalDiv = JournalDiv.Transfer,
                        DebitAccount = selectAccounts["DEPOSIT"],
                        CreditAccount = selectAccounts["MONEY"],
                        Amount = 50000
                    },
                    new JournalCreateModel
                    {
                        AccrualDate = DateTime.UtcNow.AddDays(2).Date,
                        JournalDiv = JournalDiv.Transfer,
                        DebitAccount = selectAccounts["DEPOSIT"],
                        CreditAccount = selectAccounts["MONEY"],
                        Fee = new FeeEditModel
                        {
                            Account = selectAccounts["FEE"],
                            Amount = 210
                        },
                        Amount = 8890
                    }
                };

                foreach (var journal in journals)
                {
                    // [Post] /journals
                    var created = await client.SendAsync(request => request
                            .ApiRequest(HttpMethod.Post, "/journals")
                            .ContentWithJSON(journal))
                        .EnsureStatusCode(HttpStatusCode.Created)
                        .ResponseToObjectAsync(new { Id = "" });

                    Assert.False(string.IsNullOrEmpty(created.Id));

                    // [Get] /journals/{id}
                    var fetch = await client.SendAsync(request => request
                            .ApiRequest(HttpMethod.Get, $"/journals/{created.Id}"))
                        .EnsureStatusCode(HttpStatusCode.OK)
                        .ResponseToObjectAsync<JournalViewModel>();

                    Assert.Equal(created.Id, fetch.Id);
                    Assert.Equal(journal.AccrualDate, fetch.AccrualDate);
                    Assert.Equal(journal.JournalDiv, fetch.JournalDiv);
                    Assert.Equal(journal.DebitAccount.Id, fetch.DebitAccount.Id);
                    Assert.Equal(journal.CreditAccount.Id, fetch.CreditAccount.Id);
                    Assert.Equal(journal.Fee?.Account.Id, fetch.Fee?.Account.Id);
                    Assert.Equal(journal.Fee?.Amount, fetch.Fee?.Amount);
                }
            }
        }
    }
}
