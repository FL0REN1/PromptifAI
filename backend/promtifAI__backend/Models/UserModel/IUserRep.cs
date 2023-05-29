using promtifAI__backend.Models.UserModel.Dto;

namespace promtifAI__backend.Models.UserModel
{
    public interface IUserRep
    {
        bool SaveChanges();

        bool CreateUser(User user);
        bool DeleteUser(int id);
        bool ChangeUser(User user, int id);
        bool ChangeUserPassword(UserLoginDto userLoginDto);
        IEnumerable<User> GetAllUsers();
        User? GetUserByLoginAndPassword(UserLoginDto userLoginDto);
        User? GetUserByLoginPasswordPhone(UserRegisterDto userRegisterDto);
        User? GetUserByLoginAndPhone(UserVerifyCheckDto userVerifyCheckDto);
        User? GetUserByLogin(UserLoginCheckDto userLoginCheckDto);
        User? GetUserByPassword(UserPasswordDto userPasswordDto);
        IEnumerable<User> GetUserByMsgAndRoomIsOnOff(UserMsgRoomIsOnOffDto userMsgRoomIsOnOffDto);
        User? GetUserById(int id);
    }
}
