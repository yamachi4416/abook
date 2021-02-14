using System.Threading.Tasks;
using AbookApi.Infrastructure;
using AbookApi.Resources;
using AbookUseCase.Models;
using AbookUseCase.Services;
using AppBase.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace AbookApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public sealed class AbooksController : ApiControllerBase
    {
        private readonly AbookService abookService;

        public AbooksController(
            AbookService abookService,
            IStringLocalizer<SharedResource> localizer) : base(localizer)
        {
            this.abookService = abookService;
        }

        [HttpGet("current")]
        [AbookMember(IgnoreForbid = true)]
        public async Task<ActionResult> GetCurrent()
        {
            var user = HttpContext.GetCurrentUser();
            var (abook, _) = await abookService.GetCurrent();

            if (abook == null && !string.IsNullOrEmpty(user?.CurrentAbookId))
            {
                return NotFound(null);
            }

            return Ok(abook);
        }

        [HttpPost]
        public async Task<ActionResult> Create(AbookCreateModel abook)
        {
            return await PostResult(
                async () => await abookService.Create(abook),
                abookId => new { AbookId = abookId },
                nameof(abook)
            );
        }

        [HttpPatch]
        [AbookMember]
        public async Task<ActionResult> Update(AbookUpdateModel abook)
        {
            return await PatchResult(
                async () => await abookService.Update(abook),
                nameof(abook)
            );
        }
    }
}
