using AbookUseCase.Entities;
using AppBase.Infrastructure.Attributes;
using AppBase.Infrastructure.Models;

namespace AbookUseCase.Models
{
    public abstract class AccountEditModel : ModelBase
    {
        [RequiredInput]
        [TextLength(30)]
        public string Name { get; set; }

        public bool UseFee { get; set; }

        public bool Avaliable { get; set; }

        [RequiredSelect]
        [TextLength(30)]
        public string Color { get; set; }

        public bool UsuallyUsedForPayment { get; set; }

        public bool UsuallyUsedForReceipt { get; set; }

        public virtual void Attach(Account entity)
        {
            entity.Name = this.Name;
            entity.UseFee = this.UseFee;
            entity.Avaliable = this.Avaliable;
            entity.Color = this.Color;
            entity.UsuallyUsedForPayment = this.UsuallyUsedForPayment;
            entity.UsuallyUsedForReceipt = this.UsuallyUsedForReceipt;
        }
    }

    public sealed class AccountCreateModel : AccountEditModel
    {
        [RequiredSelect]
        public FinanceDiv? FinanceDiv { get; set; }

        public override void Attach(Account entity)
        {
            base.Attach(entity);
            entity.FinanceDiv = this.FinanceDiv;
        }
    }

    public sealed class AccountUpdateModel : AccountEditModel
    {

    }
}
