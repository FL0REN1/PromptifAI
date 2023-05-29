import { useNavigate } from 'react-router-dom'
import '../css/logInWindow.css'
import '../media/LogInWindow.css'
import React, { useEffect, useRef, useState } from 'react';
import { useUserDispatch } from '../hooks/userHooks';
import { IUserLogin } from '../models/user/IUserLogin';
import { checkLoginResetUser, checkLoginUser } from '../store/reducers/user/userActionCreator';
import Rodal from 'rodal';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import { IUserCheckLogin } from '../models/user/IUserCheckLogin';
import Cookies from "js-cookie";
import AnimatedPage from './assistance/AnimatedPage';

export default function LogInWindow() {
    const dispatch = useUserDispatch();
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [emailReset, setEmailReset] = useState("");
    const [password, setPassword] = useState("");
    const [visibleLost, setVisibleLost] = useState(false);
    const [emailSendCode, setEmailSendCode] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    useEffect(() => {
        const savedLogin = Cookies.get("login");
        if (savedLogin) {
            setEmail(savedLogin);
            setRememberMe(true);
        }
    }, []);
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
    const showModalLost = () => {
        setVisibleLost(true);
    };
    const hideModalLost = () => {
        setVisibleLost(false);
    };
    const handleEmailResetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailReset(event.target.value);
    };
    const handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    }
    const handleClick = () => {
        setCode(generateRandomCode(emailReset));
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const user: IUserLogin = {
            Login: email,
            Password: password
        }
        dispatch(checkLoginUser(user)).then((response) => {
            if (response.payload != 'Request failed with status code 404' && response.payload != 'Network Error') {
                if (rememberMe) {
                    Cookies.set("login", email, { expires: 7 });
                } else {
                    Cookies.remove("login");
                }
                const { id }: any = response.payload;
                navigate(`/main/${id}`);
            } else {
                toast.error("Error ! Login/Password - haven't exist in our DB");
            }
        });
    }
    const form = useRef<HTMLFormElement>(null);
    const sendEmail = (e: any) => {
        e.preventDefault();
        handleClick();
        const loginReset: IUserCheckLogin = {
            Login: emailReset
        }
        dispatch(checkLoginResetUser(loginReset)).then((response) => {
            if (response.payload != 'Request failed with status code 404' && response.payload != 'Network Error') {
                setEmailSendCode(true);
                if (!form.current) return;
                emailjs.sendForm('service_tod84nt', 'template_hd4q8n8', form.current, 'mhz82Bha4mtLH7PPa')
                    .then(() => {
                        toast.success("OTP sent successfully!");
                    }, (error) => {
                        toast.error(`Error ! ${error.message}`);
                    });
                e.target.reset();
            } else {
                toast.error("Error ! login don't exist in our db");
            }
        });
    };
    const generateRandomCode = (email: string) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        let resetUrl = `http://localhost:5173/reset/${email}/${code}`;
        return resetUrl;
    };
    const generateRandomCode2 = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };
    let randomCode = generateRandomCode2();
    const [code, setCode] = useState<string>('');
    return (
        <AnimatedPage>
            <div className='body'>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
                <main className="container logIn-container flex">
                    <div className='logIn-content flex'>
                        <h1 className='logIn-content__title title-reset'>Log In</h1>
                        <div className='logIn-content__underLine flex'>
                            <form className='logIn-content__form flex' onSubmit={handleSubmit}>
                                <input className={email ? 'logIn-content__input input-reset logIn-content__inputActive' : 'logIn-content__input input-reset'} type="email" placeholder='Email' value={email} onChange={handleEmailChange} required />
                                <input className={password ? 'logIn-content__input input-reset logIn-content__inputActive' : 'logIn-content__input input-reset'} type="password" placeholder='Password' value={password} onChange={handlePasswordChange} required />
                                <button className='logIn-content__button button-reset' type='submit'>Log In</button>
                                <div className='logIn-content__twoItems flex'>
                                    <div className='logIn-content__checkboxAndLabel flex'>
                                        <input className='logIn-content__checkbox input-reset' type="checkbox" id="myCheckbox" name="myCheckbox" checked={rememberMe} onChange={handleRememberMeChange} />
                                        <label className='logIn-content__label' htmlFor="myCheckbox">Remember Me</label>
                                    </div>
                                    <button className='logIn-content__link button-reset' type='button' onClick={() => showModalLost()}>Lost Your password ?</button>
                                    <Rodal visible={visibleLost} onClose={hideModalLost}>
                                        <div className='products__cards personalInfo-card logIn-content-card'>
                                            <form className='personalInfo-card__flex flex' ref={form}>
                                                <h3 className='personalInfo__title personalInfo-card__title title-reset'>Reset password</h3>
                                                <input className={emailReset ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'} type="email" name="user_email" placeholder='Email' value={emailReset} onChange={handleEmailResetChange} required />
                                                <input className='none' type="text" value={code === '' ? `http://localhost:5173/reset/${emailReset}/${randomCode}` : code} name="url_code" />
                                                <button className='button-reset content-info__button personalInfo-card__btn' onClick={sendEmail} type='button'>{emailSendCode ? <>Resend code</> : <>Send code</>}</button>
                                            </form>
                                        </div>
                                    </Rodal>
                                </div>
                            </form>
                        </div>
                        <div className='logIn-content__under flex'>
                            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M28.5546 30.4165L24.8188 26.6807H3.9131V23.1335C3.9131 22.1775 4.15209 21.3599 4.63008 20.6807C5.10806 20.0014 5.72442 19.4857 6.47913 19.1335C7.98857 18.4542 9.4414 17.9259 10.8376 17.5486C12.2339 17.1712 13.6364 16.9574 15.0452 16.9071L0.177246 2.03915L1.79989 0.416504L30.1772 28.7939L28.5546 30.4165ZM6.17725 24.4165H22.5546L17.3093 19.1712C17.1081 19.1461 16.8942 19.1335 16.6678 19.1335H15.9886C14.5546 19.1335 13.1584 19.2781 11.7999 19.5674C10.4414 19.8568 8.9697 20.3913 7.38479 21.1712C7.03259 21.3473 6.74328 21.6178 6.51687 21.9825C6.29045 22.3473 6.17725 22.731 6.17725 23.1335V24.4165ZM25.4603 19.1335C26.2401 19.4857 26.8691 20.0014 27.3471 20.6807C27.825 21.3599 28.064 22.1775 28.064 23.1335V23.4354L22.6678 18.0391C23.1206 18.1901 23.5798 18.3599 24.0452 18.5486C24.5106 18.7373 24.9823 18.9322 25.4603 19.1335ZM18.6301 14.0014L16.8188 12.1901C17.5735 12.014 18.1898 11.6241 18.6678 11.0203C19.1458 10.4165 19.3848 9.7121 19.3848 8.90707C19.3848 7.9511 19.0577 7.14606 18.4037 6.49198C17.7496 5.83789 16.9445 5.51084 15.9886 5.51084C15.1835 5.51084 14.4791 5.74984 13.8754 6.22782C13.2716 6.70581 12.8816 7.32216 12.7055 8.07688L10.8942 6.26556C11.3722 5.30959 12.0703 4.56745 12.9886 4.03915C13.9068 3.51084 14.9068 3.24669 15.9886 3.24669C17.5735 3.24669 18.9131 3.79386 20.0074 4.8882C21.1018 5.98254 21.6489 7.32216 21.6489 8.90707C21.6489 9.98883 21.3848 10.9888 20.8565 11.9071C20.3282 12.8253 19.5861 13.5234 18.6301 14.0014Z" fill="black" />
                            </svg>
                            <p className='logIn-content__paragraph paragraph-reset'>Not a member ?</p>
                            <a className='logIn-content__link link-reset' onClick={() => navigate('/signUp')} tabIndex={0}>Sign up now</a>
                        </div>
                    </div>
                </main>
            </div>
        </AnimatedPage>
    )
}