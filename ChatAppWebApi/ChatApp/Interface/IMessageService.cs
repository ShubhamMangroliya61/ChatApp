using ChatAppWebApi.DTO;
using DataAccess.CustomModel;

namespace ChatAppWebApi.Interface
{
    public interface IMessageService
    {
        Task<PaginationResponceDTO<MessageDTO>> GetMessagesListAsync(RequestDTO<MessagesReqDTO> model);
        Task<MessageDTO> SaveMessagesAsync(MessageReqDTO model);
        Task<List<long>> IsDelivredMessages(long userId);
        Task MarkAsReadMessages(long userId, long chatId);
    }
}
