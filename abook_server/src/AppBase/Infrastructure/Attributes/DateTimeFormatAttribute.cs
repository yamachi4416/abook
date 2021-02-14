using System;
using System.Globalization;
using System.Text.Json.Serialization;
using AppBase.Infrastructure.Converters;

namespace AppBase.Infrastructure.Attributes
{
    [AttributeUsage(AttributeTargets.Parameter | AttributeTargets.Property | AttributeTargets.Field)]
    public class DateTimeFormatAttribute : JsonConverterAttribute
    {
        public string[] Dateformats { get; }

        public DateTimeFormatAttribute(params string[] dateformats)
        {
            Dateformats = dateformats;
        }

        public DateTimeFormatAttribute() : this(new[] {
            "yyyy-MM-dd", "yyyy-MM-dd hh:mm:ss",
            "yyyy/MM/dd", "yyyy/MM/dd hh:mm:ss"
        })
        {

        }

        public DateTime? Parse(
            string value,
            DateTimeStyles styles = DateTimeStyles.None,
            CultureInfo culture = null)
        {
            var cultureInfo = culture ?? CultureInfo.InvariantCulture;

            if (DateTime.TryParseExact(value, Dateformats, cultureInfo, styles, out var dt))
            {
                return dt;
            }

            return null;
        }

        public DateTimeOffset? ParseOffset(
            string value,
            DateTimeStyles styles = DateTimeStyles.None,
            CultureInfo culture = null)
        {
            var cultureInfo = culture ?? CultureInfo.InvariantCulture;

            if (DateTimeOffset.TryParseExact(value, Dateformats, cultureInfo, styles, out var dt))
            {
                return dt;
            }

            return null;
        }

        public string Fromat<T>(T date)
            where T : IFormattable
        {
            if (date == null)
            {
                return null;
            }

            return date.ToString(
                Dateformats[0], CultureInfo.InvariantCulture);
        }

        public override JsonConverter CreateConverter(Type typeToConvert)
        {
            return new DateTimeConverter(this);
        }
    }
}
