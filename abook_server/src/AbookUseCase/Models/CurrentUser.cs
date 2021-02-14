using System.Collections.Generic;

namespace AbookUseCase.Models
{
    public interface CurrentUser
    {
        string Id { get; }

        string Name { get; }

        string CurrentAbookId { get; }

        IEnumerable<string> MemberAbookIds { get; set; }
    }
}
