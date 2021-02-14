using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.Extensions.Localization;

namespace AppBase.Infrastructure.Attributes
{
    public class CustomValidationAttributeAdapterProvider : IValidationAttributeAdapterProvider
    {
        private readonly IValidationAttributeAdapterProvider _baseProvider = new ValidationAttributeAdapterProvider();

        public IAttributeAdapter GetAttributeAdapter(
            ValidationAttribute attribute, IStringLocalizer stringLocalizer)
        {
            if (attribute is CustomValidationAttribute attr)
            {
                return new CustomValidationAttributeProvider(attr, stringLocalizer);
            }
            return _baseProvider.GetAttributeAdapter(attribute, stringLocalizer);
        }
    }

    public abstract class CustomValidationAttribute : ValidationAttribute
    {
        public abstract object[] GetArguments();
    }

    public class CustomValidationAttributeProvider : AttributeAdapterBase<CustomValidationAttribute>
    {
        public CustomValidationAttributeProvider(
            CustomValidationAttribute attribute, IStringLocalizer stringLocalizer)
                : base(attribute, stringLocalizer)
        {
        }

        public override void AddValidation(ClientModelValidationContext context)
        {
        }

        public override string GetErrorMessage(ModelValidationContextBase validationContext)
        {
            if (validationContext == null)
            {
                throw new ArgumentNullException(nameof(validationContext));
            }

            return GetErrorMessage(
                validationContext.ModelMetadata,
                validationContext.ModelMetadata.GetDisplayName(),
                Attribute.GetArguments());
        }
    }
}
