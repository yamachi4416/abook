using System;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using AppBase.Infrastructure.Attributes;

namespace AppBase.Infrastructure.Converters
{
    public class ConditionalReadConverter<T> : JsonConverter<T>
        where T : class
    {
        private readonly ConditionalReadAttribute attr;

        public ConditionalReadConverter(ConditionalReadAttribute attr)
        {
            this.attr = attr;
        }

        public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var value = (T)JsonSerializer.Deserialize(ref reader, typeToConvert, options);

            var props = value.GetType().GetRuntimeProperties()
                .Where(p => p.CanRead &&
                    (attr.Props.Count() == 0 || attr.Props.Contains(p.Name)))
                .Select(p => p.GetValue(value))
                .Any(p => p != null);

            var fields = value.GetType().GetRuntimeFields()
                .Where(p => p.IsPublic &&
                    (attr.Props.Count() == 0 || attr.Props.Contains(p.Name)))
                .Select(p => p.GetValue(value))
                .Any(p => p != null);

            if (props || fields)
            {
                return value;
            }

            return null;
        }

        public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, value, options);
        }
    }
}
