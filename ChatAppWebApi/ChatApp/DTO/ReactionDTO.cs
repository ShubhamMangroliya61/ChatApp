namespace ChatAppWebApi.DTO
{
    public class ReactionDTO
    {
        public long MessageId { get; set; }
        public long ToUserId { get; set; }
        public long ReactionId { get; set; }
    }
}
