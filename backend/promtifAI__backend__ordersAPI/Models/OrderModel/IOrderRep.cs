using promtifAI__backend__ordersAPI.Models.OrderModel.Dto;

namespace promtifAI__backend__ordersAPI.Models.OrderModel
{
    public interface IOrderRep
    {
        bool SaveChanges();

        bool CreateOrder(Order order);
        IEnumerable<Order> GetOrdersByUser(int userId);
    }
}
