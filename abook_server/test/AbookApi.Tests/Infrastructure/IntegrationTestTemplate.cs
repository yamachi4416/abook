using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using AbookApi.Resources;
using AbookApi.Tests.Helpers;
using AbookApi.Tests.Infrastructure.Attributes;
using AbookUseCase.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Xunit;

namespace AbookApi.Tests.Infrastructure
{
    [CurrentCulture]
    public abstract class IntegrationTestTemplate : IClassFixture<AbookApiFactory>, IAsyncLifetime
    {
        protected readonly AbookApiFactory factory;

        protected IServiceScope scope { get; private set; }

        protected AbookDbContext db => GetService<AbookDbContext>();

        protected IStringLocalizer localizer => GetService<IStringLocalizer<SharedResource>>();

        public IntegrationTestTemplate(AbookApiFactory factory)
        {
            this.factory = factory;
        }

        protected TService GetService<TService>()
        {
            return scope.ServiceProvider.GetService<TService>();
        }

        protected async Task<IEnumerable<T>> RawSqlReaderAsync<T>(
            string rawSql,
            object param,
            Func<DbDataReader, T> converter)
        {
            return await SqlRawHelper.ExecuteReaderAsync(
                  db.Database.GetDbConnection(),
                  rawSql,
                  converter,
                  param
              );
        }

        protected async Task<IEnumerable<T>> RawSqlReaderAsync<T>(
            string rawSql,
            Func<DbDataReader, T> converter)
        {
            return await RawSqlReaderAsync<T>(rawSql, null, converter);
        }

        protected async Task<T> RawSqlResultAsync<T>(
            string rawSql,
            object param = null)
        {
            var results = await SqlRawHelper.ExecuteReaderAsync(
                  db.Database.GetDbConnection(),
                  rawSql,
                  r => (T)Convert.ChangeType(r[0], typeof(T)),
                  param
              );

            return results.FirstOrDefault();
        }

        protected async Task<int> ExecuteRawSql(
            string rawSql, object param = null)
        {
            return await SqlRawHelper.ExecuteSqlAsync(
                db.Database.GetDbConnection(),
                rawSql,
                param
            );
        }

        public async Task InitializeAsync()
        {
            scope = factory.Services.CreateScope();
            await factory.SetupDatabaseAsync();
        }

        public Task DisposeAsync()
        {
            scope?.Dispose();
            return Task.CompletedTask;
        }
    }
}
