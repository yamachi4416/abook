using AbookApi.Infrastructure;
using AbookApi.Resources;
using AbookUseCase.Entities;
using AbookUseCase.Services;
using AppBase.Infrastructure.Attributes;
using AppBase.Infrastructure.Binders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AbookApi
{
    public sealed class AbookConfigration
    {
        public string PathBase { get; set; }
        public string JwtIssuer { get; set; }
        public string JwtAudience { get; set; }
    }

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            AbookConfigration = new AbookConfigration();
            Configuration.Bind("AbookSettings", AbookConfigration);
        }

        public IConfiguration Configuration { get; }

        public AbookConfigration AbookConfigration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(config =>
            {
                config.AddConsole();
                config.AddConfiguration(Configuration.GetSection("Logging"));
            });

            services.AddDbContext<AbookDbContext, AbookApiDbContext>(options =>
            {
                options.UseNpgsql(Configuration
                    .GetConnectionString("DefaultConnection"))
                    .UseSnakeCaseNamingConvention();
            });

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = AbookConfigration.JwtIssuer;
                    options.Audience = AbookConfigration.JwtAudience;
                });

            services
                .Configure<ForwardedHeadersOptions>(options =>
                {
                    options.ForwardedHeaders =
                        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                })
                .AddCors(options =>
                {
                    options.AddDefaultPolicy(builder =>
                        builder.WithOrigins(Configuration["AllowedHosts"] ?? "*"));
                })
                .AddControllers(options =>
                {
                    options.ModelBinderProviders.Insert(0, new DateTimeModelBinderProvider());
                })
                .ConfigureApiBehaviorOptions(options =>
                {
                    options.SuppressModelStateInvalidFilter = true;
                })
                .AddDataAnnotationsLocalization(options =>
                {
                    options.DataAnnotationLocalizerProvider = (type, factory) =>
                    {
                        return factory.Create(typeof(SharedResource));
                    };
                });

            services.AddHttpContextAccessor();

            services.AddScoped<MUserService>();
            services.AddScoped<AbookService>();
            services.AddScoped<AccountService>();
            services.AddScoped<JournalService>();

            services.AddSingleton<
                IValidationAttributeAdapterProvider,
                CustomValidationAttributeAdapterProvider>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UsePathBase(AbookConfigration.PathBase);
            app.UseForwardedHeaders();

            app.UseRequestLocalization(options =>
            {
                options.SetDefaultCulture("en");
                options.AddSupportedUICultures("en", "ja");
            });

            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
