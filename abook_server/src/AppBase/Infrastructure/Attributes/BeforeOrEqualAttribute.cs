using System;

namespace AppBase.Infrastructure.Attributes
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class BeforeOrEqualAttribute : CompareToAttribute
    {
        public const string MessageName = "Message_BeforeOrEqualAttribute";

        public BeforeOrEqualAttribute(string otherProperty) : base(otherProperty)
        {
            ErrorMessage = MessageName;
        }

        protected override bool CompareTo(IComparable value, IComparable other)
        {
            return value.CompareTo(other) > 0;
        }
    }
}
