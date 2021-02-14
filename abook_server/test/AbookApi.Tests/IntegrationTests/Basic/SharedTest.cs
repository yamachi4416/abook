using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AbookApi.Tests.Infrastructure;
using AbookApi.Tests.Infrastructure.Attributes;
using Xunit;

namespace AbookApi.Tests.IntegrationTests.Basic
{
    public abstract class SharedTest : IntegrationTestTemplate
    {
        public SharedTest(AbookApiFactory factory) : base(factory)
        {
        }

        public virtual async Task Access_TestCase(AccessTestCase arg)
        {
            var resp = await factory.CreateClient()
                .SendAsync(request =>
                {
                    request.ApiRequest(arg.Method, arg.Url);

                    if (!string.IsNullOrEmpty(arg.UserId))
                    {
                        request.AuthorizationBearer(email: arg.UserId, name: arg.UserId);
                    }

                    if (!string.IsNullOrEmpty(arg.XAbookId))
                    {

                        request.AbookIdHeader(arg.XAbookId);
                    }

                    if (!string.IsNullOrEmpty(arg.RequestBody))
                    {
                        request.ContentWithJSON(arg.RequestBody);
                    }
                });

            if (arg.StatusCode != resp.StatusCode)
            {
                var content = await resp.Content.ReadAsStringAsync();
                Assert.True(false, $"StatusCode MisMatch\n"
                    + $"Expected: {arg.StatusCode}\nActual: {resp.StatusCode}\nResponse: {content}");
            }
        }

        public virtual async Task Request_BasicCase(BasicTestCase arg)
        {
            var resp = await factory
                .CreateClient()
                .SendAsync(request =>
                {
                    request.ApiRequest(arg.Method, arg.Url);

                    if (!string.IsNullOrEmpty(arg.RequestBody))
                    {
                        request.ContentWithJSON(arg.RequestBody);
                    }

                    if (!string.IsNullOrEmpty(arg.UserId))
                    {
                        request.AuthorizationBearer(email: arg.UserId, name: arg.UserId.Split("@")[0]);
                    }

                    if (!string.IsNullOrEmpty(arg.XAbookId))
                    {
                        request.AbookIdHeader(arg.XAbookId);
                    }
                });

            if (arg.StatusCode != resp.StatusCode)
            {
                var content = await resp.Content.ReadAsStringAsync();
                Assert.True(false, $"StatusCode MisMatch\n"
                    + $"Expected: {arg.StatusCode}\nActual: {resp.StatusCode}\nResponse: {content}");
            }

            if (!string.IsNullOrEmpty(arg.JsonPath))
            {
                var json = await resp.ResponseToJsonTokenAsync();
                var val = string.Join(",", json.SelectTokens(arg.JsonPath));

                if (!Regex.IsMatch(val ?? "", arg.Match))
                {
                    Assert.True(false, $"JsonPath MisMatch {arg.JsonPath}\n"
                        + $"Expected: {arg.Match}\nActual: {val}\nResponse: {json?.ToString()}");
                }
            }
        }
    }
}
