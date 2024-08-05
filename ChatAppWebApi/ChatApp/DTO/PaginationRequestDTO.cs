namespace ChatAppWebApi.DTO
{
    public class PaginationRequestDTO
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string? SearchName { get; set; }
    }
}
