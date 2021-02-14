using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AppBase.Infrastructure.Entities;

namespace AbookUseCase.Entities
{
    public class Abook : Audience, Abookable
    {
        [Required]
        public string AbookId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Name { get; set; }

        [MaxLength(300)]
        public string Memo { get; set; }

        [Required]
        public int? StartOfMonthDate { get; set; }

        [Required]
        public bool StartOfMonthIsPrev { get; set; }

        public IReadOnlyCollection<AbookMember> AbookMembers { get; set; }
    }
}
