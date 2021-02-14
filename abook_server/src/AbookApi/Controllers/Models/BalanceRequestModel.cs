using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AppBase.Infrastructure.Attributes;
using AppBase.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace AbookApi.Controllers.Models
{
    public class BalanceRequestModel : ModelBase
    {
        [FromRoute]
        [RequiredInput]
        [DateTimeFormat("yyyyMMdd")]
        public DateTime? From { get; set; }

        [FromRoute]
        [RequiredInput]
        [DateTimeFormat("yyyyMMdd")]
        public DateTime? To { get; set; }

        [FromQuery]
        [MaxLength(11)]
        [DateTimeFormat("yyyyMMdd")]
        public IEnumerable<DateTime?> Periods { get; set; }
    }
}
