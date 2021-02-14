using System;
using System.Text.Json.Serialization;
using AppBase.Infrastructure.Converters;

namespace AppBase.Infrastructure.Attributes
{
    public class ConditionalReadAttribute : JsonConverterAttribute
    {

        public readonly string[] Props;

        public ConditionalReadAttribute(params string[] props)
        {
            Props = props;
        }

        public override JsonConverter CreateConverter(Type typeToConvert)
        {
            return (JsonConverter)Activator.CreateInstance(
                typeof(ConditionalReadConverter<>).MakeGenericType(typeToConvert),
                this
            );
        }
    }
}
