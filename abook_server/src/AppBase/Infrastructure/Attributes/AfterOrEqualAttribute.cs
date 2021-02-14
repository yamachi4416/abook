using System;

namespace AppBase.Infrastructure.Attributes
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class AfterOrEqualAttribute : CompareToAttribute
    {
        public const string MessageName = "Message_AfterOrEqualAttribute";

        public AfterOrEqualAttribute(string otherProperty) : base(otherProperty)
        {
            ErrorMessage = MessageName;
        }

        protected override bool CompareTo(IComparable value, IComparable other)
        {
            return value.CompareTo(other) < 0;
        }
    }
}
