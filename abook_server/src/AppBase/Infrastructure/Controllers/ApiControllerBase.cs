using System;
using System.Threading.Tasks;
using AppBase.Infrastructure.Helpers;
using AppBase.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace AppBase.Controllers
{
    public abstract class ApiControllerBase : ControllerBase
    {
        protected IStringLocalizer localizer;

        public ApiControllerBase(IStringLocalizer localizer)
        {
            this.localizer = localizer;
        }

        protected virtual BadRequestObjectResult ModelError(string name = "")
        {
            return new BadRequestObjectResult(
                ModelErrorInfoHelper.ExchangeModelErrorInfo(ModelState, name));
        }

        protected virtual BadRequestObjectResult ModelError(
            ServiceModelState error, string name = "")
        {
            error.WriteTo(ModelState, localizer);
            return ModelError(name);
        }

        protected async Task<ActionResult> GetResult<T, R>(
            Func<Task<(T, ServiceModelState)>> action,
            Func<T, R> result,
            string name = "")
        {
            if (!ModelState.IsValid)
            {
                return ModelError(name);
            }

            var (ret, error) = await action();

            if (error != null)
            {
                return ModelError(error, name);
            }

            if (ret == null)
            {
                return NotFound(null);
            }

            return Ok(result(ret));
        }

        protected async Task<ActionResult> GetResult<T>(
            Func<Task<(T, ServiceModelState)>> action,
            string name = "")
        {
            return await GetResult(action, t => t, name);
        }

        protected async Task<ActionResult> PostResult<T, R>(
            Func<Task<(T, ServiceModelState)>> action,
            Func<T, R> result,
            string name = "")
        {
            if (!ModelState.IsValid)
            {
                return ModelError(name);
            }

            var (ret, error) = await action();

            if (error != null)
            {
                return ModelError(error, name);
            }

            return CreatedAtAction(null, null, result(ret));
        }

        protected async Task<ActionResult> PostResult<T>(
            Func<Task<(T, ServiceModelState)>> action,
            string name = "")
        {
            return await PostResult(action, t => t, name);
        }

        protected async Task<ActionResult> PatchResult<T, R>(
            Func<Task<(T, ServiceModelState)>> action,
            Func<T, R> result,
            string name = "")
        {
            return await GetResult(action, result, name);
        }

        protected async Task<ActionResult> PatchResult<T>(
            Func<Task<(T, ServiceModelState)>> action,
            string name = "")
        {
            return await PatchResult(action, t => t, name);
        }

        protected async Task<ActionResult> DeleteResult<T>(
            Func<Task<(T, ServiceModelState)>> action,
            string name = "")
        {
            if (!ModelState.IsValid)
            {
                return ModelError(name);
            }

            var (_, error) = await action();

            if (error != null)
            {
                return ModelError(error, name);
            }

            return Ok();
        }
    }
}
