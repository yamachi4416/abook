using System;
using AbookUseCase.Entities;
using AppBase.Infrastructure.Attributes;
using AppBase.Infrastructure.Models;

namespace AbookUseCase.Models
{
    public class JounalEditAccountModel : ModelBase
    {
        [RequiredInput]
        public string Id { get; set; }
    }

    public class FeeEditModel
    {
        [RequiredInput]
        public JounalEditAccountModel Account { get; set; }

        [RequiredInput]
        [NumberRange(1, 10000000)]
        public long? Amount { get; set; }

        public Fee Fee => string.IsNullOrEmpty(Account?.Id) ? null
            : new Fee
            {
                AccountId = Account.Id,
                Amount = Amount
            };
    }

    public abstract class JournalEditModel : ModelBase
    {
        [RequiredInput]
        [DateTimeFormat("yyyy-MM-dd")]
        public DateTime? AccrualDate { get; set; }

        [RequiredInput]
        public JournalDiv? JournalDiv { get; set; }

        [RequiredInput]
        [NumberRange(1, 10000000)]
        public long? Amount { get; set; }

        [TextLength(300)]
        public string Memo { get; set; }

        [RequiredSelect]
        public JounalEditAccountModel DebitAccount { get; set; }

        [RequiredSelect]
        public JounalEditAccountModel CreditAccount { get; set; }

        [ConditionalRead]
        public FeeEditModel Fee { get; set; }

        public virtual void Attach(Journal entity)
        {
            entity.AccrualDate = this.AccrualDate;
            entity.JournalDiv = this.JournalDiv;
            entity.DebitAccountId = this.DebitAccount.Id;
            entity.CreditAccountId = this.CreditAccount.Id;
            entity.Amount = this.Amount;
            entity.Fee = this.Fee?.Fee;
            entity.Memo = this.Memo;
        }
    }

    public sealed class JournalCreateModel : JournalEditModel
    {

    }

    public sealed class JournalUpdateModel : JournalEditModel
    {

    }
}
