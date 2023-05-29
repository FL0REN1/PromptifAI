import { useEffect, useState } from "react";
import Chat from "./assistance/Chat";
import { useUserDispatch } from "../hooks/userHooks";
import { getUser } from "../store/reducers/user/userActionCreator";
import LoaderWindow from "./assistance/LoaderWindow";

export default function UserChatWindow() {
    const dispatch = useUserDispatch();
    const id = window.location.pathname.split('/')[3];
    const roomName = `room ${id}`;
    const [fullName, setFullName] = useState('');
    useEffect(() => {
        const parsedID = parseInt(id);
        dispatch(getUser(parsedID)).then(state => {
            const { firstName, secondName }: any = state.payload;
            setFullName(`${firstName} ${secondName}`)
        })
    }, [fullName])

    return (
        <div>
            {fullName ? <Chat room={roomName} user={fullName} newContainer={false} closeTheAppeal={false} whoAreYou={fullName} id={id} loader={false} /> : <LoaderWindow />}
        </div>
    )
}