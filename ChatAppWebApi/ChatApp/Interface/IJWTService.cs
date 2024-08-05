

using ChatAppWebApi.DAL.Models;

namespace ChatAppWebApi.Interface
{
    public interface IJWTService
    {
        string GetJWTToken(User user);
    }
}
