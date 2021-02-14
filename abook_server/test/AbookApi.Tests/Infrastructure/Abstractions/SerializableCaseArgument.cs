using System.Reflection;
using Xunit.Abstractions;

namespace AbookApi.Tests.Infrastructure.Abstractions
{
    public abstract class SerializableCaseArgument : IXunitSerializable
    {
        public virtual void Deserialize(IXunitSerializationInfo info)
        {
            foreach (var p in GetType().GetRuntimeProperties())
            {
                p.SetValue(this, info.GetValue(p.Name, p.PropertyType));
            }
        }

        public virtual void Serialize(IXunitSerializationInfo info)
        {
            foreach (var p in GetType().GetRuntimeProperties())
            {
                info.AddValue(p.Name, p.GetValue(this));
            }
        }
    }
}
