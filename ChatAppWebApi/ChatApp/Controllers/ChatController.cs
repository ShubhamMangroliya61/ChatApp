using ChatApp.Common;
using ChatApp.Utils;
using ChatAppWebApi.DTO;
using ChatAppWebApi.Interface;
using InstagramWebAPI.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    [Route("Chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IValidationService _validationService;
        private readonly IChatService _chatService;
        private readonly ResponseHandler _responseHandler;

        public ChatController(IValidationService validationService, ResponseHandler responseHandler, IChatService chatService)
        {
            _validationService = validationService;
            _responseHandler = responseHandler;
            _chatService = chatService;
        }

        [HttpPost("GetChatListAsync")]
        [Authorize]
        public async Task<ActionResult> GetChatListAsync([FromBody] PaginationRequestDTO model)
        {
            try
            {
                PaginationResponceDTO<ChatDTO> data = await _chatService.GetChatListAsync(model);
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
    }
}
