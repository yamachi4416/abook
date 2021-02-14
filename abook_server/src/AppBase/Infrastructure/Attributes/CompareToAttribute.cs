using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace AppBase.Infrastructure.Attributes
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public abstract class CompareToAttribute : CustomValidationAttribute
    {
        public CompareToAttribute(string otherProperty)
        {
            OtherProperty = otherProperty ?? throw new ArgumentNullException(nameof(otherProperty));
        }

        public string OtherProperty { get; }

        public string OtherPropertyDisplayName { get; set; }

        public override bool RequiresValidationContext => true;

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var otherPropertyInfo = validationContext.ObjectType.GetRuntimeProperty(OtherProperty);
            var otherPropertyValue = otherPropertyInfo.GetValue(validationContext.ObjectInstance, null);

            if (value != null && otherPropertyValue != null
                && value is IComparable val && otherPropertyValue is IComparable other)
            {
                if (CompareTo(val, other))
                {
                    if (OtherPropertyDisplayName == null)
                    {
                        OtherPropertyDisplayName = GetDisplayNameForProperty(otherPropertyInfo);
                    }

                    var memberNames = validationContext.MemberName != null
                       ? new[] { validationContext.MemberName }
                       : null;

                    return new ValidationResult(FormatErrorMessage(validationContext.DisplayName), memberNames);
                }

            }

            return null;
        }

        protected abstract bool CompareTo(IComparable value, IComparable other);

        private string GetDisplayNameForProperty(PropertyInfo property)
        {
            var attributes = CustomAttributeExtensions.GetCustomAttributes(property, true);
            var display = attributes.OfType<DisplayAttribute>().FirstOrDefault();
            if (display != null)
            {
                return display.GetName();
            }

            return OtherProperty;
        }

        public override object[] GetArguments()
        {
            return new object[] { OtherProperty };
        }
    }
}
