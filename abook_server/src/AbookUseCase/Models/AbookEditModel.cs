using AbookUseCase.Entities;
using AppBase.Infrastructure.Attributes;
using AppBase.Infrastructure.Models;

namespace AbookUseCase.Models
{
    public abstract class AbookEditModel : ModelBase
    {
        [RequiredInput]
        [TextLength(20)]
        public string Name { get; set; }

        [TextLength(300)]
        public string Memo { get; set; }

        [RequiredInput]
        public int? StartOfMonthDate { get; set; }

        public bool StartOfMonthIsPrev { get; set; }

        public virtual void Attach(Abook entity)
        {
            entity.Name = this.Name;
            entity.Memo = this.Memo;
            entity.StartOfMonthDate = this.StartOfMonthDate;
            entity.StartOfMonthIsPrev = this.StartOfMonthIsPrev;
        }
    }

    public sealed class AbookCreateModel : AbookEditModel
    {

    }

    public sealed class AbookUpdateModel : AbookEditModel
    {

    }
}
