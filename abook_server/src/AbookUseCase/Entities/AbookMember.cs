using System.ComponentModel.DataAnnotations;
using AppBase.Infrastructure.Entities;

namespace AbookUseCase.Entities
{
    public class AbookMember : Audience, Abookable
    {
        [Required]
        public string AbookId { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public int Priority { get; set; }

        public virtual Abook Abook { get; set; }

        public virtual MUser User { get; set; }
    }
}
