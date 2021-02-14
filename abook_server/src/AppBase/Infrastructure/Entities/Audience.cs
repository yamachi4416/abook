using System;
using System.ComponentModel.DataAnnotations;

namespace AppBase.Infrastructure.Entities
{
    public abstract class Audience
    {
        [Required]
        public DateTimeOffset? CreatedDate { get; set; }

        [Required]
        public string CreatedUserId { get; set; }

        [Required]
        public DateTimeOffset? UpdatedDate { get; set; }

        [Required]
        public string UpdatedUserId { get; set; }

    }
}
