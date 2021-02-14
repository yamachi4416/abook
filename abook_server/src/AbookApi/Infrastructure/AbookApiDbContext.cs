using AbookUseCase.Entities;
using AbookUseCase.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AbookApi.Infrastructure
{
    public class AbookApiDbContext : AbookDbContext
    {
        private readonly IHttpContextAccessor httpAccessor;

        public AbookApiDbContext(
            DbContextOptions options,
            IHttpContextAccessor httpAccessor) : base(options)
        {
            this.httpAccessor = httpAccessor;
        }

        public override CurrentUser GetCurrentUser()
        {
            return httpAccessor.HttpContext.GetCurrentUser();
        }
    }
}
