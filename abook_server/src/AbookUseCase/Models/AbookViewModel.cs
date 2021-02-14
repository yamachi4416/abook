using AbookUseCase.Entities;

namespace AbookUseCase.Models
{
    public sealed class AbookViewModel
    {
        public string AbookId { get; set; }

        public string Name { get; set; }

        public string Memo { get; set; }

        public int? StartOfMonthDate { get; set; }

        public bool StartOfMonthIsPrev { get; set; }

        public AbookViewModel() { }

        public AbookViewModel(Abook entity)
        {
            this.AbookId = entity.AbookId;
            this.Name = entity.Name;
            this.Memo = entity.Memo;
            this.StartOfMonthDate = entity.StartOfMonthDate;
            this.StartOfMonthIsPrev = entity.StartOfMonthIsPrev;
        }

        public static AbookViewModel Of(Abook entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new AbookViewModel(entity);
        }
    }
}
