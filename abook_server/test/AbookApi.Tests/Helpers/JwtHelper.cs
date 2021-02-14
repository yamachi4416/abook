using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace AbookApi.Tests.Helpers
{
    public static class JwtHelper
    {
        public static string Issuer => "https://localhost/";

        public static string Audience => "AbookTestJwtAudience";

        public static SecurityKey PublicKey { get; }

        public static SecurityKey PrivateKey { get; }

        static JwtHelper()
        {
            using (var rsa = RSA.Create())
            {
                PrivateKey = new RsaSecurityKey(rsa.ExportParameters(true));
                PublicKey = new RsaSecurityKey(rsa.ExportParameters(false));
            }
        }

        public static void SetupJwtBearerOptions(JwtBearerOptions options)
        {
            options.Authority = Issuer;
            options.Audience = Audience;
            options.TokenValidationParameters = ValidationParameters;
        }

        public static TokenValidationParameters ValidationParameters =>
            new TokenValidationParameters
            {
                ValidIssuer = Issuer,
                ValidAudience = Audience,
                IssuerSigningKey = PublicKey,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

        public static string CreateToken(
            string email, string name, DateTime? expires = null)
        {
            return new JwtSecurityTokenHandler().WriteToken(
                new JwtSecurityToken(
                    issuer: Issuer,
                    audience: Audience,
                    expires: expires ?? DateTime.UtcNow.AddHours(1),
                    claims: new[]
                    {
                        new Claim("sub", Guid.NewGuid().ToString()),
                        new Claim("email", email),
                        new Claim("name", name)
                    },
                    signingCredentials: new SigningCredentials(
                        key: PrivateKey,
                        algorithm: SecurityAlgorithms.RsaSha256
                    )
                ));
        }
    }
}
