using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using AppBase.Infrastructure.Attributes;

namespace AppBase.Infrastructure.Converters
{
    public class DateTimeConverter : JsonConverter<DateTime?>
    {
        private DateTimeFormatAttribute dateTimeFormatAttribute { get; }

        public DateTimeConverter(DateTimeFormatAttribute dateTimeFormatAttribute)
        {
            this.dateTimeFormatAttribute = dateTimeFormatAttribute;
        }

        public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return dateTimeFormatAttribute.Parse(reader.GetString());
        }

        public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
        {
            if (value != null)
            {
                writer.WriteStringValue(dateTimeFormatAttribute.Fromat(value.Value));
            }
            else
            {
                writer.WriteNullValue();
            }
        }
    }
}
