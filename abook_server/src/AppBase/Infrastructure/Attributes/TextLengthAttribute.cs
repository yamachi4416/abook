using System.ComponentModel.DataAnnotations;

namespace AppBase.Infrastructure.Attributes
{
    public class TextLengthAttribute : StringLengthAttribute
    {
        public const string MessageName = "Message_TextLengthAttribute";

        public TextLengthAttribute(int maximumLength) : base(maximumLength)
        {
            ErrorMessage = MessageName;
        }
    }
}
