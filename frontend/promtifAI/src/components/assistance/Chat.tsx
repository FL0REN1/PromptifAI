import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { db } from "./firebase.config";
import '../../css/chat.css'
import '../../media/chat.css'
import { toDate } from 'date-fns';
import AnimatedPage from "./AnimatedPage";
import { changeUser, getUser } from "../../store/reducers/user/userActionCreator";
import { useUserDispatch } from "../../hooks/userHooks";
import { IUserChange } from "../../models/user/IUserChange";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoaderWindow from "./LoaderWindow";

export default function Chat({ room, user, newContainer, closeTheAppeal, whoAreYou, id, openTheAppeal, fetchData, loader }: any) {
    const navigate = useNavigate();
    const dispatch = useUserDispatch();
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<{ text: string; id: string, user: string | null | undefined, createdAt: string }[]>([]);
    const [yesMessage, setYesMesages] = useState(false);
    const messageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(event.target.value)
    }
    const messageRef = collection(db, "messages")
    const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newMessage === "") return;
        await addDoc(messageRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user,
            room
        });
        setNewMessage('');
    };
    useEffect(() => {
        const queryMessages = query(
            messageRef,
            where("room", "==", room),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            const messages: { text: string; id: string; user: string | null | undefined; createdAt: string }[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                const createdAt = toDate(data.createdAt.seconds * 1000);
                const createdAtString = createdAt.toLocaleString();
                const message = { text: data.text, id: doc.id, user: data.user, createdAt: createdAtString };
                messages.push(message);
            });
            setMessages(messages);
            setYesMesages(true);
        });

        return () => unsubscribe();
    }, []);
    const closeApealMsg = "Dear User," +
        "We are pleased to inform you that your appeal has been successfully closed. " +
        "We have carefully reviewed your appeal regarding the error, and we are pleased to confirm that the problem has been fully corrected." +
        "We apologize for any inconvenience caused by this error. " +
        "Your message was valuable to our team, and we thank you for your patience and assistance in resolving the issue." +
        "If you have any more questions or suggestions, feel free to contact us. " +
        "We are always ready to help you and provide you with the best experience using our site." +
        "Once again, thank you for your participation and trust in us." +
        "Best wishes to you," +
        "Support PromtifAI Team";
    const closeTheAppealHandler = async () => {
        dispatch(getUser(id)).then(state => {
            const { isPhoneVerify, phoneNumber, review, reviewStars, firstName, secondName, login, isMailVerify, description, chatBotMessage, chatRoomIsOn, chatTopic, money }: any = state.payload;
            const ChangeUser: IUserChange = {
                Id: id,
                FirstName: firstName,
                SecondName: secondName,
                Login: login,
                PhoneNumber: phoneNumber,
                IsMailVerify: isMailVerify,
                IsPhoneVerify: isPhoneVerify,
                Description: description,
                Review: review,
                ReviewStars: reviewStars,
                Money: money,
                ChatBotMessage: chatBotMessage,
                ChatRoomIsOn: chatRoomIsOn,
                ChatTopic: chatTopic,
                ChatClosedAppeal: true
            }
            dispatch(changeUser(ChangeUser)).then(() => {
                fetchData();
                toast.success('Appeal successfully opened!')
            })
        });
        await addDoc(messageRef, {
            text: closeApealMsg,
            createdAt: serverTimestamp(),
            user,
            room
        });
    }
    const openTheAppealChatMsgHandler = () => {
        dispatch(getUser(id)).then(state => {
            const { isPhoneVerify, phoneNumber, review, reviewStars, firstName, secondName, login, isMailVerify, description, chatBotMessage, chatRoomIsOn, chatTopic, money }: any = state.payload;
            const ChangeUser: IUserChange = {
                Id: id,
                FirstName: firstName,
                SecondName: secondName,
                Login: login,
                PhoneNumber: phoneNumber,
                IsMailVerify: isMailVerify,
                IsPhoneVerify: isPhoneVerify,
                Description: description,
                Review: review,
                ReviewStars: reviewStars,
                Money: money,
                ChatBotMessage: chatBotMessage,
                ChatRoomIsOn: chatRoomIsOn,
                ChatTopic: chatTopic,
                ChatClosedAppeal: false
            }
            dispatch(changeUser(ChangeUser)).then(() => {
                fetchData();
                toast.success('Appeal successfully opened!')
            })
        });
    }
    const goBackHandler = () => {
        navigate(`/main/${id}`)
    }
    return (
        <AnimatedPage>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
            <div className={openTheAppeal || closeTheAppeal ? 'radius' : 'body'}>
                {yesMessage ?
                    <main className={newContainer ? "container logIn-container newContainer flex" : "container logIn-container flex"}>
                        <div className={openTheAppeal || closeTheAppeal ? 'chat-app-update' : 'chat-app'}>
                            <div className="background"></div>
                            <div className="chat-container">
                                <h1 className="room-title">Welcome to: {room}</h1>
                                <div className="message-list">
                                    {messages.map((message) => (
                                        <div className={`message ${message.user === whoAreYou ? 'dialog-initiator' : 'other-user'}`} key={message.id}>
                                            <span className="user">{message.user}</span>
                                            <span className="text">{message.text}</span>
                                            <span className="createdAt">{message.createdAt}</span>
                                        </div>
                                    ))}
                                </div>
                                {!openTheAppeal && closeTheAppeal && <form className="new-message-form" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <input className={newMessage ? "new-message-input new-message-input-active" : "new-message-input"} type="text" placeholder="Type your message here..." value={newMessage} onChange={messageChangeHandler} />
                                        <button className="send-button" type="submit">Send</button>
                                    </div>
                                    <button className="close-appeal-button" type="button" onClick={closeTheAppealHandler}>Close the appeal</button>
                                </form>}
                                {openTheAppeal && !closeTheAppeal && <form className="new-message-form" onSubmit={handleSubmit}>
                                    <button className="open-appeal-button" type="button" onClick={openTheAppealChatMsgHandler}>Open the appeal</button>
                                </form>}
                                {!openTheAppeal && !closeTheAppeal && <div className="flex column">
                                    <div className="flex row">
                                        <input className={newMessage ? "new-message-input new-message-input-active" : "new-message-input"} type="text" placeholder="Type your message here..." value={newMessage} onChange={messageChangeHandler} />
                                        <button className="send-button" type="submit">Send</button>
                                    </div>
                                    <button className="close-appeal-button" type="button" onClick={goBackHandler}>Go back</button>
                                </div>}
                            </div>
                        </div>
                    </main> : loader ? LoaderWindow(loader) : LoaderWindow(false)
                }
            </div>
        </AnimatedPage>
    )
}
