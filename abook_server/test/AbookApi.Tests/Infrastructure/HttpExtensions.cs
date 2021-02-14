using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using AbookApi.Tests.Helpers;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Xunit;

namespace AbookApi.Tests.Infrastructure
{
    internal static class HttpExtensions
    {
        public static async Task<JToken> ResponseToJsonTokenAsync(this HttpResponseMessage message)
        {
            return JsonConvert.DeserializeObject(
                await message.Content.ReadAsStringAsync(),
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }) as JToken;
        }

        public static Task<HttpResponseMessage> EnsureStatusCode(
            this Task<HttpResponseMessage> task, HttpStatusCode statusCode)
        {
            return task.ContinueWith(t =>
            {
                Assert.Equal(statusCode, t.Result.StatusCode);
                return t.Result;
            });
        }

        public static async Task<JToken> ResponseToJsonTokenAsync(this Task<HttpResponseMessage> task)
        {
            var message = await task;
            return await message.ResponseToJsonTokenAsync();
        }

        public static async Task<T> ResponseToObjectAsync<T>(this HttpResponseMessage message)
        {
            return JsonConvert.DeserializeObject<T>(
                await message.Content.ReadAsStringAsync(),
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });
        }

        public static async Task<T> ResponseToObjectAsync<T>(this Task<HttpResponseMessage> task)
        {
            var message = await task;
            return await message.ResponseToObjectAsync<T>();
        }

        public static async Task<T> ResponseToObjectAsync<T>(this Task<HttpResponseMessage> task, T obj)
        {
            var message = await task;
            return await message.ResponseToObjectAsync<T>();
        }

        public static async Task<HttpResponseMessage> SendAsync(
            this HttpClient client, Action<HttpRequestBuilder> setup)
        {
            return await client.SendAsync(
                HttpRequestBuilder.New()
                    .AddHeader(HeaderNames.AcceptLanguage, Thread.CurrentThread.CurrentUICulture.Name)
                    .Setup(setup)
                    .Build());
        }

        public static HttpClient DefaultAuthorizationBearer(
            this HttpClient client, string email, string userName)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Bearer", JwtHelper.CreateToken(email, userName));
            return client;
        }
    }
}
