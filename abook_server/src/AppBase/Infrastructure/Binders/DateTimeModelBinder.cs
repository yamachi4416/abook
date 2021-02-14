using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AppBase.Infrastructure.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AppBase.Infrastructure.Binders
{
    public class DateTimeModelBinderProvider : IModelBinderProvider
    {
        static readonly DateTimeStyles SupportedStyles =
            DateTimeStyles.AdjustToUniversal | DateTimeStyles.AllowWhiteSpaces;

        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            if (TryGetDateTimeFormatAttribute(context, out var df))
            {
                var modelType = context.Metadata.UnderlyingOrModelType;
                var loggerFactory = context.Services.GetRequiredService<ILoggerFactory>();
                var mvcOptions = context.Services.GetRequiredService<IOptions<MvcOptions>>().Value;
                var dateTimeBinder = new DateTimeModelBinder(df, SupportedStyles);

                if (modelType == typeof(DateTime))
                {
                    return dateTimeBinder;
                }

                if (modelType.IsArray)
                {
                    return CreateInstance(context, dateTimeBinder,
                        typeof(ArrayModelBinder<>).MakeGenericType(context.Metadata.ElementType));
                }

                if (IsGenericIEnumarable(modelType))
                {
                    return CreateInstance(context, dateTimeBinder,
                        typeof(CollectionModelBinder<>).MakeGenericType(modelType.GenericTypeArguments[0]));
                }
            }

            return null;
        }

        private static bool IsGenericIEnumarable(Type modelType)
        {
            if (!modelType.IsGenericType)
            {
                return false;
            }

            if (modelType.GetGenericTypeDefinition() == typeof(IEnumerable<>))
            {
                return true;
            }

            return modelType.GetInterfaces()
                .Where(m => m.IsGenericType)
                .Where(m => m.GetGenericTypeDefinition() == typeof(IEnumerable<>))
                .Any();
        }

        private static IModelBinder CreateInstance(
            ModelBinderProviderContext context, IModelBinder elementBinder, Type containerType)
        {
            var loggerFactory = context.Services.GetRequiredService<ILoggerFactory>();
            var mvcOptions = context.Services.GetRequiredService<IOptions<MvcOptions>>().Value;
            var binder = (IModelBinder)Activator.CreateInstance(
                containerType,
                elementBinder,
                loggerFactory,
                true,
                mvcOptions);

            return binder;
        }

        private static bool TryGetDateTimeFormatAttribute(
            ModelBinderProviderContext context, out DateTimeFormatAttribute attr)
        {
            attr = null;

            if (context.Metadata is DefaultModelMetadata md)
            {
                attr = md.Attributes.Attributes
                    .Where(a => a is DateTimeFormatAttribute)
                    .Cast<DateTimeFormatAttribute>()
                    .SingleOrDefault();

                if (attr != null)
                {
                    return true;
                }
            }

            return false;
        }
    }

    public class DateTimeModelBinder : IModelBinder
    {
        private readonly DateTimeFormatAttribute dateTimeFormatAttribute;

        private readonly DateTimeStyles supportedStyles;

        public DateTimeModelBinder(
            DateTimeFormatAttribute dateTimeFormatAttribute,
            DateTimeStyles supportedStyles)
        {
            this.dateTimeFormatAttribute = dateTimeFormatAttribute;
            this.supportedStyles = supportedStyles;
        }

        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
            {
                throw new ArgumentNullException(nameof(bindingContext));
            }

            var modelName = bindingContext.ModelName;
            var valueProviderResult = bindingContext.ValueProvider.GetValue(modelName);
            if (valueProviderResult == ValueProviderResult.None)
            {
                return Task.CompletedTask;
            }

            var modelState = bindingContext.ModelState;
            modelState.SetModelValue(modelName, valueProviderResult);

            var metadata = bindingContext.ModelMetadata;
            var type = metadata.UnderlyingOrModelType;

            var value = valueProviderResult.FirstValue;
            var model = dateTimeFormatAttribute.Parse(value, supportedStyles);
            if (model == null && !metadata.IsReferenceOrNullableType)
            {
                modelState.TryAddModelError(
                    modelName,
                    metadata.ModelBindingMessageProvider.ValueMustNotBeNullAccessor(
                        valueProviderResult.ToString()));
            }
            else
            {
                bindingContext.Result = ModelBindingResult.Success(model);
            }

            return Task.CompletedTask;
        }
    }
}
