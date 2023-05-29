using promtifAI__backend.Models.UserModel.Dto;

namespace promtifAI__backend.Models.UserModel
{
    public class UserRep : IUserRep
    {
        #region [DATA]

        private readonly UserContext _context;
        private readonly IWebHostEnvironment _env;

        #endregion

        /// <summary>
        /// [USER_REP CONSTRUCTOR]
        /// </summary>
        /// <param name="context"></param>
        public UserRep(UserContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        /// <summary>
        /// [CHANGE_USER]
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool ChangeUser(User user, int id)
        {
            User? userModel = _context.Users.FirstOrDefault(m => m.Id == id);
            if (userModel == null)
            {
                string message = "[X] Failed to change user because it is empty";
                UserRabbitMQ.UserErrorMQ.SendMessage(message);
                return false;
            }
            userModel.FirstName = user.FirstName;
            userModel.SecondName = user.SecondName;
            userModel.Login = user.Login;
            userModel.PhoneNumber = user.PhoneNumber;
            userModel.Description = user.Description;
            userModel.Review = user.Review;
            userModel.ReviewStars = user.ReviewStars;
            userModel.Money = user.Money;
            userModel.ChatBotMessage = user.ChatBotMessage;
            userModel.ChatRoomIsOn = user.ChatRoomIsOn;
            userModel.ChatTopic = user.ChatTopic;
            userModel.ChatClosedAppeal = user.ChatClosedAppeal;

            return true;
        }

        /// <summary>
        /// [CHANGE_USER_PASSWORD]
        /// </summary>
        /// <param name="password"></param>
        /// <param name="login"></param>
        /// <returns></returns>
        public bool ChangeUserPassword(UserLoginDto userLoginDto)
        {
            User? userModel = _context.Users.FirstOrDefault(m => m.Login == userLoginDto.Login);
            if (userModel == null)
            {
                string message = "[X] Failed to change user because it is empty";
                UserRabbitMQ.UserErrorMQ.SendMessage(message);
                return false;
            }
            userModel.Password = userLoginDto.Password;
            return true;
        }

        /// <summary>
        /// [CREATE_USER]
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public bool CreateUser(User user)
        {
            if (user == null)
            {
                string message = "[X] Failed to create user because it is empty";
                UserRabbitMQ.UserErrorMQ.SendMessage(message);
                return false;
            }
            _context.Users.Add(user);
            return true;
        }

        /// <summary>
        /// [DELETE_USER]
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool DeleteUser(int id)
        {
            User? user = _context.Users.FirstOrDefault(m => m.Id == id);
            if (user == null)
            {
                string message = "[X] Failed to delete user because it is empty";
                UserRabbitMQ.UserErrorMQ.SendMessage(message);
                return false;
            }
            _context.Users.Remove(user);
            return true;
        }

        /// <summary>
        /// [GET_ALL_USERS]
        /// </summary>
        /// <returns></returns>
        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        /// <summary>
        /// [GET_USER_BY_ID]
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public User? GetUserById(int id)
        {
            User? IdUser = _context.Users.FirstOrDefault(x => x.Id == id);
            if (IdUser == null)
            {
                string message = $"[X] DB: [User], has no ID: [{id}]";
                UserRabbitMQ.UserErrorMQ.SendMessage(message);
                return null;
            }
            return IdUser;
        }

        /// <summary>
        /// [GET_USER_BY_LOGIN_AND_PASSWORD]
        /// </summary>
        /// <param name="userLoginDto"></param>
        /// <exception cref="ArgumentNullException"></exception>
        public User? GetUserByLoginAndPassword(UserLoginDto userLoginDto)
        {
            User? user = _context.Users.FirstOrDefault(i => i.Login == userLoginDto.Login && i.Password == userLoginDto.Password);
            if (user == null)
            {
                string message = $"[X] Failed to found user login: [{userLoginDto.Login}], and password: [{userLoginDto.Password}]";
                UserRabbitMQ.UserErrorMQ.SendMessage(message);
                return null;
            }
            return user;
        }

        /// <summary>
        /// [GET_USER_BY_LOGIN_PASSWORD_PHONE]
        /// </summary>
        /// <param name="userRegisterDto"></param>
        /// <returns></returns>
        public User? GetUserByLoginPasswordPhone(UserRegisterDto userRegisterDto)
        {
            User? user = _context.Users.FirstOrDefault(i => i.Login == userRegisterDto.Login || i.Password == userRegisterDto.Password || i.PhoneNumber == userRegisterDto.PhoneNumber);
            if (user == null)
            {
                string message = $"[X] Failed to found user login: [{userRegisterDto.Login}], and password: [{userRegisterDto.Password}] , and phone: [{userRegisterDto.PhoneNumber}]";
                UserRabbitMQ.UserErrorMQ.SendMessage(message);
                return null;
            }
            return user;
        }

        /// <summary>
        /// [GET_USER_BY_LOGIN_PHONE]
        /// </summary>
        /// <param name="userVerifyCheckDto"></param>
        /// <returns></returns>
        public User? GetUserByLoginAndPhone(UserVerifyCheckDto userVerifyCheckDto)
        {
            User? user = _context.Users.FirstOrDefault(i => i.Login == userVerifyCheckDto.Login || i.PhoneNumber == userVerifyCheckDto.PhoneNumber);
            if (user == null)
            {
                string message = $"[X] Failed to found user login: [{userVerifyCheckDto.Login}], and phone: [{userVerifyCheckDto.PhoneNumber}]";
                UserRabbitMQ.UserErrorMQ.SendMessage(message);
                return null;
            }
            return user;
        }

        /// <summary>
        /// [GET_USER_BY_LOGIN]
        /// </summary>
        /// <param name="userLoginCheckDto"></param>
        /// <returns></returns>
        public User? GetUserByLogin(UserLoginCheckDto userLoginCheckDto)
        {
            User? user = _context.Users.FirstOrDefault(i => i.Login == userLoginCheckDto.Login);
            if (user == null)
            {
                string message = $"[X] Failed to found user login: [{userLoginCheckDto.Login}]";
                UserRabbitMQ.UserErrorMQ.SendMessage(message);
                return null;
            }
            return user;
        }

        /// <summary>
        /// [GET_USER_BY_PASSWORD]
        /// </summary>
        /// <param name="userPasswordDto"></param>
        /// <returns></returns>
        public User? GetUserByPassword(UserPasswordDto userPasswordDto)
        {
            User? user = _context.Users.FirstOrDefault(i => i.Password == userPasswordDto.Password);
            if (user == null)
            {
                string message = $"[X] Failed to found user password: [{userPasswordDto.Password}]";
                UserRabbitMQ.UserErrorMQ.SendMessage(message);
                return null;
            }
            return user;
        }

        /// <summary>
        /// [GET_USER_BY_MSG_AND_ROOM_IS_ON_OFF]
        /// </summary>
        /// <param name="userMsgRoomIsOnDto"></param>
        /// <returns></returns>
        public IEnumerable<User> GetUserByMsgAndRoomIsOnOff(UserMsgRoomIsOnOffDto userMsgRoomIsOnOffDto)
        {
            List<User> users = _context.Users.Where(i => i.ChatRoomIsOn == userMsgRoomIsOnOffDto.ChatRoomIsOn).ToList();
            if (users.Count == 0)
            {
                string message = $"[X] Failed to find users with msg and room: [{userMsgRoomIsOnOffDto.ChatRoomIsOn}]";
                UserRabbitMQ.UserErrorMQ.SendMessage(message);
                return null;
            }
            return users;
        }

        /// <summary>
        /// [SAVE_CHANGES]
        /// </summary>
        /// <returns></returns>
        public bool SaveChanges()
        {
            return _context.SaveChanges() > 0;
        }
    }
}
