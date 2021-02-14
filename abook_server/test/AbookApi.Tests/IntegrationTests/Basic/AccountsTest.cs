using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AbookApi.Tests.Infrastructure;
using AbookApi.Tests.Infrastructure.Attributes;
using Xunit;

namespace AbookApi.Tests.IntegrationTests.Basic
{
    public class AccountsTest : SharedTest
    {
        public AccountsTest(AbookApiFactory factory) : base(factory)
        {
        }

        [Theory(DisplayName = "Accounts " + nameof(Access_TestCase))]
        [AccessTestCase(Filter = "[Url] Like '/accounts*'")]
        public override async Task Access_TestCase(AccessTestCase arg)
        {
            await base.Access_TestCase(arg);
        }

        [Theory(DisplayName = "Accounts " + nameof(Request_BasicCase))]
        [BasicTestCase(Filter = "[Url] LIKE '/accounts*'")]
        public override async Task Request_BasicCase(BasicTestCase arg)
        {
            await base.Request_BasicCase(arg);
        }

        [Fact(DisplayName = "Accounts UpdateDispOrder Case")]
        public async Task UpdateDispOrderCase()
        {
            Func<string, Task<IEnumerable<string>>> accountIds =
                async orderby => await RawSqlReaderAsync($@"
                    select id from account where abook_id = ""2""
                    order by {orderby}",
                r => r["id"] as string);

            var ids = await accountIds("id desc");

            await factory.CreateClient()
                .SendAsync(request => request
                    .ApiRequest(HttpMethod.Patch, "/accounts/dispOrders")
                    .AuthorizationBearer(email: "test01@example.com", name: "test01")
                    .ContentWithJSON(ids))
                .EnsureStatusCode(HttpStatusCode.OK)
                .ResponseToJsonTokenAsync();

            Assert.Equal(
                await accountIds("finance_div, id desc"),
                await accountIds("finance_div, disp_order"));
        }
    }
}
