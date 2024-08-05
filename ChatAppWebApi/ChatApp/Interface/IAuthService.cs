using ChatAppWebApi.DTO;

namespace ChatAppWebApi.Interface
{
    public interface IAuthService
    {
        Task<UserDTO> UpSertUserAsync(UserDTO model);
        Task<LoginResponseDTO> UserLoginAsync(LoginRequestDTO model);
    }
}
