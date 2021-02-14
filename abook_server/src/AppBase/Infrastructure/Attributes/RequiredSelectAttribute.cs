using System.ComponentModel.DataAnnotations;

namespace AppBase.Infrastructure.Attributes
{
    public class RequiredSelectAttribute : RequiredAttribute
    {
        public const string MessageName = "Message_RequiredSelectAttribute";

        public RequiredSelectAttribute()
        {
            ErrorMessage = MessageName;
        }
    }
}
