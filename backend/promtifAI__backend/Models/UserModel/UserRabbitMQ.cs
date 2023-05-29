using RabbitMQ.Client;
using System.Text;
using IModel = RabbitMQ.Client.IModel;

namespace promtifAI__backend.Models.UserModel
{
    public class UserRabbitMQ
    {
        private static readonly Lazy<UserRabbitMQ> _userErrorMQ = new(() => new("User_Error_Exchange"));
        private static readonly Lazy<UserRabbitMQ> _userActionMQ = new(() => new("User_Action_Exchange"));

        private readonly string _hostname;
        private readonly string _exchangeName;
        private readonly IModel _channel;

        private UserRabbitMQ(string exchangeName)
        {
            _hostname = "localhost";
            _exchangeName = exchangeName;

            var factory = new ConnectionFactory() { HostName = _hostname };
            var connection = factory.CreateConnection();
            _channel = connection.CreateModel();
            _channel.ExchangeDeclare(_exchangeName, ExchangeType.Fanout);
        }

        public static UserRabbitMQ UserErrorMQ => _userErrorMQ.Value;
        public static UserRabbitMQ UserActionMQ => _userActionMQ.Value;

        public void SendMessage(string message)
        {
            var body = Encoding.UTF8.GetBytes(message);
            _channel.BasicPublish(_exchangeName, "", null, body);
        }
    }
}
