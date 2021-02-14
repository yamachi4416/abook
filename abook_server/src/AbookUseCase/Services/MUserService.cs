using System.Threading.Tasks;
using AbookUseCase.Entities;
using AppBase.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace AbookUseCase.Services
{
    public class MUserService : SharedService<AbookDbContext>
    {
        public MUserService(AbookDbContext context) : base(context)
        {
        }

        public async Task Upsert()
        {
            var currentUser = context.GetCurrentUser();
            var user = await context.MUsers
                .SingleOrDefaultAsync(u => u.Id == currentUser.Id);

            if (user == null)
            {
                user = new MUser
                {
                    Id = currentUser.Id,
                    Email = currentUser.Id
                };
                await context.MUsers.AddAsync(user);
            }

            user.Name = currentUser.Name;
            await context.SaveChangesAsync();
        }
    }
}
