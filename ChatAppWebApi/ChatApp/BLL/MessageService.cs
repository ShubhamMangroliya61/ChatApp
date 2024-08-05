using ChatApp.Hubs;
using ChatAppWebApi.DAL.Models;
using ChatAppWebApi.DTO;
using DataAccess.CustomModel;
using InstagramWebAPI.Helpers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatAppWebApi.BLL
{
    public class MessageService
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

        public async Task<PaginationResponceDTO<MessageDTO>> GetMessagesListAsync(RequestDTO<MessagesReqDTO> model)
        {
            IQueryable<MessageDTO> messages = _dbcontext.Messages.Where(m => m.Isdeleted == false && m.Chatid == model.Model.ChatId)
                .Select(m => new MessageDTO
                {
                    MessagesId = m.Messageid,
                    ChatId = m.Chatid,
                    ToUserId = m.Touserid,
                    FromUserId = m.Fromuserid,
                    MessageText = m.Messagetext,
                    IsSeen = m.Isseen,
                    IsDeliverd = m.Isdelivered,
                    CreatedDate = m.Createddate,
                });

            int totalRecords = await messages.CountAsync();
            int requiredPages = (int)Math.Ceiling((decimal)totalRecords / model.PageSize);

            List<MessageDTO> messages1 = await messages
                .Skip((model.PageNumber - 1) * model.PageSize)
                .Take(model.PageSize)
                .ToListAsync();

            return new PaginationResponceDTO<MessageDTO>
            {
                Totalrecord = totalRecords,
                PageSize = model.PageSize,
                PageNumber = model.PageNumber,
                RequirdPage = requiredPages,
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
                Isdelivered = model.IsDeliverd
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
