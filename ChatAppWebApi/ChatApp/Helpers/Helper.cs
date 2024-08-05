using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ChatAppWebApi.DAL.Models;

namespace InstagramWebAPI.Helpers
{
    public class Helper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ChatDbContext _dbcontext;

        public Helper(IHttpContextAccessor httpContextAccessor, ChatDbContext db)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbcontext = db;
        }
        public async Task<bool> EmailSender(string email, string subject, string htmlMessage)
        {
            try
            {
                var mail = "tatva.dotnet.shubhammangroliya@outlook.com";
                var password = "snwwkdrbhcdxifyc";

                var client = new SmtpClient("smtp.office365.com", 587)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(mail, password)
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(mail),
                    Subject = subject,
                    Body = htmlMessage,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(email);

                await client.SendMailAsync(mailMessage);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public long GetUserIdClaim()
        {
            var userIdClaim = _httpContextAccessor?.HttpContext?.User.FindFirst("UserId");

            if (userIdClaim != null && long.TryParse(userIdClaim.Value, out long userId))
            {
                return userId;
            }
            return 0;
        }

        public string GetProfileImage(long userId, string imageName)
        {
            int index = imageName.IndexOf('.') + 1;
            string extension = imageName[index..];
            string imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "User", userId.ToString(), imageName);
            if (!File.Exists(imagePath))
            {
                return string.Empty;
            }
            byte[] imageBytes = System.IO.File.ReadAllBytes(imagePath);
            string base64String = Convert.ToBase64String(imageBytes);

            return base64String;
        }



    }
}
