using ChatApp.Common;
using ChatAppWebApi.DTO;

namespace ChatAppWebApi.Interface
{
    public interface IValidationService
    {
        List<ValidationError> ValidateUserId(long userId);
        List<ValidationError> ValidateChatId(long chatId);
        List<ValidationError> ValidateRegistration(UserDTO model);
        List<ValidationError> ValidateLogin(LoginRequestDTO model);
        List<ValidationError> ValidateProfileFile(IFormFile ProfilePhoto, long userId);
    }
}
