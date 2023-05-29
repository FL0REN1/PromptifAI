import { useState } from "react";
import '../css/resetWindow.css'
import toast, { Toaster } from "react-hot-toast";
import { useUserDispatch, useUserSelector } from "../hooks/userHooks";
import { useNavigate } from "react-router-dom";
import { changeUserPassword, checkLoginResetUser, checkPassowrdResetUser } from "../store/reducers/user/userActionCreator";
import { IUserCheckPassword } from "../models/user/IUserCheckPassword";
import { IUserCheckLogin } from "../models/user/IUserCheckLogin";
import { IUserLogin } from "../models/user/IUserLogin";
import LoaderWindow from "./assistance/LoaderWindow";
import AnimatedPage from "./assistance/AnimatedPage";

export default function ResetWindow() {
    const { IsLoading } = useUserSelector(state => state.UserSlice);
    const dispatch = useUserDispatch();
    const navigate = useNavigate()
    const [password, setPassword] = useState("");
    const [passwordText, setPasswordText] = useState("");
    function handleClick() {
        navigate("/", { replace: true });
    }
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
    const handlePasswordTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordText(event.target.value);
    };
    function validatePassword(password: string): boolean {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,50}$/;
        return passwordRegex.test(password);
    }
    const email = window.location.pathname.split('/')[2];
    const resetPassword = () => {
        if (validatePassword(password)) {
            if (password === passwordText) {
                const passwordCheck: IUserCheckPassword = {
                    Password: password
                }
                dispatch(checkPassowrdResetUser(passwordCheck)).then((response) => {
                    if (response.payload != 'Request failed with status code 404' && response.payload != 'Network Error') {
                        toast.error('Error ! Password already exist in our DB');
                    } else {
                        const emailCheck: IUserCheckLogin = {
                            Login: email
                        }
                        dispatch(checkLoginResetUser(emailCheck)).then((response) => {
                            if (response.payload != 'Request failed with status code 404' && response.payload != 'Network Error') {
                                const passwordChange: IUserLogin = {
                                    Login: email,
                                    Password: password
                                }
                                dispatch(changeUserPassword(passwordChange)).then((response) => {
                                    if (response.payload != 'Request failed with status code 404' && response.payload != 'Network Error') {
                                        handleClick();
                                    } else {
                                        toast.error("Error ! This login doesn't contains in our db");
                                    }
                                });
                            } else {
                                toast.error("Error ! This login doesn't contains in our db");
                            }
                        });
                    }
                });
            }
            else {
                toast.error("Passwords don't match");
            }
        }
        else {
            toast(
                `Brief password requirements:
                \n· 6 to 50 characters long
                \n· Must contain a number
                \n· Must contain one lowercase letter in English
                \n· Mandatory contains one uppercase letter in English
                \n· Must contain one special character from the set !@#$%^&*()_+[]{};':"|,.<>/?`,
                {
                    duration: 6000,
                }
            );
        }
    }
    return (
        <AnimatedPage>
            <div className='body'>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
                {IsLoading ? <LoaderWindow /> :
                    <main className='container signUp-container flex'>
                        <div className="reset-password flex">
                            <h3 className='personalInfo__title personalInfo-card__title title-reset'>Reset password</h3>
                            <input className={password ? 'content-info__input personalInfo__input input-reset activeInput' : 'content-info__input personalInfo__input input-reset'} type="text" placeholder='Password' value={password} onChange={handlePasswordChange} required />
                            <input className={passwordText ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'} type="password" placeholder='Confirm password' value={passwordText} onChange={handlePasswordTextChange} required />
                            <button className='button-reset content-info__button personalInfo-card__btn' onClick={resetPassword} type='button'>Submit</button>
                        </div>
                    </main>
                }
            </div>
        </AnimatedPage>
    )
}