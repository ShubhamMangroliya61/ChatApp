namespace ChatAppWebApi.DTO
{
    public class MessageDTO
    {
        public long MessagesId { get; set; }
        public long ChatId { get; set; }
        public long FromUserId { get; set; }
        public long ToUserId { get; set; }
        public string? MessageText { get; set; }
        public bool IsSeen { get; set; }
        public bool IsDeliverd { get; set; }
        public long? ReplyOfMessageId { get; set; }
        public string? Title { get; set; }
        public string? ReplyOfMessageText { get; set; }
        public DateTime? CreatedDate { get; set; }

    }
}
