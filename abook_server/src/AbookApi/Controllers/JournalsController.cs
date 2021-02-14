using System;
using System.Linq;
using System.Threading.Tasks;
using AbookApi.Controllers.Models;
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
    [AbookMember]
    [ApiController]
    [Route("[controller]")]
    public sealed class JournalsController : ApiControllerBase
    {

        private readonly JournalService journalService;

        public JournalsController(
            JournalService journalService,
            IStringLocalizer<SharedResource> localizer) : base(localizer)
        {
            this.journalService = journalService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            return await GetResult(
                async () => await journalService.GetById(id));
        }

        [HttpPost]
        public async Task<ActionResult> Create(
            JournalCreateModel journal)
        {
            return await PostResult(
                async () => await journalService.Create(journal),
                journalId => new { Id = journalId },
                nameof(journal)
            );
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Update(
            [FromRoute] string id,
            [FromBody] JournalUpdateModel journal)
        {
            return await PatchResult(
                async () => await journalService.Update(id, journal),
                nameof(journal)
            );
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            return await DeleteResult(
                async () => await journalService.Delete(id));
        }

        [HttpGet("search")]
        public async Task<ActionResult> Search(
            [FromQuery] JournalSearchModel search)
        {
            return await GetResult(
                async () => await journalService.Search(search),
                nameof(search)
            );
        }

        [HttpGet("balance/{from}/{to}")]
        public async Task<ActionResult> Balance(
           [FromRoute, FromQuery] BalanceRequestModel search
        )
        {
            return await GetResult(
                async () => await journalService.Balance(
                    search.From.Value, search.To.Value,
                        search.Periods.Where(m => m != null).Cast<DateTime>()),
                nameof(search)
            );
        }
    }
}
