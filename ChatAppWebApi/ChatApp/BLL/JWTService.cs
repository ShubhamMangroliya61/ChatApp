﻿using ChatAppWebApi.DAL.Models;
using ChatAppWebApi.Interface;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChatAppWebApi.BLL
{
    public class JWTService: IJWTService
    {
        private string secretkey;
        public JWTService(IConfiguration configuration)
        {
            secretkey = configuration.GetValue<string>("Jwt:Key") ?? string.Empty;
        }

        /// <summary>
        /// Generates a JWT token for the given user.
        /// </summary>
        /// <param name="user">The user object for whom the token is generated.</param>
        /// <returns>A JWT token string.</returns>
        public string GetJWTToken(User user)
        {
            JwtSecurityTokenHandler tokenHandler = new();
            byte[] key = Encoding.UTF8.GetBytes(secretkey);

            SecurityTokenDescriptor tokenDestriptor = new()
            {
                Subject = new ClaimsIdentity(new List<Claim>
                {
                new Claim("UserId", user.Userid.ToString()),
                new Claim("UserName", user.Username ?? string.Empty),
                }),
                Expires = DateTime.UtcNow.AddMinutes(120),
                SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            SecurityToken token = tokenHandler.CreateToken(tokenDestriptor);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
