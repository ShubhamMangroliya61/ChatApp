using ChatApp.Common;
using ChatApp.Utils;
using ChatAppWebApi.DAL.Models;
using ChatAppWebApi.DTO;
using ChatAppWebApi.Interface;
using InstagramWebAPI.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ChatAppWebApi.BLL
{
    public class UserService:IUserService
    {
        public readonly ChatDbContext _dbcontext;
        public readonly Helper _helper;
        public UserService(ChatDbContext db, Helper helper)
        {
            _dbcontext = db;
            _helper = helper;
        }

        /// <summary>
        /// Uploads a profile photo for a user asynchronously.
        /// </summary>
        /// <param name="model">The model containing UserId and the profile photo to upload.</param>
        /// <returns>A ProfilePhotoResponseDTO containing the uploaded photo details.</returns>
        public async Task<ProfilePhotoResponceDTO> UploadProfilePhotoAsync(IFormFile ProfilePhoto, long userId)
        {

            User user = await _dbcontext.Users.FirstOrDefaultAsync(m => m.Userid == userId && m.Isdeleted != true) ??
               throw new ValidationException(CustomErrorMessage.ExitsUser, CustomErrorCode.IsNotExits, new List<ValidationError>
               {
                    new ValidationError
                    {
                        message = CustomErrorMessage.ExitsUser,
                        reference = "UserName",
                        parameter = "UserName",
                        errorCode = CustomErrorCode.IsNotExits
                    }
               });

            IFormFile file = ProfilePhoto;

            // Delete the old profile photo file if it exists
            if (!string.IsNullOrEmpty(user.Profilepictureurl) && System.IO.File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.Profilepictureurl)))
            {
                System.IO.File.Delete(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.Profilepictureurl));
            }

            if (ProfilePhoto != null)
            {
                string userID = userId.ToString();

                string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "User", userID);

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                string filePath = Path.Combine(path, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                user.Profilepictureurl = filePath;
                user.Profilepicturename = fileName;
            }
            else
            {
                user.Profilepictureurl = null;
                user.Profilepicturename = null;
            }
            user.Modifieddate = DateTime.Now;
            _dbcontext.Users.Update(user);
            await _dbcontext.SaveChangesAsync();

            ProfilePhotoResponceDTO photoResponseDTO = new()
            {
                ProfilePhotoBase64 = _helper.GetProfileImage(user.Userid, user.Profilepicturename??""),
                UserId = user.Userid,
            };
            return photoResponseDTO;
        }
        /// <summary>
        /// Retrieves a user by their ID asynchronously.
        /// </summary>
        /// <param name="userId">The ID of the user to retrieve.</param>
        /// <returns>A UserDTO object representing the user.</returns>
        public async Task<UserDTO> GetUserByIdAsync(long userId)
        {
            User user = await _dbcontext.Users.FirstOrDefaultAsync(m => m.Userid == userId && !m.Isdeleted)
                        ?? throw new ValidationException(CustomErrorMessage.ExitsUser, CustomErrorCode.IsNotExits, new List<ValidationError>
                        {
                    new ValidationError
                    {
                        message = CustomErrorMessage.ExitsUser,
                        reference = "userId",
                        parameter = "userId",
                        errorCode = CustomErrorCode.IsNotExits
                    }
                        });

            UserDTO userDTO = new()
            {
                UserId = user.Userid,
                UserName = user.Username,
                Email = user.Email,
                Name = user.Name,
                ProfilePictureName =_helper.GetProfileImage(user.Userid ,user.Profilepicturename??""),
            };

            return userDTO;
        }

        /// <summary>
        /// Retrieves a paginated list of users based on the provided search criteria asynchronously.
        /// </summary>
        /// <param name="model">The request details, including the search name, page number, and page size.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a PaginationResponceModel of UserDTO which includes total records, page size, page number, required pages, and a list of user DTOs matching the search criteria.</returns>
        public async Task<PaginationResponceDTO<UserDTO>> GetUserListByUserNameAsync(PaginationRequestDTO model)
        {
            long logInUserId = _helper.GetUserIdClaim();
            IQueryable<UserDTO> data = _dbcontext.Users
                 .Where(m => m.Isdeleted == false && m.Userid != logInUserId &&
                            (string.IsNullOrEmpty(model.SearchName) ||
                            (m.Username ?? string.Empty).ToLower().Contains(model.SearchName.ToLower())))
                 .Select(user => new UserDTO
                 {
                     UserId = user.Userid,
                     UserName = user.Username,
                     Email = user.Email,
                     Name = user.Name,
                     ProfilePictureName = user.Profilepicturename,
                 });

            int totalRecords = await data.CountAsync();
            int requiredPages = (int)Math.Ceiling((decimal)totalRecords / model.PageSize);

            // Paginate the data
            List<UserDTO> records = await data
                .Skip((model.PageNumber - 1) * model.PageSize)
                .Take(model.PageSize)
                .ToListAsync();

            List<UserDTO> userDTOs = records.Select(c => new UserDTO
            {
                UserId = c.UserId,
                UserName = c.UserName,
                Email = c.Email,
                Name = c.Name,
                ProfilePictureName = _helper.GetProfileImage(c.UserId, c.ProfilePictureName ?? ""),
            }).ToList();

            return new PaginationResponceDTO<UserDTO>
            {
                Totalrecord = totalRecords,
                PageSize = model.PageSize,
                PageNumber = model.PageNumber,
                RequirdPage = requiredPages,
                Record = records,
            };
        }

        
    }
}
