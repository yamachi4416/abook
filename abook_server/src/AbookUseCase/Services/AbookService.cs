using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AbookUseCase.Entities;
using AbookUseCase.Models;
using AppBase.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace AbookUseCase.Services
{
    public class AbookService : SharedService<AbookDbContext>
    {
        public AbookService(AbookDbContext context) : base(context)
        {
        }

        public virtual async Task<IEnumerable<string>> FindMemberAbookIds()
        {
            return await context.AbookMembers.AsNoTracking()
                .GetMemberAbookIds(context.GetCurrentUser()?.Id)
                .ToArrayAsync();
        }

        public virtual async Task<(AbookViewModel, ServiceModelState)> GetCurrent()
        {
            var user = context.GetCurrentUser();

            var abook = await context.Abooks.AsNoTracking()
                .WhereById(user.CurrentAbookId)
                .SingleOrDefaultAsync();

            return (AbookViewModel.Of(abook), null);
        }

        public virtual async Task<(string, ServiceModelState)> Create(
            AbookCreateModel model)
        {
            var user = context.GetCurrentUser();
            var abook = new Abook
            {
                AbookId = Guid.NewGuid().ToString()
            };

            model.Attach(abook);

            var member = new AbookMember
            {
                AbookId = abook.AbookId,
                UserId = user.Id,
                Priority = 0
            };

            await context.Abooks.AddAsync(abook);
            await context.AbookMembers.AddAsync(member);
            await context.SaveChangesAsync();

            return (abook.AbookId, null);
        }

        public virtual async Task<(AbookViewModel, ServiceModelState)> Update(
            AbookUpdateModel model)
        {
            var user = context.GetCurrentUser();

            var edit = await context.Abooks
                .WhereById(user.CurrentAbookId)
                .SingleOrDefaultAsync();

            if (edit != null)
            {
                model.Attach(edit);
                await context.SaveChangesAsync();
            }

            return (AbookViewModel.Of(edit), null);
        }
    }
}
