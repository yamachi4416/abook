using System.Collections.Generic;
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
    [AbookMember]
    [ApiController]
    [Route("[controller]")]
    public sealed class AccountsController : ApiControllerBase
    {
        private readonly AccountService accountService;

        public AccountsController(
            AccountService accountService,
            IStringLocalizer<SharedResource> localizer) : base(localizer)
        {
            this.accountService = accountService;
        }

        [HttpGet]
        public async Task<ActionResult> GetCurrentAbookAll()
        {
            return await GetResult(
                async () => await accountService.GetCurrentAll());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            return await GetResult(
                async () => await accountService.GetById(id));
        }

        [HttpPost]
        public async Task<ActionResult> Create(AccountCreateModel account)
        {
            return await PostResult(
                async () => await accountService.Create(account),
                accountId => new { Id = accountId },
                nameof(account)
            );
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Update(
            [FromRoute] string id,
            [FromBody] AccountUpdateModel account)
        {
            return await PatchResult(
                async () => await accountService.Update(id, account),
                nameof(account)
            );
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            return await DeleteResult(
                async () => await accountService.Delete(id), "account");
        }

        [HttpPatch("dispOrders")]
        public async Task<ActionResult> UpdateDisOrders(IEnumerable<string> ids)
        {
            return await PatchResult(
                async () => await accountService.UpdateDispOrders(ids));
        }
    }
}
