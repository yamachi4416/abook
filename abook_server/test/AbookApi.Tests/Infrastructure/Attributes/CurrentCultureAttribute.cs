using System;
using System.Globalization;
using System.Reflection;
using Xunit.Sdk;

namespace AbookApi.Tests.Infrastructure.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class CurrentCultureAttribute : BeforeAfterTestAttribute
    {
        private CultureInfo originalCulture;

        private CultureInfo originalUICulture;

        public CurrentCultureAttribute() : this("en")
        {

        }

        public CurrentCultureAttribute(string culture)
            : this(culture, culture)
        {
        }

        public CurrentCultureAttribute(string culture, string uiCulture)
        {
            Culture = new CultureInfo(culture);
            UICulture = new CultureInfo(uiCulture);
        }

        public CultureInfo Culture { get; }

        public CultureInfo UICulture { get; }

        public override void Before(MethodInfo methodUnderTest)
        {
            originalCulture = CultureInfo.CurrentCulture;
            originalUICulture = CultureInfo.CurrentUICulture;

            CultureInfo.CurrentCulture = Culture;
            CultureInfo.CurrentUICulture = UICulture;
        }

        public override void After(MethodInfo methodUnderTest)
        {
            CultureInfo.CurrentCulture = originalCulture;
            CultureInfo.CurrentUICulture = originalUICulture;
        }
    }
}
