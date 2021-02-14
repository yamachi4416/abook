using System;
using AppBase.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace AppBase.Infrastructure.Services
{
    public abstract class SharedService<T>
        where T : DbContext
    {
        protected readonly T context;

        protected readonly ServiceModelState modelState;

        protected virtual bool IsServiceFailure => modelState.HasError;

        protected SharedService(T context)
        {
            this.context = context;
            this.modelState = new ServiceModelState();
        }

        protected virtual void AddError(string key, string message, params object[] args)
        {
            modelState.AddError(key, message, args);
        }
    }
}
