using System.ComponentModel.DataAnnotations;

namespace AppBase.Infrastructure.Attributes
{
    public class RequiredInputAttribute : RequiredAttribute
    {
        public const string MessageName = "Message_RequiredInputAttribute";

        public RequiredInputAttribute()
        {
            ErrorMessage = MessageName;
        }
    }
}
