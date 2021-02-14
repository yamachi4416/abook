using System.Threading.Tasks;
using AbookUseCase.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AbookApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public sealed class UsersController : ControllerBase
    {
        private readonly MUserService mUserService;

        public UsersController(MUserService mUserService)
        {
            this.mUserService = mUserService;
        }

        [HttpPut]
        public async Task<ActionResult> Upsert()
        {
            await mUserService.Upsert();

            return Ok();
        }
    }
}
