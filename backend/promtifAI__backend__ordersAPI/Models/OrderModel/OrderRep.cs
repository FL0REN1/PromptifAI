namespace promtifAI__backend__ordersAPI.Models.OrderModel
{
    public class OrderRep : IOrderRep
    {
        #region [DATA]

        private readonly OrderContext _context;

        #endregion

        /// <summary>
        /// [ORDER_REP CONSTRUCTOR]
        /// </summary>
        /// <param name="context"></param>
        public OrderRep(OrderContext context)
        {
            _context = context;
        }

        /// <summary>
        /// [CREATE_ORDER]
        /// </summary>
        /// <param name="order"></param>
        /// <returns></returns>
        public bool CreateOrder(Order order)
        {
            if (order == null)
            {
                string message = "[X] Failed to create user because it is empty";
                OrderRabbitMQ.OrderErrorMQ.SendMessage(message);
                return false;
            }
            _context.Orders.Add(order);
            return true;
        }

        /// <summary>
        /// [GET_ORDERS_BY_USER]
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public IEnumerable<Order> GetOrdersByUser(int userId)
        {
            return _context.Orders.Where(order => order.OrderId == userId).ToList();
        }

        public bool SaveChanges()
        {
            return _context.SaveChanges() > 0;
        }
    }
}
