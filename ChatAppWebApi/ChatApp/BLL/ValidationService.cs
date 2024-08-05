using ChatApp.Common;
using ChatApp.Utils;
using ChatAppWebApi.DTO;
using ChatAppWebApi.Interface;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Text.RegularExpressions;
using ChatAppWebApi.DAL.Models;

namespace ChatAppWebApi.BLL
{
    public class ValidationService  : IValidationService
    {
        private static readonly string[] AllowedExtensionsProfilePhoto = { ".jpg", ".jpeg", ".png" };
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".mp4" };
        public readonly ChatDbContext _dbcontext;
        public List<ValidationError> errors;
        public ValidationService(ChatDbContext dbcontext)
        {
            _dbcontext = dbcontext;
            this.errors = new();
        }

        const string EmailRegex = @"^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$";
        const string MobileRegex = @"^[6-9]{1}[0-9]{9}$";
        const string PasswordRegex = @"^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])(?=.*\W).{7,15}$";
        const string UserNameRegex = @"^[a-zA-Z0-9][a-zA-Z0-9_.]{7,17}$";
        const string LinkRegex = @"^(ftp|http|https):\/\/[^""\s]+(?:\/[^""\s]*)?$";

        public void ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.PasswordRequired,
                    reference = "Password",
                    parameter = "Password",
                    errorCode = CustomErrorCode.NullPassword
                });
            }
            else if (!Regex.IsMatch(password, PasswordRegex))
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.InvalidPasswordFormat,
                    reference = "Password",
                    parameter = "Password",
                    errorCode = CustomErrorCode.InvalidPasswordFormat
                });
            }
        }
        public void ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.EmailRequired,
                    reference = "email",
                    parameter = "email",
                    errorCode = CustomErrorCode.NullEmail
                });
            }
            else if (!Regex.IsMatch(email, EmailRegex))
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.InvalidEmailFormat,
                    reference = "email",
                    parameter = "email",
                    errorCode = CustomErrorCode.InvalidEmailFormat
                });
            }
        }
        public void ValidateUserName(string userName)
        {
            if (string.IsNullOrWhiteSpace(userName))
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.UsernameRequired,
                    reference = "UserName",
                    parameter = "UserName",
                    errorCode = CustomErrorCode.NullUserName
                });
            }
            else if (!Regex.IsMatch(userName, UserNameRegex))
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.InvalidUserNameFormat,
                    reference = "UserName",
                    parameter = "UserName",
                    errorCode = CustomErrorCode.InvalidUserNameFormat
                });
            }
        }
        public bool IsUniqueUserName(string userName, long userId)
        {
            User? user = _dbcontext.Users.FirstOrDefault(m => ((m.Username ?? string.Empty).ToLower() == (userName ?? string.Empty).ToLower() && !string.IsNullOrWhiteSpace(m.Username)) && m.Isdeleted == false && (m.Userid <= 0 || m.Userid != userId));
            if (user == null) return false;

            return true;
        }
        public List<ValidationError> ValidateChatId(long chatId)
        {
            if (chatId == 0)
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.NullChatId,
                    reference = "chatId",
                    parameter = "chatId",
                    errorCode = CustomErrorCode.NullChatId
                });
            }
            else if (chatId < 0)
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.InvalidChatId,
                    reference = "chatId",
                    parameter = "chatId",
                    errorCode = CustomErrorCode.InvalidChatId
                });
            }
            if (!_dbcontext.Chats.Any(m => m.Chatid == chatId && m.Isdeleted != true))
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.ExitsChat,
                    reference = "chatId",
                    parameter = "chatId",
                    errorCode = CustomErrorCode.IsNotExitsChat
                });
            }
            return errors;
        }
        public bool IsUniqueEmail(UserDTO model)
        {
            User? user = _dbcontext.Users.FirstOrDefault(m => ((m.Email ?? string.Empty).ToLower() == (model.Email ?? string.Empty).ToLower() && !string.IsNullOrWhiteSpace(m.Email))
                                       && m.Isdeleted != true && (m.Userid <= 0 || m.Userid != model.UserId));
            if (user == null) return false;

            return true;
        }
        public List<ValidationError> ValidateUserId(long userId)
        {
            if (userId == 0)
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.NullUserId,
                    reference = "UserId",
                    parameter = "UserId",
                    errorCode = CustomErrorCode.NullUserId
                });
            }
            else if (userId < 0)
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.InvalidUserId,
                    reference = "UserId",
                    parameter = "UserId",
                    errorCode = CustomErrorCode.InvalidUserId
                });
            }
            if (!_dbcontext.Users.Any(m => m.Userid == userId && m.Isdeleted != true))
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.ExitsUser,
                    reference = "userid",
                    parameter = "userid",
                    errorCode = CustomErrorCode.IsNotExits
                });
            }
            return errors;
        }

        public List<ValidationError> ValidateRegistration(UserDTO model)
        {
            if (model.UserId == 0)
            {
                ValidatePassword(model.Password ?? string.Empty);
            }
            ValidateEmail(model.Email ?? string.Empty);
            ValidateUserName(model.UserName);
            if (IsUniqueUserName(model.UserName, model.UserId))
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.DuplicateUsername,
                    reference = "username",
                    parameter = model.UserName,
                    errorCode = CustomErrorCode.IsUserName
                });
            }
            if (IsUniqueEmail(model))
            {
                errors.Add(new ValidationError
                {
                    message = CustomErrorMessage.DuplicateEmail,
                    reference = "Email",
                    parameter = model.Email,
                    errorCode = CustomErrorCode.IsEmail
                });

            }
           
            if (model.UserId > 0)
            {
                ValidateUserId(model.UserId);
               
            }
            return errors;
        }

        public List<ValidationError> ValidateLogin(LoginRequestDTO model)
        {
            ValidateEmail(model.Email??string.Empty);
            ValidatePassword(model.Password ?? string.Empty);
            return errors;
        }
        public List<ValidationError> ValidateProfileFile(IFormFile ProfilePhoto, long userId)
        {
            List<ValidationError> errors = new();

            ValidateUserId(userId);

            if (ProfilePhoto != null)
            {
                string fileExtension = Path.GetExtension(ProfilePhoto.FileName).ToLowerInvariant();
                if (!AllowedExtensionsProfilePhoto.Contains(fileExtension))
                {
                    errors.Add(new ValidationError
                    {
                        message = string.Format(CustomErrorMessage.InvalidPhotoExtension, string.Join(", ", AllowedExtensionsProfilePhoto)),
                        reference = "ProfilePhoto",
                        parameter = "ProfilePhoto",
                        errorCode = CustomErrorCode.InvalidPhotoExtension
                    });
                }

                int maxFileSizeInBytes = 1024 * 1024;
                if (ProfilePhoto.Length > maxFileSizeInBytes)
                {
                    errors.Add(new ValidationError
                    {
                        message = CustomErrorMessage.FileSizeLimitExceeded,
                        reference = "ProfilePhoto",
                        parameter = "ProfilePhoto",
                        errorCode = CustomErrorCode.FileSizeLimitExceeded
                    });
                }
            }

            return errors;
        }
    }
}
