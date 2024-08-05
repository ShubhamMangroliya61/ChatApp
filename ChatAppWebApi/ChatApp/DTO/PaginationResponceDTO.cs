namespace ChatAppWebApi.DTO
{
    public class PaginationResponceDTO<T> where T : class
    {
        public int Totalrecord { get; set; }

        public int PageSize { get; set; }

        public int PageNumber { get; set; }

        public int RequirdPage { get; set; }

        public required List<T> Record { get; set; }
    }
}
