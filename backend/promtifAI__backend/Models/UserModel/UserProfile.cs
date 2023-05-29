using AutoMapper;
using promtifAI__backend.Models.UserModel.Dto;

namespace promtifAI__backend.Models.UserModel
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserReadDto>();
            CreateMap<UserCreateDto, User>();
            CreateMap<UserDeleteDto, User>();
            CreateMap<UserLoginDto, User>();
            CreateMap<UserChangeDto, User>();
        }
    }
}
