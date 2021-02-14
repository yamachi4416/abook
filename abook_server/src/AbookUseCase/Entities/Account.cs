using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AppBase.Infrastructure.Entities;

namespace AbookUseCase.Entities
{
    public class Account : Audience, Abookable
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string AbookId { get; set; }

        [Required]
        [MaxLength(30)]
        public string Name { get; set; }

        [Required]
        public FinanceDiv? FinanceDiv { get; set; }

        [Required]
        public bool UseFee { get; set; }

        [Required]
        public bool Avaliable { get; set; }

        [Required]
        public int DispOrder { get; set; }

        [Required]
        [MaxLength(30)]
        public string Color { get; set; }

        [Required]
        public bool UsuallyUsedForPayment { get; set; }

        [Required]
        public bool UsuallyUsedForReceipt { get; set; }
    }

    public enum FinanceDiv
    {
        Income = 1,
        Expense = 2,
        Assets = 3,
        Liabilities = 4
    }
}
