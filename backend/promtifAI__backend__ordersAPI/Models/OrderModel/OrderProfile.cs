using AutoMapper;
using promtifAI__backend__ordersAPI.Models.OrderModel.Dto;

namespace promtifAI__backend__ordersAPI.Models.OrderModel
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<Order, OrderReadDto>();
            CreateMap<OrderCreateDto, Order>();
        }
    }
}
