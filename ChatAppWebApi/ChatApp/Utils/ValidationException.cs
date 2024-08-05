using ChatApp.Common;

namespace ChatApp.Utils
{
    public class ValidationException : Exception
    {
        public List<ValidationError> Errors =new();
        public string ErrorCode { get; set; }
        public ValidationException(string message, string errorCode, List<ValidationError> errors ) : base(message)
        {
           this.ErrorCode = errorCode;
            this.Errors = errors;
        }
    }
}
