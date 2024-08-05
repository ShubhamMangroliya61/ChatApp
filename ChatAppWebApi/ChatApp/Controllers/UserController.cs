using ChatApp.Common;
using ChatApp.Utils;
using ChatAppWebApi.DTO;
using ChatAppWebApi.Interface;
using InstagramWebAPI.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    [Route("User")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IValidationService _validationService;
        private readonly IUserService _userService;
        private readonly ResponseHandler _responseHandler;
        private readonly Helper _helper;
        private readonly IAuthService _authService;

        public UserController(IValidationService validationService, ResponseHandler responseHandler, IUserService userService, IAuthService authService, Helper helper)
        {
            _validationService = validationService;
            _responseHandler = responseHandler;
            _userService = userService;
            _authService = authService;
            _helper = helper;
        }
        /// <summary>
        /// Handles the asynchronous upload of a user's profile photo.
        /// </summary>
        /// <param name="model">The data transfer object containing the profile photo to upload.</param>
        /// <returns>An <see cref="ActionResult{T}"/> representing the result of the profile photo upload operation.</returns>
        [HttpPost("UploadProfilePhoto")]
        [Authorize]
        public async Task<ActionResult> UploadProfilePhotoAsync(IFormFile? ProfilePhoto)
        {
            try
            {
                long userId = _helper.GetUserIdClaim();
                List<ValidationError> errors = _validationService.ValidateProfileFile(ProfilePhoto, userId);
                if (errors.Any())
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsValid, CustomErrorMessage.ValidationProfile, errors));
                }

                ProfilePhotoResponceDTO profilePhotoDTO = await _userService.UploadProfilePhotoAsync(ProfilePhoto, userId);
                if (profilePhotoDTO == null)
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsUpload, CustomErrorMessage.UploadError, ""));
                }
                return Ok(_responseHandler.Success(CustomErrorMessage.UploadPhoto, profilePhotoDTO));
            }
            catch (Exception ex)
            {
                if (ex is ValidationException vx)
                {
                    return BadRequest(_responseHandler.BadRequest(vx.ErrorCode, vx.Message, vx.Errors));
                }
                else
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsUpload, ex.Message, ""));
                }
            }
        }

        /// <summary>
        /// Handles the asynchronous update of user profile information.
        /// </summary>
        /// <param name="model">The data transfer object containing the updated user profile data.</param>
        /// <returns>An <see cref="ActionResult{T}"/> representing the result of the profile update operation.</returns>
        [Authorize]
        [HttpPost("UpdateProfile")]
        public async Task<ActionResult> UpdateProfileAsync(UserDTO model)
        {
            try
            {
                model.UserId = _helper.GetUserIdClaim();
                List<ValidationError> errors = _validationService.ValidateRegistration(model);
                if (errors.Any())
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsValid, CustomErrorMessage.ValidationUpdateProfile, errors));
                }

                UserDTO? user = await _authService.UpSertUserAsync(model);
                if (user == null)
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsUpdate, CustomErrorMessage.UpdateProfile, ""));
                }
                return Ok(_responseHandler.Success(CustomErrorMessage.UpdateProfileSuccess, user));
            }
            catch (Exception ex)
            {
                if (ex is ValidationException vx)
                {
                    return BadRequest(_responseHandler.BadRequest(vx.ErrorCode, vx.Message, vx.Errors));
                }
                else
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsUpload, ex.Message, ""));
                }
            }
        }

        /// <summary>
        /// Retrieves a paginated list of users based on the provided username search criteria.
        /// </summary>
        /// <param name="model">Request DTO containing the user ID and pagination parameters.</param>
        /// <returns>
        /// An ActionResult representing the result of the operation.
        /// If successful, returns HTTP 200 (OK) with a pagination response model containing the list of users.
        /// If validation fails or an error occurs, returns HTTP 400 (Bad Request) with an error message.
        /// </returns>
        [HttpPost("GetUserListByUserName")]
        [Authorize]
        public async Task<ActionResult> GetUserListByUserNameAsync([FromBody] PaginationRequestDTO model)
        {
            try
            {
                PaginationResponceDTO<UserDTO> data = await _userService.GetUserListByUserNameAsync(model);
                if (data == null)
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsGetLIst, CustomErrorMessage.GetFollowerList, ""));
                }
                return Ok(_responseHandler.Success(CustomErrorMessage.GetFollowerListSucces, data));
            }
            catch (Exception ex)
            {
                if (ex is ValidationException vx)
                {
                    return BadRequest(_responseHandler.BadRequest(vx.ErrorCode, vx.Message, vx.Errors));
                }
                else
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsGetLIst, ex.Message, ""));
                }
            }
        }

        /// <summary>
        /// Retrieves user data by user ID asynchronously.
        /// </summary>
        /// <param name="userId">The ID of the user to retrieve.</param>
        /// <returns>An <see cref="ActionResult{T}"/> representing the result of the user retrieval operation.</returns>
        [HttpGet("GetUserById")]
        [Authorize]
        public async Task<ActionResult> GetUserById(long userId)
        {
            try
            {
                List<ValidationError> errors = _validationService.ValidateUserId(userId);
                if (errors.Any())
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsValid, CustomErrorMessage.ExitsUser, errors));
                }
                UserDTO data = await _userService.GetUserByIdAsync(userId);
                if (data == null)
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsNotExits, CustomErrorMessage.ExitsUser, ""));
                }
                return Ok(_responseHandler.Success(CustomErrorMessage.GetUser, data));
            }
            catch (Exception ex)
            {
                if (ex is ValidationException vx)
                {
                    return BadRequest(_responseHandler.BadRequest(vx.ErrorCode, vx.Message, vx.Errors));
                }
                else
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsGetLIst, ex.Message, ""));
                }
            }
        }
    }
}
