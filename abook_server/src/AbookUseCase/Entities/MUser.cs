using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AppBase.Infrastructure.Entities;

namespace AbookUseCase.Entities
{
    public class MUser : Audience
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
