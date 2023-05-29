export interface IUserRead {
    id: number;
    firstName: string;
    secondName: string;
    login: string;
    password: string;
    phoneNumber: string;
    description: string;
    review: string;
    reviewStars: number;
    money: number;
    isMailVerify: boolean;
    isPhoneVerify: boolean;
    chatBotMessage: string;
    chatRoomIsOn: boolean;
    chatTopic: string;
    chatClosedAppeal: boolean;
}