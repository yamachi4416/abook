using System.Threading.Tasks;
using AbookApi.Tests.Infrastructure;
using AbookApi.Tests.Infrastructure.Attributes;
using Xunit;

namespace AbookApi.Tests.IntegrationTests.Basic
{
    public class AbooksTest : SharedTest
    {
        public AbooksTest(AbookApiFactory factory) : base(factory)
        {
        }

        [Theory(DisplayName = "Abooks " + nameof(Access_TestCase))]
        [AccessTestCase(Filter = "[Url] Like '/abooks*'")]
        public override async Task Access_TestCase(AccessTestCase arg)
        {
            await base.Access_TestCase(arg);
        }

        [Theory(DisplayName = "Abooks " + nameof(Request_BasicCase))]
        [BasicTestCase(Filter = "[Url] LIKE '/abooks*'")]
        public override async Task Request_BasicCase(BasicTestCase arg)
        {
            await base.Request_BasicCase(arg);
        }
    }
}
