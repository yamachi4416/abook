using AbookUseCase.Entities;

namespace AbookUseCase.Models
{
    public sealed class AccountViewModel
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public FinanceDiv? FinanceDiv { get; set; }

        public bool UseFee { get; set; }

        public bool Avaliable { get; set; }

        public string Color { get; set; }

        public bool UsuallyUsedForPayment { get; set; }

        public bool UsuallyUsedForReceipt { get; set; }

        public int DispOrder { get; set; }

        public AccountViewModel() { }

        public AccountViewModel(Account entity)
        {
            Id = entity.Id;
            Name = entity.Name;
            FinanceDiv = entity.FinanceDiv;
            UseFee = entity.UseFee;
            Avaliable = entity.Avaliable;
            Color = entity.Color;
            UsuallyUsedForPayment = entity.UsuallyUsedForPayment;
            UsuallyUsedForReceipt = entity.UsuallyUsedForReceipt;
            DispOrder = entity.DispOrder;
        }

        public static AccountViewModel Of(Account entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new AccountViewModel(entity);
        }
    }
}
