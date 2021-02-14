using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using AbookApi.Tests.Resources;
using Xunit.Sdk;

namespace AbookApi.Tests.Infrastructure.Attributes
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public class TestCaseExcelDataAttribute : DataAttribute
    {
        public string TableName { get; set; }

        public string Filter { get; set; }

        public Type DataType { get; set; }

        public TestCaseExcelDataAttribute()
        {

        }

        public override IEnumerable<object[]> GetData(MethodInfo testMethod)
        {
            var view = TestCaseExcel.Data.Tables[TableName].AsDataView();

            if (!string.IsNullOrEmpty(Filter))
            {
                view.RowFilter = Filter;
            }

            if (DataType == null)
            {
                foreach (var row in view.ToTable().AsEnumerable())
                {
                    yield return testMethod.GetParameters()
                        .Select(p => ConvertTo(row[p.Name], p.ParameterType))
                        .ToArray();
                }
            }
            else
            {
                foreach (var row in view.ToTable().AsEnumerable())
                {
                    var o = Activator.CreateInstance(DataType);
                    foreach (var p in DataType.GetRuntimeProperties())
                    {
                        p.SetValue(o, ConvertTo(row[p.Name], p.PropertyType));
                    }

                    yield return new[] { o };
                }
            }
        }

        protected object ConvertTo(object val, Type type)
        {
            if (type.IsEnum)
            {
                return Enum.ToObject(type, (int)Convert.ChangeType(val, typeof(int)));
            }
            else if (type.GetInterfaces().Any(i => i == typeof(IConvertible)))
            {
                return Convert.ChangeType(val, type);
            }

            return JsonSerializer.Deserialize(val as string, type);
        }
    }
}
