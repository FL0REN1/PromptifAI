using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using promtifAI__backend__ordersAPI.Models.OrderModel;
using promtifAI__backend__ordersAPI.Models.OrderModel.Dto;

namespace promtifAI__backend__ordersAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        #region [DATA]

        private readonly IOrderRep _repository;
        private readonly IMapper _mapper;

        #endregion

        /// <summary>
        /// [CONSTRUCTOR]
        /// </summary>
        /// <param name="repository"></param>
        /// <param name="mapper"></param>
        public OrderController(IOrderRep repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        #region [WEB_API]

        /// <summary>
        /// [CREATE_ORDER]
        /// </summary>
        /// <param name="orderCreateDto"></param>
        /// <returns></returns>
        [HttpPost(Name = "CreateOrder")]
        public ActionResult<OrderReadDto> CreateOrder([FromBody] OrderCreateDto orderCreateDto)
        {
            string logMessage = $"--> Order creation: {orderCreateDto.Type}...";
            OrderRabbitMQ.OrderActionMQ.SendMessage(logMessage);

            Order orderModel = _mapper.Map<Order>(orderCreateDto);
            bool success = _repository.CreateOrder(orderModel);
            if (!success) return NotFound();
            _repository.SaveChanges();

            OrderReadDto orderReadDto = _mapper.Map<OrderReadDto>(orderModel);

            string logMessage2 = $"--> User created successfully ! [{orderReadDto.Id}]";
            OrderRabbitMQ.OrderActionMQ.SendMessage(logMessage2);

            return Ok(orderReadDto);
        }

        /// <summary>
        /// [GET_ORDERS_BY_USER]
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet(Name = "GetAllOrderByUserId")]
        public ActionResult<IEnumerable<OrderReadDto>> GetOrdersByUser(int userId) 
        {
            string logMessage = "--> Getting all order by user id...";
            OrderRabbitMQ.OrderActionMQ.SendMessage(logMessage);

            var userModel = _repository.GetOrdersByUser(userId);

            string logMessage2 = $"--> Users received successfully !";
            OrderRabbitMQ.OrderActionMQ.SendMessage(logMessage2);

            return Ok(_mapper.Map<IEnumerable<OrderReadDto>>(userModel));
        }

        #endregion
    }
}
