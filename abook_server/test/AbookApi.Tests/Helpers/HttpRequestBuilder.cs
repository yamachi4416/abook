using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Reflection;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Primitives;

namespace AbookApi.Tests.Helpers
{
    public class HttpRequestBuilder
    {
        private HttpMethod method;

        private string requestUri;

        private IDictionary<string, StringValues> param;

        private readonly HttpRequestMessage request;

        public HttpRequestBuilder()
        {
            this.param = new Dictionary<string, StringValues>();
            this.request = new HttpRequestMessage();
        }

        public HttpRequestBuilder(HttpMethod method, string requestUri) : this()
        {
            Request(method, requestUri);
        }

        public HttpRequestBuilder(string method, string requestUri) : this()
        {
            Request(method, requestUri);
        }

        private HttpRequestBuilder Method(string method)
        {
            this.Method(new HttpMethod(method));
            return this;
        }

        private HttpRequestBuilder Method(HttpMethod method)
        {
            this.method = method;
            return this;
        }

        private HttpRequestBuilder RequestUri(string requestUri)
        {
            this.requestUri = requestUri;
            return this;
        }

        public HttpRequestBuilder Request(string method, string requestUri)
        {
            return Method(method).RequestUri(requestUri);
        }

        public HttpRequestBuilder Request(HttpMethod method, string requestUri)
        {
            return Method(method).RequestUri(requestUri);
        }

        public HttpRequestBuilder ApiRequest(string method, string requestUri)
        {
            AcceptJSON();
            return Method(method).RequestUri(requestUri);
        }

        public HttpRequestBuilder ApiRequest(HttpMethod method, string requestUri)
        {
            AcceptJSON();
            return Method(method).RequestUri(requestUri);
        }

        public HttpRequestBuilder AcceptJSON()
        {
            request.Headers.Accept.Add(
                new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
            return this;
        }

        public HttpRequestBuilder ContentWithJSON(string json)
        {
            if (!string.IsNullOrEmpty(json))
            {
                request.Content = new StringContent(
                    json, Encoding.UTF8, MediaTypeNames.Application.Json);
            }
            return this;
        }

        public HttpRequestBuilder ContentWithJSON(object value)
        {
            var json = JsonSerializer.Serialize(value, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            request.Content = new StringContent(
                json, Encoding.UTF8, MediaTypeNames.Application.Json);

            return this;
        }

        public HttpRequestBuilder AddHeader(string name, string value)
        {
            request.Headers.Add(name, value);
            return this;
        }

        public HttpRequestBuilder AbookIdHeader(string abookId)
        {
            return AddHeader("X-Abook-Id", abookId);
        }

        public HttpRequestBuilder AuthorizationBearer(string email, string name, DateTime? expires = null)
        {
            request.Headers.Authorization = new AuthenticationHeaderValue(
                "Bearer", JwtHelper.CreateToken(email, name, expires));
            return this;
        }

        public HttpRequestBuilder Setup(Action<HttpRequestBuilder> setup)
        {
            setup(this);
            return this;
        }

        public HttpRequestBuilder AddParam(string name, object value)
        {

            if (value != null)
            {
                if (param.ContainsKey(name))
                {
                    param[name] = StringValues.Concat(param[name], value.ToString());
                }
                else
                {
                    param.Add(name, new StringValues(value.ToString()));
                }
            }

            return this;
        }


        public HttpRequestBuilder AddParam(string name, IEnumerable<object> values)
        {

            foreach (var val in values)
            {
                AddParam(name, val);
            }

            return this;
        }

        public HttpRequestBuilder AddParams(object values)
        {
            if (values == null)
            {
                return this;
            }

            foreach (var p in values.GetType().GetRuntimeFields().Where(p => p.IsPublic))
            {
                AddParam(p.Name, p.GetValue(values));
            }

            foreach (var p in values.GetType().GetRuntimeProperties().Where(p => p.CanRead))
            {
                AddParam(p.Name, p.GetValue(values));
            }

            return this;
        }

        public HttpRequestMessage Build()
        {
            request.Method = method;

            if (!param.Any())
            {
                request.RequestUri = new Uri(requestUri, UriKind.RelativeOrAbsolute);
            }
            else
            {
                request.RequestUri = new Uri(
                    QueryHelpers.AddQueryString(requestUri, param),
                    UriKind.RelativeOrAbsolute);
            }

            return request;
        }

        public static HttpRequestBuilder New()
        {
            return new HttpRequestBuilder();
        }
    }
}
