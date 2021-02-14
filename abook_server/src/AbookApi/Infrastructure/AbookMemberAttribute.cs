using System;
using System.Linq;
using System.Threading.Tasks;
using AbookUseCase.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace AbookApi.Infrastructure
{
    public sealed class AbookMemberAttribute : Attribute, IAsyncAuthorizationFilter
    {
        public bool IgnoreForbid { get; set; } = false;

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var abookService = context.HttpContext
                .RequestServices.GetRequiredService<AbookService>();

            var abookIds = await abookService.FindMemberAbookIds();

            var abookId = context.HttpContext.Request
                .Headers["x-abook-id"].FirstOrDefault() ?? abookIds.FirstOrDefault();

            if (!abookIds.Contains(abookId) && !IgnoreForbid)
            {
                context.Result = new ForbidResult();

                return;
            }

            context.HttpContext.GetCurrentUser()
                .MemberAbookIds = abookIds
                    .Where(a => a != abookId)
                    .Prepend(abookId)
                    .ToArray();
        }
    }
}
