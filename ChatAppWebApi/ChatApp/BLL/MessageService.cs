using ChatApp.Hubs;
using ChatAppWebApi.DAL.Models;
using ChatAppWebApi.DTO;
using ChatAppWebApi.Interface;
using DataAccess.CustomModel;
using InstagramWebAPI.Helpers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatAppWebApi.BLL
{
    public class MessageService : IMessageService
    {
        public readonly ChatDbContext _dbcontext;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly Helper _helper;

        public MessageService(ChatDbContext db, Helper helper, IHubContext<ChatHub> hubContext)
        {
            _dbcontext = db;
            _hubContext = hubContext;
            _helper = helper;
        }

        public async Task<PaginationResponceDTO<MessageDTO>> GetMessagesListAsync(long chatId)
        {
            IQueryable<MessageDTO> messages = _dbcontext.Messages.Where(m => m.Isdeleted == false && m.Chatid == chatId)
                .OrderBy(m => m.Createddate)
                .Select(m => new MessageDTO
                {
                    MessagesId = m.Messageid,
                    ChatId = m.Chatid,
                    ToUserId = m.Touserid,
                    FromUserId = m.Fromuserid,
                    MessageText = m.Messagetext,
                    IsSeen = m.Isseen,
                    IsDeliverd = m.Isdelivered,
                    ReplyOfMessageId =m.Replyofmessageid,
                    ReplyOfMessageText = _dbcontext.Messages.Where(n => n.Messageid == m.Replyofmessageid).Select(n => n.Messagetext).FirstOrDefault(),
                    Title = _dbcontext.Messages.Where(n => n.Messageid == m.Replyofmessageid).Select(n => n.Fromuser.Username).FirstOrDefault(),
                    CreatedDate = m.Createddate,
                });

            int totalRecords = await messages.CountAsync();

            List<MessageDTO> messages1 = await messages
                .ToListAsync();

            return new PaginationResponceDTO<MessageDTO>
            {
                Totalrecord = totalRecords,
                Record = messages1
            };
        }

        public async Task<MessageDTO> SaveMessagesAsync(MessageReqDTO model)
        {
            Message message = new Message
            {
                Chatid = model.ChatId,
                Fromuserid = model.FromUserId,
                Touserid = model.ToUserId,
                Messagetext = model.Messages ?? "",
                Isdelivered = model.IsDeliverd,
                Replyofmessageid = model.ReplyMessId
            };

            await _dbcontext.Messages.AddAsync(message);
            await _dbcontext.SaveChangesAsync();

            return new MessageDTO
            {
                MessagesId = message.Messageid,
                ChatId = message.Chatid,
                ToUserId = message.Touserid,
                FromUserId = message.Fromuserid,
                MessageText = message.Messagetext,
                IsSeen = message.Isseen,
                IsDeliverd = model.IsDeliverd,
                ReplyOfMessageId = model.ReplyMessId,
                ReplyOfMessageText = _dbcontext.Messages.Where(n => n.Messageid == model.ReplyMessId).Select(n => n.Messagetext).FirstOrDefault(),
                Title = _dbcontext.Messages.Where(n => n.Messageid == model.ReplyMessId).Select(n => n.Fromuser.Username).FirstOrDefault(),
                CreatedDate = message.Createddate
            };
        }

        public async Task<List<long>> IsDelivredMessages(long userId)
        {
            List<Message> messages = _dbcontext.Messages.Where(m => m.Isdeleted == false && m.Isseen == false && m.Isdelivered == false && m.Touserid == userId).ToList();

            messages.ForEach(x =>
            {
                x.Isdelivered = true;
            });
            await _dbcontext.SaveChangesAsync();

            List<long> messageIds = messages.Select(m => m.Messageid).ToList();
            return messageIds;
        }

        public async Task MarkAsReadMessages(long userId, long chatId)
        {
            List<Message> messages = _dbcontext.Messages.Where(m => m.Isdeleted == false && m.Isseen == false && m.Fromuserid == userId && m.Chatid == chatId).ToList();

            messages.ForEach(x =>
            {
                x.Isseen = true;
            });
            await _dbcontext.SaveChangesAsync();
        }
    }
}
