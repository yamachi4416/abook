using System.Collections;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Localization;

namespace AppBase.Infrastructure.Services
{
    public class ServiceModelStateEntry
    {
        public string Key { get; set; }

        public string Message { get; set; }

        public object[] Param { get; set; }
    }

    public class ServiceModelState
    {
        private readonly ICollection<ServiceModelStateEntry> Errors;

        public bool HasError => Errors.Count != 0;

        public ServiceModelState()
        {
            this.Errors = new List<ServiceModelStateEntry>();
        }

        public void AddError(string key, string message, params object[] args)
        {
            Errors.Add(new ServiceModelStateEntry
            {
                Key = key,
                Message = message,
                Param = args
            });
        }

        public ModelStateDictionary WriteTo(
            ModelStateDictionary modelState, IStringLocalizer localizer)
        {
            foreach (var error in Errors)
            {
                modelState.AddModelError(
                    error.Key,
                    localizer.GetString(error.Message, error.Param));
            }

            return modelState;
        }
    }
}
