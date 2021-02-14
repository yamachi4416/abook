using System.Threading.Tasks;
using AbookApi.Tests.Infrastructure;
using AbookApi.Tests.Infrastructure.Attributes;
using Xunit;

namespace AbookApi.Tests.IntegrationTests.Basic
{
    public class UsersTest : SharedTest
    {
        public UsersTest(AbookApiFactory factory) : base(factory)
        {
        }

        [Theory(DisplayName = "Users " + nameof(Access_TestCase))]
        [AccessTestCase(Filter = "[Url] LIKE '/users*'")]
        public override async Task Access_TestCase(AccessTestCase arg)
        {
            await base.Access_TestCase(arg);
        }

        [Theory(DisplayName = "Users " + nameof(Request_BasicCase))]
        [BasicTestCase(Filter = "[Url] LIKE '/users*'")]
        public override async Task Request_BasicCase(BasicTestCase arg)
        {
            await base.Request_BasicCase(arg);
        }
    }
}
