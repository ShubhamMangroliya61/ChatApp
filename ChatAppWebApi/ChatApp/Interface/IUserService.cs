using ChatAppWebApi.DTO;

namespace ChatAppWebApi.Interface
{
    public interface IUserService
    {
        Task<ProfilePhotoResponceDTO> UploadProfilePhotoAsync(IFormFile ProfilePhoto, long userId);
        Task<UserDTO> GetUserByIdAsync(long userId);
        Task<PaginationResponceDTO<UserDTO>> GetUserListByUserNameAsync(PaginationRequestDTO model);
    }
}
