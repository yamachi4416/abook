using System;
using System.ComponentModel.DataAnnotations;
using AppBase.Infrastructure.Entities;

namespace AbookUseCase.Entities
{
    public class Journal : Audience, Abookable
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string AbookId { get; set; }

        [Required]
        public DateTime? AccrualDate { get; set; }

        [Required]
        public JournalDiv? JournalDiv { get; set; }

        [Required]
        public string DebitAccountId { get; set; }

        [Required]
        public string CreditAccountId { get; set; }

        [Required]
        public long? Amount { get; set; }

        public Fee Fee { get; set; }

        [MaxLength(300)]
        public string Memo { get; set; }

        public Account DebitAccount { get; set; }

        public Account CreditAccount { get; set; }

    }

    public class Fee
    {
        public string AccountId { get; set; }

        public Account Account { get; set; }

        public long? Amount { get; set; }
    }

    public enum JournalDiv
    {
        Income = 1,
        Expense = 2,
        Transfer = 3,
    }
}
