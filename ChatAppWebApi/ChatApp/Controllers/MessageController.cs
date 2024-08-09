using ChatApp.Common;
using ChatApp.Utils;
using ChatAppWebApi.DTO;
using ChatAppWebApi.Interface;
using DataAccess.CustomModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    [Route("Message")]
    [ApiController]
    public class MessageController : ControllerBase 
    {
        private readonly IValidationService _validationService;
        private readonly IMessageService _messageService;
        private readonly ResponseHandler _responseHandler;

        public MessageController(IValidationService validationService, ResponseHandler responseHandler, IMessageService messageService)
        {
            _validationService = validationService;
            _responseHandler = responseHandler;
            _messageService = messageService;
        }

        [HttpPost("GetMessagesListAsync")]
        [Authorize]
        public async Task<ActionResult> GetMessagesListAsync(long chatId)
        {
            try
            {
                List<ValidationError> errors = _validationService.ValidateChatId(chatId);
                if (errors.Any())
                {
                    return BadRequest(_responseHandler.BadRequest(CustomErrorCode.IsValid, CustomErrorMessage.ValidationChat, errors));
                }
                PaginationResponceDTO<MessageDTO> data = await _messageService.GetMessagesListAsync(chatId);
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
