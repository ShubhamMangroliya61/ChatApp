using ChatAppWebApi.DTO;

namespace ChatAppWebApi.Interface
{
    public interface IChatService
    {
        Task<ChatDTO> CreateChatAsync(long fromUserId, long ToUserId);
        Task<PaginationResponceDTO<ChatDTO>> GetChatListAsync(PaginationRequestDTO model);
    }
}
