using ChatApp.Hubs;
using ChatAppWebApi.DAL.Models;
using ChatAppWebApi.DTO;
using ChatAppWebApi.Interface;
using InstagramWebAPI.Helpers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatAppWebApi.BLL
{
    public class ChatService :IChatService
    {

        public readonly ChatDbContext _dbcontext;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly Helper _helper;

        public ChatService(ChatDbContext db, Helper helper , IHubContext<ChatHub> hubContext)
        {
            _dbcontext = db;
            _hubContext = hubContext;
            _helper = helper;
        }

        public async Task<ChatDTO> CreateChatAsync(long fromUserId, long ToUserId)
        {
            //long UserId = _helper.GetUserIdClaim();

            Chat? chat = await _dbcontext.Chats.FirstOrDefaultAsync(m => (m.Fromuserid == fromUserId && m.Touserid == ToUserId) || (m.Touserid == fromUserId && m.Fromuserid == ToUserId));
            Chat obj = chat ?? new();

            if (chat == null)
            {
                obj.Fromuserid = fromUserId;
                obj.Touserid = ToUserId;
                await _dbcontext.Chats.AddAsync(obj);
                await _dbcontext.SaveChangesAsync();
            }

            return new ChatDTO
            {
                ChatId = obj.Chatid,
                ToUserId = obj.Touserid,
                ToUserName = (await _dbcontext.Users.FindAsync(obj.Touserid))?.Username ?? string.Empty,
                ProfileName = (await _dbcontext.Users.FindAsync(obj.Touserid))?.Profilepicturename ?? string.Empty,
                CreatedDate = obj.Createddate
            };
        }

        public async Task<PaginationResponceDTO<ChatDTO>> GetChatListAsync(PaginationRequestDTO model)
        {
            long userId = _helper.GetUserIdClaim();

            // Query for chats initiated by the current user (fromChats)
            IQueryable<ChatDTO> fromChatsQuery = _dbcontext.Chats
                .Include(m => m.Messages)
                .Where(m => !m.Isdeleted && m.Fromuserid == userId && 
                      (string.IsNullOrEmpty(model.SearchName) ||
                            (m.Touser.Username ?? string.Empty).ToLower().Contains(model.SearchName.ToLower())))
                .Include(m => m.Touser)
                .Select(m => new ChatDTO
                {
                    ChatId = m.Chatid,
                    ToUserId = m.Touser.Userid,
                    ToUserName = m.Touser.Username,
                    ProfileName = m.Touser.Profilepicturename,
                    CreatedDate = m.Messages.OrderByDescending(m => m.Createddate).First().Createddate,
                    LastMessage = m.Messages.OrderByDescending(m => m.Createddate).First().Messagetext,
                    Unread = m.Messages.Count(msg => msg.Isseen == false && msg.Isdelivered == true)
                });

            // Query for chats received by the current user (toChats)
            IQueryable<ChatDTO> toChatsQuery = _dbcontext.Chats
                .Include(m => m.Messages)
                .Where(m => !m.Isdeleted && m.Touserid == userId &&
                           (string.IsNullOrEmpty(model.SearchName) ||
                            (m.Fromuser.Username ?? string.Empty).ToLower().Contains(model.SearchName.ToLower())))
                .Include(m => m.Fromuser)
                .Select(m => new ChatDTO
                {
                    ChatId = m.Chatid,
                    ToUserId = m.Fromuser.Userid,
                    ToUserName = m.Fromuser.Username,
                    ProfileName = m.Fromuser.Profilepicturename,
                    CreatedDate = m.Messages.OrderByDescending(m => m.Createddate).First().Createddate,
                    LastMessage = m.Messages.OrderByDescending(m => m.Createddate).First().Messagetext,
                    Unread = m.Messages.Count(msg => msg.Isseen == false && msg.Isdelivered == true)
                });

            IQueryable<ChatDTO> allChatsQuery = fromChatsQuery.Concat(toChatsQuery).Distinct().OrderByDescending(m => m.CreatedDate);

            int totalRecords = await allChatsQuery.CountAsync();

            int requiredPages = (int)Math.Ceiling((decimal)totalRecords / model.PageSize);

            List<ChatDTO> chats = await allChatsQuery
                .Skip((model.PageNumber - 1) * model.PageSize)
                .Take(model.PageSize)
                .ToListAsync();

            List<ChatDTO> chatDTOs = chats.Select(c => new ChatDTO
            {
                ChatId = c.ChatId,
                ToUserId = c.ToUserId,
                ToUserName = c.ToUserName,
                CreatedDate = c.CreatedDate,
                ProfileName = _helper.GetProfileImage(c.ToUserId, c.ProfileName ?? ""),
                LastMessage = c.LastMessage,
                Unread = c.Unread,
                IsOnline = !string.IsNullOrEmpty(ChatHub.GetConnectionId(c.ToUserId.ToString()))
            }).ToList();

            return new PaginationResponceDTO<ChatDTO>
            {
                Totalrecord = totalRecords,
                PageSize = model.PageSize,
                PageNumber = model.PageNumber,
                RequirdPage = requiredPages,
                Record = chatDTOs
            };
        }

    }
}
