using System;
using System.Net;
using AbookApi.Tests.Infrastructure.Abstractions;

namespace AbookApi.Tests.Infrastructure.Attributes
{
    public class BasicTestCase : SerializableCaseArgument
    {
        public int No { get; set; }

        public string Url { get; set; }

        public string Method { get; set; }

        public string UserId { get; set; }

        public string XAbookId { get; set; }

        public HttpStatusCode StatusCode { get; set; }

        public string RequestBody { get; set; }

        public string JsonPath { get; set; }

        public string Match { get; set; }

        public override string ToString()
        {
            return $"No.{No} [{Method}] [{Url}]";
        }
    }

    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public class BasicTestCaseAttribute : TestCaseExcelDataAttribute
    {
        public BasicTestCaseAttribute()
        {
            TableName = "basic_case";
            DataType = typeof(BasicTestCase);
        }
    }
}
