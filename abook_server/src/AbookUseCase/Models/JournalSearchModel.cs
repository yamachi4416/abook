using System;
using AbookUseCase.Entities;
using AbookUseCase.Resources;
using AppBase.Infrastructure.Attributes;
using AppBase.Infrastructure.Models;

namespace AbookUseCase.Models
{
    public sealed class JournalSearchModel : ModelBase
    {
        public string AccountId { get; set; }

        public JournalDiv? JournalDiv { get; set; }

        public FinanceDiv? FinanceDiv { get; set; }

        public string Memo { get; set; }

        [RequiredInput]
        [DateTimeFormat("yyyy-MM-dd")]
        [BeforeOrEqual(nameof(AccrualDateEnd),
            ErrorMessage = SharedResource.DateStartIsBeforeOrEqualToDateEnd)]
        public DateTime? AccrualDateStart { get; set; }

        [RequiredInput]
        [DateTimeFormat("yyyy-MM-dd")]
        [AfterOrEqual(nameof(AccrualDateStart),
            ErrorMessage = SharedResource.DateEndIsAfterOrEqualToDateStart)]
        public DateTime? AccrualDateEnd { get; set; }
    }
}
