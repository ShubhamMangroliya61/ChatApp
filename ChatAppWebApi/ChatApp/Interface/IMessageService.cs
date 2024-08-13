using ChatAppWebApi.DTO;
using DataAccess.CustomModel;

namespace ChatAppWebApi.Interface
{
    public interface IMessageService
    {
        Task<PaginationResponceDTO<MessageDTO>> GetMessagesListAsync(long chatId);
        Task<MessageDTO> SaveMessagesAsync(MessageReqDTO model);
        Task<List<long>> IsDelivredMessages(long userId);
        Task MarkAsReadMessages(long userId, long chatId);
        Task SendMessageReaction(long messageId, long ReactionId);
    }
}
