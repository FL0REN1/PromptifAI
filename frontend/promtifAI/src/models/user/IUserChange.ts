export interface IUserChange {
    Id: number;
    FirstName: string;
    SecondName: string;
    Login: string;
    PhoneNumber: string;
    IsMailVerify: boolean;
    IsPhoneVerify: boolean;
    Description: string;
    Review: string;
    ReviewStars: number;
    Money: number;
    ChatBotMessage: string;
    ChatRoomIsOn: boolean;
    ChatTopic: string;
    ChatClosedAppeal: boolean;
}