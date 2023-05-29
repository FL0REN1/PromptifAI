import { useParams } from "react-router-dom";
import ErrorWindow from "./assistance/ErrorWindow";
import AnimatedPage from "./assistance/AnimatedPage";
import '../css/supportChatWindow.css'
import { useEffect, useState } from "react";
import { IUserRead } from "../models/user/IUserRead";
import { CheckUserMsgAndRoomIsOnOff, deleteUser } from "../store/reducers/user/userActionCreator";
import { useUserDispatch } from "../hooks/userHooks";
import { IUserMsgAndRoomIsOnOff } from "../models/user/IUserMsgAndRoomIsOnOff";
import Chat from "./assistance/Chat";
import { IUserDelete } from "../models/user/IUserDelete";
import { Toaster, toast } from "react-hot-toast";

export default function SupportChatWindow() {
  const dispatch = useUserDispatch();
  const { token } = useParams();
  if (!token || token.length < 10 || token.length > 10) {
    return <ErrorWindow />;
  }
  const [usersRoomTrue, setUsersRoomTrue] = useState<IUserRead[]>([]);
  const [usersReplPurchaseTrue, setUsersReplPurchaseTrue] = useState<IUserRead[]>([]);
  const [usersAccountTrue, setUsersAccountTrue] = useState<IUserRead[]>([]);
  const [usersBugstOnTheSiteTrue, setUsersBugsOnTheSiteTrue] = useState<IUserRead[]>([]);
  const [usersRoomFalse, setUsersRoomFalse] = useState<IUserRead[]>([]);
  const [usersReplPurchaseFalse, setUsersReplPurchaseFalse] = useState<IUserRead[]>([]);
  const [usersAccountFalse, setUsersAccountFalse] = useState<IUserRead[]>([]);
  const [usersBugstOnTheSiteFalse, setUsersBugsOnTheSiteFalse] = useState<IUserRead[]>([]);
  const [closedAppealsFalse, setClosedAppealsFalse] = useState<IUserRead[]>([]);
  const fetchData = async () => {
    const checkUserMsgAndRoomIsOn: IUserMsgAndRoomIsOnOff = {
      ChatRoomIsOn: true
    };
    dispatch(CheckUserMsgAndRoomIsOnOff(checkUserMsgAndRoomIsOn)).then(state => {
      const payload = state.payload as IUserRead[];
      setUsersRoomTrue(payload);
    });
    const checkUserMsgWithoutRoomIsOn: IUserMsgAndRoomIsOnOff = {
      ChatRoomIsOn: false
    };
    dispatch(CheckUserMsgAndRoomIsOnOff(checkUserMsgWithoutRoomIsOn)).then(
      state => {
        const payload = state.payload as IUserRead[];
        setUsersRoomFalse(payload);
      }
    );
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const problemsWithReplenishmentPurchase = usersRoomTrue.filter(
      (user) => user.chatTopic === "Problems with replenishment/purchase" && !user.chatClosedAppeal
    );
    const problemsWithAccount = usersRoomTrue.filter(
      (user) => user.chatTopic === "Problems with the account" && !user.chatClosedAppeal
    );
    const bugsOnTheSite = usersRoomTrue.filter(
      (user) => user.chatTopic === "I found bugs on the site" && !user.chatClosedAppeal
    );
    const closedAppeals = usersRoomTrue.filter(
      (user) => user.chatClosedAppeal
    );
    setUsersReplPurchaseTrue(problemsWithReplenishmentPurchase);
    setUsersAccountTrue(problemsWithAccount);
    setUsersBugsOnTheSiteTrue(bugsOnTheSite);
    setClosedAppealsFalse(closedAppeals);
  }, [usersRoomTrue])
  useEffect(() => {
    const problemsWithReplenishmentPurchase = usersRoomFalse.filter(
      (user) => user.chatTopic === "Problems with replenishment/purchase"
    );
    const problemsWithAccount = usersRoomFalse.filter(
      (user) => user.chatTopic === "Problems with the account"
    );
    const bugsOnTheSite = usersRoomFalse.filter(
      (user) => user.chatTopic === "I found bugs on the site"
    );
    setUsersReplPurchaseFalse(problemsWithReplenishmentPurchase);
    setUsersAccountFalse(problemsWithAccount);
    setUsersBugsOnTheSiteFalse(bugsOnTheSite);
  }, [usersRoomFalse])
  const [chatRoom, setChatRoom] = useState<{ room: string; user: string; id: number } | null>(
    null
  );
  const [chatMsg, setChatMsg] = useState<{ user: string; message: string; id: number; } | null>(null);
  const [chatMsgClosed, setChatMsgClosed] = useState<{ user: string; id: number; room: string } | null>(null);
  const userListItemLeftClick = (user: IUserRead) => {
    const roomName = `room ${user.id}`;
    const fullName = `Support`;
    const id = user.id;
    if (chatRoom && chatRoom.room === roomName) {
      return;
    }
    setChatRoom({ room: roomName, user: fullName, id });
    setClickForClassname(true);
  };
  const userListItemRightClick = (user: IUserRead) => {
    const fullName = `${user.firstName} ${user.secondName}`;
    const message = `${user.chatBotMessage}`;
    const id = user.id;
    setChatMsg({ user: fullName, message, id });
    setClickForClassname(true);
  };
  const userListItemLeftClosedAppealsClick = (user: IUserRead) => {
    const fullName = `${user.firstName} ${user.secondName}`;
    const id = user.id;
    const roomName = `room ${user.id}`;
    setChatMsgClosed({ user: fullName, id, room: roomName });
  };
  const [msgWithRoom, setMsgWithRoom] = useState(false);
  const [msgWithoutRoom, setMsgWithoutRoom] = useState(false);
  const [closedAppealsRoom, setClosedAppealsRoom] = useState(false);
  const [replPurchaseMsgWRoom, setReplPurchaseMsgWRoom] = useState(true);
  const [accountMsgWRoom, setAccountMsgWRoom] = useState(false);
  const [bugsOnTheSiteMsgWRoom, setBugsOnTheSiteMsgWRoom] = useState(false);
  const replPurchaseMsgWRoomHandler = () => {
    setReplPurchaseMsgWRoom(true);
    setAccountMsgWRoom(false);
    setBugsOnTheSiteMsgWRoom(false);
    setClosedAppealsRoom(false);
    setClickForClassname(false);
    setChatRoom(null);
    setChatMsg(null);
    setChatMsgClosed(null);
  }
  const accountMsgWRoomHandler = () => {
    setReplPurchaseMsgWRoom(false);
    setAccountMsgWRoom(true);
    setBugsOnTheSiteMsgWRoom(false);
    setClosedAppealsRoom(false);
    setClickForClassname(false);
    setChatRoom(null);
    setChatMsg(null);
    setChatMsgClosed(null);
  }
  const bugsOnTheSiteMsgWRoomHandler = () => {
    setReplPurchaseMsgWRoom(false);
    setAccountMsgWRoom(false);
    setBugsOnTheSiteMsgWRoom(true);
    setClosedAppealsRoom(false);
    setClickForClassname(false);
    setChatRoom(null);
    setChatMsg(null);
    setChatMsgClosed(null);
  }
  const closedAppealsRoomHandler = () => {
    setReplPurchaseMsgWRoom(false);
    setAccountMsgWRoom(false);
    setBugsOnTheSiteMsgWRoom(false);
    setClosedAppealsRoom(true);
    setClickForClassname(false);
    setChatRoom(null);
    setChatMsg(null);
    setChatMsgClosed(null);
  }
  const goBackHandler = () => {
    setMsgWithRoom(false);
    setMsgWithoutRoom(false);
    setClickForClassname(false);
  }
  const closeTheAppealChatMsgHandler = (id: number) => {
    fetchData();
    const userDelete: IUserDelete = {
      Id: id
    }
    dispatch(deleteUser(userDelete)).then(() => {
      toast.success('Appeal successfully closed!')
    })
  }
  const [clickForClassname, setClickForClassname] = useState(false);
  return (
    <AnimatedPage>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <body className="body changeBody">
        {msgWithRoom == false && msgWithoutRoom == false &&
          <main className="container logIn-container flex">
            <div className="flex criteria-btns">
              <h1 className="title-reset title-msg-section">Choose your criteria</h1>
              <button className="logIn-content__button button-reset criteria-btn" onClick={() => { setMsgWithRoom(true); replPurchaseMsgWRoomHandler() }}>Msg with room</button>
              <button className="logIn-content__button button-reset criteria-btn" onClick={() => { setMsgWithoutRoom(true); replPurchaseMsgWRoomHandler() }}>Msg without room</button>
            </div>
          </main>}
        {msgWithRoom &&
          <main className={clickForClassname ? "container logIn-container chatContainer updateContainer flex" : "container logIn-container column flex"}>
            <h2 className="title-reset title-msg-section">Choose your topic</h2>
            <div className="topic-msg-section flex">
              <button className={replPurchaseMsgWRoom ? "logIn-content__button button-reset criteria-btn active-btn" : "logIn-content__button button-reset criteria-btn"} onClick={() => replPurchaseMsgWRoomHandler()}>Replenishment/Purchase</button>
              <button className={accountMsgWRoom ? "logIn-content__button button-reset criteria-btn active-btn" : "logIn-content__button button-reset criteria-btn"} onClick={() => accountMsgWRoomHandler()}>The account</button>
              <button className={bugsOnTheSiteMsgWRoom ? "logIn-content__button button-reset criteria-btn active-btn" : "logIn-content__button button-reset criteria-btn"} onClick={() => bugsOnTheSiteMsgWRoomHandler()}>Bugs on the site</button>
              <button className={closedAppealsRoom ? "logIn-content__button button-reset criteria-btn active-btn" : "logIn-content__button button-reset criteria-btn"} onClick={() => closedAppealsRoomHandler()}>Closed appeals</button>
              <button className="logIn-content__button button-reset criteria-btn" onClick={() => goBackHandler()}>Go back</button>
            </div>
            {closedAppealsRoom && <div className="flex">
              <div className={usersRoomFalse.length > 0 ? "user-list leftSection" : "user-list paddingNone leftSection"} >
                <ul className="user-list__items">
                  {closedAppealsRoom ? closedAppealsFalse.length > 0 ? closedAppealsFalse.map((user, index) => (
                    <li
                      className="user-list__item"
                      key={index}
                      onClick={() => userListItemLeftClosedAppealsClick(user)}
                    >
                      |{user.id}| {user.firstName} {user.secondName}
                    </li>
                  )) :
                    <li
                      className="user-list__item"
                    >
                      No users yet
                    </li> : null}
                </ul>
              </div>
              {chatMsgClosed ? (
                <Chat
                  key={chatMsgClosed.room}
                  room={chatMsgClosed.room}
                  user={chatMsgClosed.user}
                  newContainer={true}
                  closeTheAppeal={false}
                  openTheAppeal={true}
                  loader={true}
                  fetchData={fetchData}
                  id={chatMsgClosed.id}
                  whoAreYou='Support'
                />
              ) : <main className="container logIn-container chatContainer newContainer flex">
                <div className="chat-app">
                  <div className="background"></div>
                  <div className="chat-container">
                    <div className="message-list msg-list-update">
                      <h2 className="room-title">Choose a chat room</h2>
                    </div>
                  </div>
                </div>
              </main>}
            </div>}
            {closedAppealsRoom === false && <div className="flex">
              <div className={usersRoomTrue.length > 0 ? "user-list leftSection" : "user-list paddingNone leftSection"} >
                <ul className="user-list__items">
                  {replPurchaseMsgWRoom ? usersReplPurchaseTrue.length > 0 ? usersReplPurchaseTrue.map((user, index) => (
                    <li
                      className="user-list__item"
                      key={index}
                      onClick={() => userListItemLeftClick(user)}
                    >
                      |{user.id}| {user.firstName} {user.secondName}
                    </li>
                  )) :
                    <li
                      className="user-list__item"
                    >
                      No users yet
                    </li> : null}
                  {accountMsgWRoom ? usersAccountTrue.length > 0 ? usersAccountTrue.map((user, index) => (
                    <li
                      className="user-list__item"
                      key={index}
                      onClick={() => userListItemLeftClick(user)}
                    >
                      |{user.id}| {user.firstName} {user.secondName}
                    </li>
                  )) :
                    <li
                      className="user-list__item"
                    >
                      No users yet
                    </li> : null}
                  {bugsOnTheSiteMsgWRoom ? usersBugstOnTheSiteTrue.length > 0 ? usersBugstOnTheSiteTrue.map((user, index) => (
                    <li
                      className="user-list__item"
                      key={index}
                      onClick={() => userListItemLeftClick(user)}
                    >
                      |{user.id}| {user.firstName} {user.secondName}
                    </li>
                  )) :
                    <li
                      className="user-list__item"
                    >
                      No users yet
                    </li> : null}
                </ul>
              </div>
              {chatRoom ? (
                <Chat
                  key={chatRoom.room}
                  room={chatRoom.room}
                  user={chatRoom.user}
                  newContainer={true}
                  closeTheAppeal={true}
                  loader={true}
                  fetchData={fetchData}
                  id={chatRoom.id}
                  whoAreYou='Support'
                />
              ) : <main className="container logIn-container chatContainer newContainer flex">
                <div className="chat-app">
                  <div className="background"></div>
                  <div className="chat-container">
                    <div className="message-list">
                      <h2 className="room-title">Choose a chat room</h2>
                    </div>
                  </div>
                </div>
              </main>}
            </div>}
          </main>
        }
        {msgWithoutRoom &&
          <main className={clickForClassname ? "container logIn-container column flex" : "container logIn-container column flex"}>
            <h2 className="title-reset title-msg-section">Choose your topic</h2>
            <div className="topic-msg-section flex">
              <button className={replPurchaseMsgWRoom ? "logIn-content__button button-reset criteria-btn active-btn" : "logIn-content__button button-reset criteria-btn"} onClick={() => replPurchaseMsgWRoomHandler()}>Replenishment/Purchase</button>
              <button className={accountMsgWRoom ? "logIn-content__button button-reset criteria-btn active-btn" : "logIn-content__button button-reset criteria-btn"} onClick={() => accountMsgWRoomHandler()}>The account</button>
              <button className={bugsOnTheSiteMsgWRoom ? "logIn-content__button button-reset criteria-btn active-btn" : "logIn-content__button button-reset criteria-btn"} onClick={() => bugsOnTheSiteMsgWRoomHandler()}>Bugs on the site</button>
              <button className="logIn-content__button button-reset criteria-btn" onClick={() => goBackHandler()}>Go back</button>
            </div>
            {closedAppealsRoom === false && <div className="flex">
              <div className={usersRoomFalse.length > 0 ? "user-list leftSection" : "user-list paddingNone leftSection"} >
                <ul className="user-list__items">
                  {replPurchaseMsgWRoom ? usersReplPurchaseFalse.length > 0 ? usersReplPurchaseFalse.map((user, index) => (
                    <li
                      className="user-list__item"
                      key={index}
                      onClick={() => userListItemRightClick(user)}
                    >
                      |{user.id}| {user.firstName} {user.secondName}
                    </li>
                  )) :
                    <li
                      className="user-list__item"
                    >
                      No users yet
                    </li> : null}
                  {accountMsgWRoom ? usersAccountFalse.length > 0 ? usersAccountFalse.map((user, index) => (
                    <li
                      className="user-list__item"
                      key={index}
                      onClick={() => userListItemRightClick(user)}
                    >
                      |{user.id}| {user.firstName} {user.secondName}
                    </li>
                  )) :
                    <li
                      className="user-list__item"
                    >
                      No users yet
                    </li> : null}
                  {bugsOnTheSiteMsgWRoom ? usersBugstOnTheSiteFalse.length > 0 ? usersBugstOnTheSiteFalse.map((user, index) => (
                    <li
                      className="user-list__item"
                      key={index}
                      onClick={() => userListItemRightClick(user)}
                    >
                      |{user.id}| {user.firstName} {user.secondName}
                    </li>
                  )) :
                    <li
                      className="user-list__item"
                    >
                      No users yet
                    </li> : null}
                </ul>
              </div>
              {chatMsg ? (
                <main className="container logIn-container chatContainer newContainer flex">
                  <div className="chat-app">
                    <div className="background"></div>
                    <div className="chat-container">
                      <div className="message-list msg-list-update">
                        <h2 className="room-title room-title-update">{chatMsg.message}</h2>
                        <p className="paragraph-reset room-paragraph-update">{chatMsg.user}</p>
                        <button className="close-appeal-button room-button-update" type="button" onClick={() => closeTheAppealChatMsgHandler(chatMsg.id)}>Close the appeal</button>
                      </div>
                    </div>
                  </div>
                </main>
              ) : <main className="container logIn-container chatContainer newContainer flex">
                <div className="chat-app">
                  <div className="background"></div>
                  <div className="chat-container">
                    <div className="message-list msg-list-update">
                      <h2 className="room-title">Choose a user</h2>
                    </div>
                  </div>
                </div>
              </main>}
            </div>}
          </main>
        }
      </body>
    </AnimatedPage>
  );
}