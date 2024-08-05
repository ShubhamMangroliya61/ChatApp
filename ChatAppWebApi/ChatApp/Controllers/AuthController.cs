using ChatApp.Common;
using ChatApp.Utils;
using ChatAppWebApi.DTO;
using ChatAppWebApi.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ChatAppWebApi.Controllers
{
    [Route("Auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IValidationService _validationService;
        private readonly IAuthService _authService;
        private readonly ResponseHandler _responseHandler;

        public AuthController(IValidationService validationService, ResponseHandler responseHandler, IAuthService authService)
        {
            _validationService = validationService;
            _responseHandler = responseHandler;
            _authService = authService;
        }

        /// <summary>
        /// Registers a new user asynchronously.
        /// </summary>
        /// <param name="model">The registration information.</param>
        /// <returns>A response indicating success or failure of the registration.</returns>
        /// <response code="200">Returns when the registration is successful.</response>
        /// <response code="400">Returns when there are validation errors or registration fails.</response>
        [HttpPost("Register")]
        public async Task<ActionResult> UserRegisterAsync([FromBody] UserDTO model)
        {
            try
            {
                List<ValidationError> errors = _validationService.ValidateRegistration(model);
                if (errors.Any())
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsValid, CustomErrorMessage.ValidationRegistrtion, errors));
                }

                UserDTO? user = await _authService.UpSertUserAsync(model);
                if (user == null)
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsRegister, CustomErrorMessage.RegistrationError, ""));
                }

                return Ok(_responseHandler.Success(CustomErrorMessage.RegistrationSucces, user));
            }
            catch (Exception ex)
            {
                return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsRegister, ex.Message, ""));
            }
        }

        /// <summary>
        /// Logs in a user asynchronously.
        /// </summary>
        /// <param name="model">The login credentials.</param>
        /// <returns>An IActionResult representing the success or failure of the login attempt.</returns>
        /// <response code="200">Returns when the login is successful.</response>
        /// <response code="400">Returns when there are validation errors or login fails.</response>
        [HttpPost("Login")]
        public async Task<ActionResult> UserLoginAsync([FromBody] LoginRequestDTO model)
        {
            try
            {
                List<ValidationError> errors = _validationService.ValidateLogin(model);
                if (errors.Any())
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsValid, CustomErrorMessage.ValidationLogin, errors));
                }

                LoginResponseDTO loginResponse = await _authService.UserLoginAsync(model);
                if (string.IsNullOrEmpty(loginResponse.Token))
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsLogin, CustomErrorMessage.InvalidUsernameOrPassword, ""));
                }

                return Ok(_responseHandler.Success(CustomErrorMessage.LoginSucces, loginResponse));
            }
            catch (Exception ex)
            {
                return BadRequest(_responseHandler.BadRequest(CustomErrorCode.LoginError, ex.Message, ""));
            }
        }
    }
}
