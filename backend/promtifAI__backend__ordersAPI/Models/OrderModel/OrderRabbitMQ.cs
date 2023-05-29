using RabbitMQ.Client;
using System.Text;

namespace promtifAI__backend__ordersAPI.Models.OrderModel
{
    public class OrderRabbitMQ
    {
        private static readonly Lazy<OrderRabbitMQ> _orderErrorMQ = new(() => new("Order_Error_Exchange"));
        private static readonly Lazy<OrderRabbitMQ> _orderActionMQ = new(() => new("Order_Action_Exchange"));

        private readonly string _hostname;
        private readonly string _exchangeName;
        private readonly IModel _channel;

        private OrderRabbitMQ(string exchangeName)
        {
            _hostname = "localhost";
            _exchangeName = exchangeName;

            var factory = new ConnectionFactory() { HostName = _hostname };
            var connection = factory.CreateConnection();
            _channel = connection.CreateModel();
            _channel.ExchangeDeclare(_exchangeName, ExchangeType.Fanout);
        }

        public static OrderRabbitMQ OrderErrorMQ => _orderErrorMQ.Value;
        public static OrderRabbitMQ OrderActionMQ => _orderActionMQ.Value;

        public void SendMessage(string message)
        {
            var body = Encoding.UTF8.GetBytes(message);
            _channel.BasicPublish(_exchangeName, "", null, body);
        }
    }
}
