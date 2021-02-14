using System;
using AbookUseCase.Entities;
using AppBase.Infrastructure.Attributes;

namespace AbookUseCase.Models
{
    public sealed class FeeViewModel
    {
        public AccountViewModel Account { get; set; }

        public long? Amount { get; set; }

        public FeeViewModel() { }

        public FeeViewModel(Fee entity)
        {
            this.Account = AccountViewModel.Of(entity.Account);
            this.Amount = entity.Amount;
        }

        public static FeeViewModel Of(Fee entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new FeeViewModel(entity);
        }
    }

    public sealed class JournalViewModel
    {
        public string Id { get; set; }

        [DateTimeFormat("yyyy-MM-dd")]
        public DateTime? AccrualDate { get; set; }

        public JournalDiv? JournalDiv { get; set; }

        public long? Amount { get; set; }

        public string Memo { get; set; }

        public DateTimeOffset? CreatedDate { get; set; }

        public DateTimeOffset? UpdatedDate { get; set; }

        public AccountViewModel DebitAccount { get; set; }

        public AccountViewModel CreditAccount { get; set; }

        public FeeViewModel Fee { get; set; }

        public JournalViewModel() { }

        public JournalViewModel(Journal entity)
        {
            Id = entity.Id;
            AccrualDate = entity.AccrualDate;
            JournalDiv = entity.JournalDiv;
            DebitAccount = AccountViewModel.Of(entity.DebitAccount);
            CreditAccount = AccountViewModel.Of(entity.CreditAccount);
            Amount = entity.Amount;
            Fee = FeeViewModel.Of(entity.Fee);
            Memo = entity.Memo;
            CreatedDate = entity.CreatedDate;
            UpdatedDate = entity.UpdatedDate;
        }

        public static JournalViewModel Of(Journal entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new JournalViewModel(entity);
        }
    }
}
