import { useEffect, useState } from "react";
import AnimatedPage from "./assistance/AnimatedPage";
import toast, { Toaster } from 'react-hot-toast';
import { IUserLogin } from "../models/user/IUserLogin";
import { checkLoginUser } from "../store/reducers/user/userActionCreator";
import { useUserDispatch } from "../hooks/userHooks";
import { useNavigate } from "react-router-dom";

export default function SignUpSupportWindow() {
    const dispatch = useUserDispatch();
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
    const generateRandomCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };
    const [code, setCode] = useState<string>(generateRandomCode());
    const handleClick = () => {
        setCode(generateRandomCode());
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleClick();
        const user: IUserLogin = {
            Login: email,
            Password: password
        }
        dispatch(checkLoginUser(user)).then((response) => {
            if (response.payload != 'Request failed with status code 404' && response.payload != 'Network Error') {
                const { id }: any = response.payload;
                navigate(`/chat/support/${id}/${code}`);
            } else {
                toast.error("Error ! Login/Password - haven't exist in our DB");
            }
        });
    }
    const [time, setTime] = useState(getFormattedTime());
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getFormattedTime());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    function getFormattedTime() {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }
    return (
        <AnimatedPage>
            <div className='body'>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
                <main className="container logIn-container flex">
                    <div className='logIn-content flex'>
                        <h1 className='logIn-content__title title-reset'>SUPPORT LOG IN</h1>
                        <div className='logIn-content__underLine flex'>
                            <form className='logIn-content__form flex' onSubmit={handleSubmit}>
                                <input className={email ? 'logIn-content__input input-reset logIn-content__inputActive' : 'logIn-content__input input-reset'} type='text' placeholder='Login' value={email} onChange={handleEmailChange} required />
                                <input className={password ? 'logIn-content__input input-reset logIn-content__inputActive' : 'logIn-content__input input-reset'} type="password" placeholder='Password' value={password} onChange={handlePasswordChange} required />
                                <button className='logIn-content__button button-reset' type='submit'>Log In</button>
                            </form>
                        </div>
                        <div className='logIn-content__under flex'>
                            <p className="logIn-content__paragraph paragraph-reset">{time}</p>
                        </div>
                    </div>
                </main>
            </div>
        </AnimatedPage>
    )
}