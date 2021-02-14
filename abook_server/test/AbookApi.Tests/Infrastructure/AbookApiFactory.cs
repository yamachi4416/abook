using System;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using AbookApi.Tests.Helpers;
using AbookApi.Tests.Resources;
using AbookUseCase.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace AbookApi.Tests.Infrastructure
{
    public class AbookApiFactory : WebApplicationFactory<Startup>
    {
        private bool _disposed = false;

        private Action _disposers = () => { };

        public readonly DbConnection Connection;

        public AbookApiFactory()
        {
            Connection = new SqliteConnection("DataSource=:memory:");
            _disposers += () => Connection?.Dispose();

            Connection.Open();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<AbookDbContext>();
                services.RemoveAll<DbContextOptions<AbookDbContext>>();

                services.AddDbContext<AbookDbContext, TestDbContext>(options =>
                {
                    options.UseSqlite(Connection)
                        .UseSnakeCaseNamingConvention();
                });

                services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme,
                    options => JwtHelper.SetupJwtBearerOptions(options));

                var sp = services.BuildServiceProvider(true);

                using (var scope = sp.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<AbookDbContext>();

                    db.Database.EnsureCreated();
                    db.Database.Migrate();
                }
            });
        }

        public async Task SetupDatabaseAsync()
        {
            using (var tx = await Connection.BeginTransactionAsync())
            {
                var tables = TestCaseExcel.Database.ToArray();

                await Task.WhenAll(
                    tables.Reverse().Select(m
                        => SqlRawHelper.ExecuteSqlAsync(Connection, $"delete from {m.TableName}"))
                );

                await Task.WhenAll(
                    tables.Select(table =>
                        SqlRawHelper.ImportDataTableAsync(Connection, table)));

                await tx.CommitAsync();
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (_disposed)
            {
                return;
            }

            if (disposing)
            {
                _disposers();
            }

            _disposed = true;

            base.Dispose(disposing);
        }
    }
}
