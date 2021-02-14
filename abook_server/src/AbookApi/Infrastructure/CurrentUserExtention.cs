using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using AbookUseCase.Models;
using Microsoft.AspNetCore.Http;

namespace AbookApi.Infrastructure
{
    public sealed class ContextCurrentUser : CurrentUser
    {
        public string Id { get; private set; }

        public string Name { get; private set; }

        public string CurrentAbookId => MemberAbookIds?.FirstOrDefault();

        public IEnumerable<string> MemberAbookIds { get; set; }

        public ContextCurrentUser(string id, string name)
        {
            this.Id = id;
            this.Name = name;
            this.MemberAbookIds = Enumerable.Empty<string>();
        }
    }

    internal static class CurrentUserExtension
    {
        const string CurrentUserItemKey = "AbookApi/ContextCurrentUser";

        public static CurrentUser GetCurrentUser(this HttpContext @this)
        {
            if (!@this.Items.ContainsKey(CurrentUserItemKey))
            {
                var claims = @this.User.Claims;
                @this.Items[CurrentUserItemKey] = new ContextCurrentUser(
                    id: claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value?.ToLower(),
                    name: claims.FirstOrDefault(x => x.Type == "name")?.Value
                );
            }

            return @this.Items[CurrentUserItemKey] as CurrentUser;
        }
    }
}
