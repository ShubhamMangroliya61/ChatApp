using ChatApp.Utils;
using ChatAppWebApi.DAL.Models;
using ChatAppWebApi.DTO;
using ChatAppWebApi.Interface;
using InstagramWebAPI.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ChatAppWebApi.BLL
{
    public class AuthService: IAuthService
    {

        public readonly ChatDbContext _dbcontext;
        public readonly IJWTService _jWTService;
        public readonly Helper _helper;

        public AuthService(ChatDbContext db, IConfiguration configuration, IJWTService jWTService ,Helper helper)
        {
            _dbcontext = db;
            _jWTService = jWTService;
            _helper = helper;
        }

        /// <summary>
        /// Registers a new user asynchronously.
        /// </summary>
        /// <param name="model">The registration details.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the registered User.</returns>
        public async Task<UserDTO> UpSertUserAsync(UserDTO model)
        {
            User user = _dbcontext.Users.FirstOrDefault(m => m.Userid == model.UserId && m.Isdeleted != true) ?? new();

            user.Email = model.Email ?? string.Empty;
            user.Name = model.Name ?? string.Empty;
            user.Username = model.UserName ?? string.Empty;
            user.Createddate = DateTime.Now;

            if (user.Userid > 0)
            {
                user.Modifieddate = DateTime.Now;
                _dbcontext.Users.Update(user);
            }
            else
            {
                user.Createddate = DateTime.Now;
                user.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
                await _dbcontext.Users.AddAsync(user);
            }
           
            await _dbcontext.SaveChangesAsync();
            user.Password = "";
            //egfdgfgdfgfg
            UserDTO userDTO = new()
            {
                UserId = user.Userid,
                UserName = user.Username,
                Email = user.Email,
                Name = user.Name,
                ProfilePictureName = _helper.GetProfileImage(user.Userid ,user.Profilepicturename??""),
            };
            return userDTO;
        }

        /// <summary>
        /// Authenticates a user based on login credentials asynchronously.
        /// </summary>
        /// <param name="model">The login credentials.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a LoginResponseDTO.</returns>
        public async Task<LoginResponseDTO> UserLoginAsync(LoginRequestDTO model)
        {
            try
            {
                User? user = await _dbcontext.Users.FirstOrDefaultAsync(m =>
                                        (m.Email ?? string.Empty).ToLower() == (model.Email ?? string.Empty).ToLower() && !string.IsNullOrWhiteSpace(m.Email)
                                       && m.Isdeleted != true);

                if (user == null)
                {
                    return new LoginResponseDTO
                    {
                        Token = "",
                    };
                }
                else
                {
                    if (!BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
                    {
                        return new LoginResponseDTO
                        {
                            Token = "",
                        };
                    }
                }
                user.Password = "";
                LoginResponseDTO loginResponceDTO = new()
                {
                    Token = _jWTService.GetJWTToken(user),
                };

                return loginResponceDTO;
            }
            catch
            {
                throw new Exception(CustomErrorMessage.LoginError);
            }
        }
        
    }
}
