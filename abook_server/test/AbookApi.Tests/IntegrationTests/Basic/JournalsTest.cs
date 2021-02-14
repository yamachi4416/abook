using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AbookApi.Tests.Infrastructure.Abstractions;
using AbookApi.Tests.Infrastructure;
using AbookApi.Tests.Infrastructure.Attributes;
using AbookUseCase.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace AbookApi.Tests.IntegrationTests.Basic
{
    public class JournalsTest : SharedTest
    {
        public JournalsTest(AbookApiFactory factory) : base(factory)
        {
        }

        [Theory(DisplayName = "Journals " + nameof(Access_TestCase))]
        [AccessTestCase(Filter = "[Url] LIKE '/journals*'")]
        public override async Task Access_TestCase(AccessTestCase arg)
        {
            await base.Access_TestCase(arg);
        }

        [Theory(DisplayName = "Journals " + nameof(Request_BasicCase))]
        [BasicTestCase(Filter = "[Url] LIKE '/journals*'")]
        public override async Task Request_BasicCase(BasicTestCase arg)
        {
            await base.Request_BasicCase(arg);
        }

        [Theory(DisplayName = "Journals Search Case")]
        [TestCaseExcelData(TableName = "journal_search_case", DataType = typeof(JournalSearchTestCase))]
        public async Task Journal_Search_Case(JournalSearchTestCase arg)
        {
            var json = await factory.CreateClient()
                .SendAsync(request => request
                    .ApiRequest(HttpMethod.Get, $"/journals/search?{arg.Query}")
                    .AuthorizationBearer(email: arg.UserId, name: arg.UserId))
                .EnsureStatusCode(HttpStatusCode.OK)
                .ResponseToJsonTokenAsync();

            int actualCount = json.Count();
            Assert.True(arg.Count == json.Count(),
                $"Count MisMatch\nExpected: {arg.Count}\nActual: {actualCount}");

            int actualAmount = json.SelectTokens("$[*].amount").Values<int>().Sum();
            Assert.True(arg.Amount == actualAmount,
                $"Amount MisMatch\nExpected: {arg.Amount}\nActual: {actualAmount}");
        }

        [Theory(DisplayName = "Jorunals Balance Case")]
        [TestCaseExcelData(TableName = "balance_case", DataType = typeof(JournalBalanceTestCase))]
        public async Task Journal_Balance_Case(JournalBalanceTestCase arg)
        {
            var actual = (await factory.CreateClient()
                .SendAsync(request => request
                    .ApiRequest(HttpMethod.Get, $"/journals/balance{arg.Url}")
                    .AuthorizationBearer(email: arg.UserId, name: arg.UserId))
                .EnsureStatusCode(HttpStatusCode.OK)
                .ResponseToObjectAsync<JournalBalanceModel[]>())
                .ToArray();

            var expected = JsonConvert.DeserializeObject<JournalBalanceModel[]>(arg.Balance);

            Assert.True(expected.SequenceEqual(actual),
                $"Balance MisMatch\nExpected: {expected}\n Actual: {actual}");
        }
    }

    public class JournalSearchTestCase : SerializableCaseArgument
    {
        public int No { get; set; }
        public string UserId { get; set; }
        public string Query { get; set; }
        public int Count { get; set; }
        public int Amount { get; set; }

        public override string ToString()
        {
            return $"No.{No}";
        }
    }

    public class JournalBalanceTestCase : SerializableCaseArgument
    {
        public int No { get; set; }
        public string Url { get; set; }
        public string UserId { get; set; }
        public string Balance { get; set; }

        public override string ToString()
        {
            return $"No.{No}";
        }
    }
}
