using System.Collections.Generic;
using System.Linq;
using AppBase.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace AppBase.Infrastructure.Helpers
{
    public static class ModelErrorInfoHelper
    {
        public static IDictionary<string, IEnumerable<ModelErrorInfo>> ExchangeModelErrorInfo(
            ModelStateDictionary modelSate, string name = "")
        {
            var prefix = string.IsNullOrEmpty(name) ? "" : name + ".";
            return modelSate
                .Where(m => m.Value.Errors.Any())
                .ToDictionary(
                    m => convertKey(prefix + m.Key),
                    m => m.Value.Errors.Select(x => new ModelErrorInfo
                    {
                        Key = convertKey(prefix + m.Key),
                        Error = x.ErrorMessage
                    }));
        }

        private static string convertKey(string key)
        {
            return string.Join(".", key.Split(".").Select(x => camelCase(x)));
        }

        private static string camelCase(string val)
        {
            if (string.IsNullOrEmpty(val))
            {
                return string.Empty;
            }
            return char.ToLower(val[0]) + (val.Length > 1 ? val.Substring(1) : string.Empty);
        }
    }
}
