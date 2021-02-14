using System.ComponentModel.DataAnnotations;

namespace AppBase.Infrastructure.Attributes
{
    public class NumberRangeAttribute : RangeAttribute
    {
        public const string MessageName = "Message_NumberRangeAttribute";

        public NumberRangeAttribute(long minimum, long maximum)
            : base(typeof(long), minimum.ToString(), maximum.ToString())
        {
            ErrorMessage = MessageName;
        }
    }
}
