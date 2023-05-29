export interface IUserCreate {
    FirstName: string;
    SecondName: string;
    Login: string;
    Password: string;
    PhoneNumber: string;
    Description: string;
    Review: string;
    ReviewStars: number;
    Money: number;
    IsMailVerify: boolean;
    IsPhoneVerify: boolean;
    AvatarUrl: string;
    ChatBotMessage: string;
    ChatRoomIsOn: boolean;
    ChatTopic: string;
    ChatClosedAppeal: boolean;
}