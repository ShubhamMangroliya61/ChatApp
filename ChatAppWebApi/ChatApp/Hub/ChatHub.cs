﻿
using ChatAppWebApi.DAL.Models;
using ChatAppWebApi.DTO;
using ChatAppWebApi.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;

namespace ChatApp.Hubs
{
    [EnableCors("AllowAll")]
    public class ChatHub : Hub
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IChatService _chatService;
        private readonly IMessageService _messageService;


        private static readonly ConcurrentDictionary<string, string> ConnectedUsers = new ConcurrentDictionary<string, string>();

        public ChatHub(IHubContext<ChatHub> hubContext, IHttpContextAccessor httpContextAccessor, IChatService chatService, IMessageService messageService)
        {
            _hubContext = hubContext;
            _httpContextAccessor = httpContextAccessor;
            _chatService = chatService;
            _messageService = messageService;
        }

        public override async Task OnConnectedAsync()
        {
            string userId = GetClaimUserId();
            ConnectedUsers[userId] = Context.ConnectionId;
            List<long> messId = await _messageService.IsDelivredMessages(Int32.Parse(userId));
            await Clients.All.SendAsync("UserConnected", userId, messId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            string userId = GetClaimUserId();
            ConnectedUsers.TryRemove(userId, out _);
            await Clients.All.SendAsync("UserDisconnected", userId);

            if (exception != null)
            {
                Console.WriteLine($"Disconnected with error: {exception.Message}");
            }

            await base.OnDisconnectedAsync(exception);
        }

        public string GetClaimUserId()
        {
            var jwtToken = _httpContextAccessor.HttpContext?.Request.Query["access_token"].FirstOrDefault()?.Split(" ").LastOrDefault();
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(jwtToken);
            var claims = token.Claims.Select(claim => (claim.Type, claim.Value)).ToList();

            return claims.FirstOrDefault(m => m.Type == "UserId").Value;
        }

        public async Task<MessageDTO> SendMessageToUser(long toUserId, string message, long chatId, long replyMessId)
        {
            ConnectedUsers.TryGetValue(toUserId.ToString(), out var connectionId);
            MessageReqDTO messReq = new()
            {
                ChatId = chatId,
                ToUserId = toUserId,
                FromUserId = Int32.Parse(GetClaimUserId()),
                Messages = message,
                ReplyMessId = replyMessId,
                IsDeliverd = connectionId != null ? true : false
            };

            MessageDTO messageDTO = await _messageService.SaveMessagesAsync(messReq);

            if (connectionId != null)
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", messageDTO);
            }
            return messageDTO;
        }

        public async Task<ChatDTO> CreateChat(long toUserId)
        {
            ConnectedUsers.TryGetValue(toUserId.ToString(), out var connectionId);

            ChatDTO chatDTO = await _chatService.CreateChatAsync(Int32.Parse(GetClaimUserId()), toUserId);

            if (connectionId != null)
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("CreateChat", chatDTO);
            }

            return chatDTO;
        }

        public async Task MarkAsReadMessages(long userId, long chatId)
        {
            await _messageService.MarkAsReadMessages(userId, chatId);
            if (ConnectedUsers.TryGetValue(userId.ToString(), out var connectionId))
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("MarkAsRead", userId, chatId);
            }
        }

        public async Task<ReactionDTO> Sendmessagereaction(long toUserId, long messageId, long reactionId)
        {
            await _messageService.SendMessageReaction(messageId,reactionId);
            ReactionDTO reactionDTO = new ()
            {
                MessageId = messageId,
                ReactionId = reactionId,
                ToUserId = toUserId
            };
            if (ConnectedUsers.TryGetValue(toUserId.ToString(), out var connectionId))
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("ReactionMessages", reactionDTO);
            }
            return reactionDTO;
        }

        public static string? GetConnectionId(string userId)
        {
            ConnectedUsers.TryGetValue(userId, out var connectionId);
            return connectionId;
        }
    }
}
