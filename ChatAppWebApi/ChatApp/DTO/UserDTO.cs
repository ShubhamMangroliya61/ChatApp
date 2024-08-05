namespace ChatAppWebApi.DTO
{
    public class UserDTO
    {
        public long UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? ProfilePictureName { get; set; }
        public bool IsDeleted { get; set; } = false;
        public string? Password { get; set; }
    }
}
