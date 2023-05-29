import { useRef, useState } from 'react';
import '../css/signUpWindow.css'
import '../media/signUpWindow.css'
import { useNavigate } from 'react-router-dom';
import { useUserDispatch } from '../hooks/userHooks';
import { checkVerifyUser, checkLoginUser, createUser } from '../store/reducers/user/userActionCreator';
import { IUserCreate } from '../models/user/IUserCreate';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { IUserRegister } from '../models/user/IUserRegister';
import Rodal from 'rodal';
import emailjs from '@emailjs/browser';
import React from 'react';
import OtpInput from 'react-otp-input';
import { auth } from './assistance/firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { toast, Toaster } from "react-hot-toast";
import { IUserVerify } from '../models/user/IUserVerify';
import AnimatedPage from './assistance/AnimatedPage';

declare global {
    interface Window {
        recaptchaVerifier: any;
        confirmationResult: any;
    }
}
export default function SignUpWindow() {
    const dispatch = useUserDispatch();
    const navigate = useNavigate()
    const [visibleEmail, setVisibleEmail] = useState(false);
    const showModalEmail = () => {
        setVisibleEmail(true);
    };
    const hideModalEmail = () => {
        setVisibleEmail(false);
    };
    const [visiblePhone, setVisiblePhone] = useState(false);
    const showModalPhone = () => {
        setVisiblePhone(true);
    };
    const hideModalPhone = () => {
        setVisiblePhone(false);
    };
    const [emailSendCode, setEmailSendCode] = useState(false);
    const [phoneSendCode, setPhoneSendCode] = useState(false);
    const [fName, setFName] = useState("");
    const [sName, setSName] = useState("");
    const [email, setEmail] = useState("");
    const [passwordText, setPasswordText] = useState("");
    const [password, setPassword] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailCode, setEmailCode] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const handleFNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFName(event.target.value);
    };
    const handleSNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSName(event.target.value);
    };
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = event.target.value;
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setEmail(emailValue);
        setIsValidEmail(emailRegex.test(emailValue));
    };
    const handlePasswordTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordText(event.target.value);
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
    };
    function onSignup() {
        const userCheck: IUserVerify = {
            PhoneNumber: phoneNumber,
            Login: email,
        }
        dispatch(checkVerifyUser(userCheck)).then((response) => {
            if (response.payload != 'Request failed with status code 404' && response.payload != 'Network Error') {
                toast.error("Error ! login or phone already exist in our db");
            } else {
                onCaptchVerify();
                const appVerifier = window.recaptchaVerifier;
                const formatPh = "+" + phoneNumber;
                signInWithPhoneNumber(auth, formatPh, appVerifier)
                    .then((confirmationResult) => {
                        window.confirmationResult = confirmationResult;
                        setPhoneSendCode(true);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    }
    function onCaptchVerify() {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: () => {
                        toast.success("OTP sent successfully!");
                        onSignup();
                    },
                    "expired-callback": () => { },
                },
                auth
            );
        }
    }
    function onOTPVerify() {
        window.confirmationResult
            .confirm(phoneCode)
            .then(async () => {
                setIsNumberVerified(true);
                toast.success("Congratulations! You have been verified by phone number!");
            })
            .catch((err: any) => {
                console.log(err);
                toast.error("Error ! Incorrect verification code");
            });
    }
    const [step, setStep] = useState(1);
    const [isMailVerified, setIsMailVerified] = useState(false);
    const [isNumberVerified, setIsNumberVerified] = useState(false);
    const form = useRef<HTMLFormElement>(null);
    const sendEmail = (e: any) => {
        const userCheck: IUserVerify = {
            PhoneNumber: phoneNumber,
            Login: email,
        }
        dispatch(checkVerifyUser(userCheck)).then((response) => {
            if (response.payload != 'Request failed with status code 404' && response.payload != 'Network Error') {
                toast.error("Error ! login or phone already exist in our db");
            } else {
                e.preventDefault();
                setEmailSendCode(true);
                if (!form.current) return;
                emailjs.sendForm('service_tod84nt', 'template_72oracu', form.current, 'mhz82Bha4mtLH7PPa')
                    .then(() => {
                        toast.success("OTP sent successfully!");
                    }, (error) => {
                        toast.error(`Error ! ${error.message}`);
                    });
                e.target.reset();
                handleClick();
            }
        });
    };
    const generateRandomCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
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
        switch (step) {
            case 1:
                setStep(2);
                break;
            case 2:
                if (isValid) {
                    if (isValidEmail) {
                        setStep(3);
                    } else {
                        toast.error("Please enter a valid email address.");
                    }
                } else {
                    toast.error("Error ! Incorrect phone number");
                }
                break
        }
    }
    function validatePassword(password: string): boolean {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,50}$/;
        return passwordRegex.test(password);
    }
    const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validatePassword(password)) {
            if (password === passwordText) {
                if (isMailVerified || isNumberVerified) {
                    const userCheck: IUserRegister = {
                        PhoneNumber: phoneNumber,
                        Login: email,
                        Password: password
                    }
                    const user: IUserCreate = {
                        FirstName: fName,
                        SecondName: sName,
                        Login: email,
                        PhoneNumber: phoneNumber,
                        Password: password,
                        Description: '...',
                        Money: 0,
                        IsMailVerify: isMailVerified,
                        IsPhoneVerify: isNumberVerified,
                        AvatarUrl: '...',
                        Review: '...',
                        ReviewStars: 0,
                        ChatBotMessage: '...',
                        ChatRoomIsOn: false,
                        ChatTopic: '...',
                        ChatClosedAppeal: false
                    }
                    dispatch(checkLoginUser(userCheck)).then((response) => {
                        if (response.payload != 'Request failed with status code 404' && response.payload != 'Network Error') {
                            toast.error('Login/Password/Phone - already exist in our DB');
                            console.log(response.payload);

                        } else {
                            console.log(user);

                            dispatch(createUser(user));
                            navigate('/')
                        }
                    });
                } else {
                    toast.error("Error ! Go through at least 1 verification methods.");
                }
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
                <main className='container signUp-container flex'>
                    <div className='signUp-container__content'>
                        <Toaster
                            position="bottom-right"
                            reverseOrder={false}
                        />
                        <ul className='signUp-container__list list-reset flex'>
                            <li className="elipse signUp-container__item">
                                <div className={step == 1 ? 'elipse__image signUp-container__elipse activeCircle flex' : 'elipse__image signUp-container__elipse flex'}>1</div>
                                <p className='signUp-container__paragraph paragraph-reset'>Personal</p>
                            </li>
                            <li className="elipse signUp-container__item">
                                <div className={step == 2 ? 'elipse__image signUp-container__elipse activeCircle flex' : 'elipse__image signUp-container__elipse flex'}>2</div>
                                <p className='signUp-container__paragraph paragraph-reset'>Contact</p>
                            </li>
                            <li className="elipse signUp-container__item">
                                <div className={step == 3 ? 'elipse__image signUp-container__elipse activeCircle flex' : 'elipse__image signUp-container__elipse flex'}>3</div>
                                <p className='signUp-container__paragraph paragraph-reset'>Security</p>
                            </li>
                        </ul>
                        {step == 1 &&
                            <section className='personalInfo signUp-container__underLine signUp-container__personalInfo flex'>
                                <div className='personalInfo__infoTitleImage flex'>
                                    <svg className='personalInfo__svg' width="45" height="31" viewBox="0 0 45 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='personalInfo__path' d="M32.8125 15.3333H34.6875V12.2083L37.7344 13.75L38.6719 12.3333L35.625 10.75L38.6719 9.16667L37.7344 7.75L34.6875 9.29167V6.16667H32.8125V9.29167L29.7656 7.75L28.8281 9.16667L31.875 10.75L28.8281 12.3333L29.7656 13.75L32.8125 12.2083V15.3333ZM2.8125 30.75C2.0625 30.75 1.40625 30.5 0.84375 30C0.28125 29.5 0 28.9167 0 28.25V3.25C0 2.58333 0.28125 2 0.84375 1.5C1.40625 1 2.0625 0.75 2.8125 0.75H42.1875C42.9375 0.75 43.5938 1 44.1562 1.5C44.7188 2 45 2.58333 45 3.25V28.25C45 28.9167 44.7188 29.5 44.1562 30C43.5938 30.5 42.9375 30.75 42.1875 30.75H2.8125ZM27.7031 28.25H42.1875V3.25H2.8125V28.25H3.14062C4.51563 26.3333 6.27344 24.8194 8.41406 23.7083C10.5547 22.5972 12.8906 22.0417 15.4219 22.0417C17.9531 22.0417 20.2891 22.5972 22.4297 23.7083C24.5703 24.8194 26.3281 26.3333 27.7031 28.25ZM15.4219 19.0833C16.9844 19.0833 18.3125 18.5972 19.4062 17.625C20.5 16.6528 21.0469 15.4722 21.0469 14.0833C21.0469 12.6944 20.5 11.5139 19.4062 10.5417C18.3125 9.56944 16.9844 9.08333 15.4219 9.08333C13.8594 9.08333 12.5313 9.56944 11.4375 10.5417C10.3437 11.5139 9.79688 12.6944 9.79688 14.0833C9.79688 15.4722 10.3437 16.6528 11.4375 17.625C12.5313 18.5972 13.8594 19.0833 15.4219 19.0833ZM6.70312 28.25H24.1406C23.0279 27.0757 21.7107 26.1641 20.1889 25.5151C18.6671 24.8661 17.0781 24.5417 15.4219 24.5417C13.7656 24.5417 12.1797 24.8681 10.6641 25.5208C9.14844 26.1736 7.82812 27.0833 6.70312 28.25ZM15.4219 16.5833C14.625 16.5833 13.957 16.3438 13.418 15.8646C12.8789 15.3854 12.6094 14.7917 12.6094 14.0833C12.6094 13.375 12.8789 12.7813 13.418 12.3021C13.957 11.8229 14.625 11.5833 15.4219 11.5833C16.2188 11.5833 16.8867 11.8229 17.4258 12.3021C17.9648 12.7813 18.2344 13.375 18.2344 14.0833C18.2344 14.7917 17.9648 15.3854 17.4258 15.8646C16.8867 16.3438 16.2188 16.5833 15.4219 16.5833Z" fill="black" />
                                    </svg>
                                    <h1 className='personalInfo__title title-reset'>Personal information</h1>
                                </div>
                                <form className='personalInfo__form flex' onSubmit={handleSubmit}>
                                    <input className={fName ? 'content-info__input personalInfo__input input-reset activeInput' : 'content-info__input personalInfo__input input-reset'} type="text" placeholder='First name' value={fName} onChange={handleFNameChange} required />
                                    <input className={sName ? 'content-info__input personalInfo__input input-reset activeInput' : 'content-info__input personalInfo__input input-reset'} type="text" placeholder='Second name' value={sName} onChange={handleSNameChange} required />
                                    <div className='personalInfo__btns flex'>
                                        <button className={step == 1 ? 'logIn-content__button personalInfo__button unActiveBtn button-reset' : 'logIn-content__button personalInfo__button button-reset'} type='button'>Back</button>
                                        <button className='logIn-content__button personalInfo__button button-reset' type='submit'>Next step</button>
                                    </div>
                                </form>
                            </section>
                        }
                        {step == 2 &&
                            <section className='personalInfo signUp-container__underLine signUp-container__personalInfo flex'>
                                <div className='personalInfo__infoTitleImage flex'>
                                    <svg className='personalInfo__svg' width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='personalInfo__path' d="M2.89706 30.9165V28.871H27.6029V30.9165H2.89706ZM2.89706 2.96196V0.916504H27.6029V2.96196H2.89706ZM15.25 17.1438C16.4755 17.1438 17.5049 16.7574 18.3382 15.9847C19.1716 15.212 19.5882 14.2574 19.5882 13.121C19.5882 11.9847 19.1716 11.0301 18.3382 10.2574C17.5049 9.48469 16.4755 9.09832 15.25 9.09832C14.0245 9.09832 12.9951 9.48469 12.1618 10.2574C11.3284 11.0301 10.9118 11.9847 10.9118 13.121C10.9118 14.2574 11.3284 15.212 12.1618 15.9847C12.9951 16.7574 14.0245 17.1438 15.25 17.1438ZM2.45588 26.8256C1.86765 26.8256 1.35294 26.621 0.911765 26.212C0.470588 25.8029 0.25 25.3256 0.25 24.7801V7.05287C0.25 6.46196 0.470588 5.97332 0.911765 5.58696C1.35294 5.20059 1.86765 5.00741 2.45588 5.00741H28.0441C28.6324 5.00741 29.1471 5.21196 29.5882 5.62105C30.0294 6.03014 30.25 6.50741 30.25 7.05287V24.7801C30.25 25.3256 30.0294 25.8029 29.5882 26.212C29.1471 26.621 28.6324 26.8256 28.0441 26.8256H2.45588ZM5.69118 24.7801C6.94118 23.3483 8.42402 22.2745 10.1397 21.5585C11.8554 20.8426 13.5527 20.4847 15.2316 20.4847C16.9105 20.4847 18.6262 20.8426 20.3787 21.5585C22.1311 22.2745 23.6078 23.3483 24.8088 24.7801H28.0441V7.05287H2.45588V24.7801H5.69118ZM9.14706 24.7801H21.4265C20.6667 24.0983 19.7782 23.5529 18.761 23.1438C17.7439 22.7347 16.5735 22.5301 15.25 22.5301C13.9265 22.5301 12.7684 22.7347 11.7757 23.1438C10.7831 23.5529 9.90686 24.0983 9.14706 24.7801ZM15.2558 15.0983C14.6637 15.0983 14.1654 14.9051 13.761 14.5188C13.3566 14.1324 13.1544 13.6665 13.1544 13.121C13.1544 12.5756 13.3547 12.1097 13.7552 11.7233C14.1558 11.337 14.6521 11.1438 15.2442 11.1438C15.8363 11.1438 16.3346 11.337 16.739 11.7233C17.1434 12.1097 17.3456 12.5756 17.3456 13.121C17.3456 13.6665 17.1453 14.1324 16.7448 14.5188C16.3442 14.9051 15.8479 15.0983 15.2558 15.0983Z" fill="black" />
                                    </svg>
                                    <h2 className='personalInfo__title title-reset'>Contact</h2>
                                </div>
                                <form className='personalInfo__form flex' onSubmit={handleSubmit}>
                                    <PhoneInput
                                        isValid={(value, country: any) => {
                                            const validLengthsByCountry = {
                                                us: 11,
                                                gb: 12,
                                                de: 14,
                                                fr: 11,
                                                it: 12,
                                                es: 11,
                                                ua: 12,
                                                cn: 13,
                                                jp: 12,
                                                mx: 12,
                                            };
                                            const maxLength = validLengthsByCountry[country?.iso2 || ''];
                                            if (value.replace(/\D/g, '').length !== maxLength) {
                                                setIsValid(false);
                                                return `Phone number should contain ${maxLength} digits for ${country?.name}`;
                                            }
                                            else {
                                                setIsValid(true);
                                            }
                                            return true;
                                        }}
                                        country={'ua'}
                                        onlyCountries={['us', 'gb', 'de', 'fr', 'it', 'es', 'ua', 'cn', 'jp', 'mx']}
                                        excludeCountries={['ru']}
                                        value={phoneNumber}
                                        onChange={handlePhoneChange}
                                        inputClass={phoneNumber ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'}
                                        inputProps={{
                                            name: 'phone',
                                            autoFocus: true,
                                            placeholder: 'Enter phone number',
                                        }}
                                    />
                                    <input className={email ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'} type="email" name="email-input" placeholder='Email' value={email} onChange={handleEmailChange} required />
                                    <div className='personalInfo__btns flex'>
                                        <button className='logIn-content__button personalInfo__button button-reset' type='button' onClick={() => setStep(1)}>Back</button>
                                        <button className='logIn-content__button personalInfo__button button-reset' type='submit'>Next step</button>
                                    </div>
                                </form>

                            </section>
                        }
                        {step == 3 &&
                            <section className='personalInfo signUp-container__underLine signUp-container__personalInfo flex'>
                                <div className='personalInfo__infoTitleImage flex'>
                                    <svg className='personalInfo__svg' width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='personalInfo__path' d="M22.0894 22.9357C22.8074 22.9357 23.4176 22.6984 23.9202 22.224C24.4228 21.7496 24.6741 21.1893 24.6741 20.5431C24.6741 19.8968 24.4228 19.3475 23.9202 18.8951C23.4176 18.4427 22.8074 18.2166 22.0894 18.2166C21.3715 18.2166 20.749 18.4427 20.2219 18.8951C19.6949 19.3475 19.4313 19.8968 19.4313 20.5431C19.4313 21.1893 19.6949 21.7496 20.2219 22.224C20.749 22.6984 21.3715 22.9357 22.0894 22.9357ZM22.0319 27.6173C22.9612 27.6173 23.8003 27.4425 24.5492 27.093C25.2982 26.7434 25.9362 26.244 26.4632 25.5948C25.742 25.2453 25.0213 24.9831 24.3012 24.8083C23.581 24.6335 22.8321 24.5461 22.0543 24.5461C21.2765 24.5461 20.5201 24.6335 19.785 24.8083C19.0499 24.9831 18.3356 25.2453 17.6422 25.5948C18.1692 26.244 18.8003 26.7434 19.5354 27.093C20.2705 27.4425 21.1026 27.6173 22.0319 27.6173ZM13.3148 30.0518C9.48682 29.2528 6.31068 27.2989 3.78641 24.1903C1.26214 21.0817 0 17.5174 0 13.4975V4.54614L13.3148 0.0517578L26.6297 4.54614V14.6585C26.2413 14.4837 25.8252 14.3277 25.3814 14.1903C24.9376 14.053 24.5215 13.9594 24.1331 13.9094V6.11917L13.3148 2.52367L2.49653 6.11917V13.4975C2.49653 15.3951 2.83634 17.1429 3.51595 18.7409C4.19556 20.3389 5.06241 21.7434 6.1165 22.9544C7.1706 24.1654 8.33564 25.1704 9.61165 25.9694C10.8877 26.7684 12.1221 27.3426 13.3148 27.6922C13.4813 27.9918 13.7309 28.3289 14.0638 28.7034C14.3967 29.078 14.6741 29.3651 14.896 29.5649C14.6463 29.6897 14.3828 29.7833 14.1054 29.8458C13.828 29.9082 13.5645 29.9769 13.3148 30.0518ZM22.1567 30.0518C20.0069 30.0518 18.1692 29.3589 16.6435 27.9731C15.1179 26.5873 14.3551 24.9456 14.3551 23.048C14.3551 21.0896 15.1178 19.4202 16.6431 18.0398C18.1685 16.6595 20.0133 15.9694 22.1775 15.9694C24.3135 15.9694 26.1512 16.6595 27.6907 18.0398C29.2302 19.4202 30 21.0896 30 23.048C30 24.9456 29.2302 26.5873 27.6907 27.9731C26.1512 29.3589 24.3065 30.0518 22.1567 30.0518Z" fill="black" />
                                    </svg>
                                    <h2 className='personalInfo__title title-reset'>Security</h2>
                                </div>
                                <form className='personalInfo__form flex' onSubmit={handleSubmitForm} >
                                    <input className={password ? 'content-info__input personalInfo__input input-reset activeInput' : 'content-info__input personalInfo__input input-reset'} type="text" placeholder='Password' value={password} onChange={handlePasswordChange} required />
                                    <input className={passwordText ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'} type="password" placeholder='Confirm password' value={passwordText} onChange={handlePasswordTextChange} required />
                                    <button className='content-info__button button-reset' type="button" onClick={() => {
                                        showModalEmail();
                                    }}>Verify mail</button>
                                    <Rodal visible={visibleEmail} onClose={hideModalEmail}>
                                        {isMailVerified ?
                                            <div className='products__cards personalInfo-card-2'>
                                                <div className='personalInfo-card__flex flex' >
                                                    <h3 className='personalInfo__title personalInfo-card__title personalInfo-card__title-2 title-reset'>Email verification was successful</h3>
                                                    <div className='otpInput'>
                                                        <OtpInput
                                                            value={emailCode}
                                                            onChange={setEmailCode}
                                                            numInputs={6}
                                                            inputStyle='inputStyle inputStyleDisabled'
                                                            renderSeparator={<span>-</span>}
                                                            renderInput={(props) => <input {...props} readOnly={true} />}
                                                        />
                                                    </div>
                                                    <button className='button-reset content-info__button personalInfo-card__btn' type='button' onClick={() => {
                                                        hideModalEmail();
                                                    }}>Close</button>
                                                </div>
                                            </div>
                                            :
                                            <div className='products__cards personalInfo-card'>
                                                <form className='personalInfo-card__flex flex' ref={form} >
                                                    <input className='none' type="text" value={email} name="user_email" />
                                                    <input className='none' type="text" value={code} name="message" />
                                                    <h3 className='personalInfo__title personalInfo-card__title title-reset'>Verification your email</h3>
                                                    <div className='otpInput'>
                                                        <OtpInput
                                                            value={emailCode}
                                                            onChange={setEmailCode}
                                                            numInputs={6}
                                                            inputStyle='inputStyle'
                                                            renderSeparator={<span>-</span>}
                                                            renderInput={(props) => <input {...props} />}
                                                        />
                                                    </div>
                                                    <button className='button-reset content-info__button personalInfo-card__btn' onClick={sendEmail} type='button'>{emailSendCode ? <>Resend code</> : <>Send code</>}</button>
                                                    <button className='button-reset content-info__button personalInfo-card__btn' type='button' onClick={() => {
                                                        if (code == emailCode) {
                                                            toast.success("Congratulations! You have been verified by email !");
                                                            setIsMailVerified(true);
                                                        }
                                                        else {
                                                            toast.error("Error ! Incorrect verification code");
                                                        }
                                                    }}>Submit</button>
                                                </form>
                                            </div>
                                        }
                                    </Rodal>
                                    <button className='content-info__button button-reset' type="button" onClick={() => {
                                        showModalPhone();
                                    }}>Verify number</button>
                                    <Rodal visible={visiblePhone} onClose={hideModalPhone}>
                                        {isNumberVerified ?
                                            <div className='products__cards personalInfo-card-2'>
                                                <div className='personalInfo-card__flex flex' >
                                                    <h3 className='personalInfo__title personalInfo-card__title personalInfo-card__title-2 title-reset'>Phone verification was successful</h3>
                                                    <div className='otpInput'>
                                                        <OtpInput
                                                            value={phoneCode}
                                                            onChange={setPhoneCode}
                                                            numInputs={6}
                                                            inputStyle='inputStyle inputStyleDisabled'
                                                            renderSeparator={<span>-</span>}
                                                            renderInput={(props) => <input {...props} readOnly={true} />}
                                                        />
                                                    </div>
                                                    <button className='button-reset content-info__button personalInfo-card__btn' type='button' onClick={() => {
                                                        hideModalPhone();
                                                    }}>Close</button>
                                                </div>
                                            </div>
                                            :
                                            <div className='products__cards personalInfo-card'>
                                                <form className='personalInfo-card__flex flex' >
                                                    <h3 className='personalInfo__title personalInfo-card__title title-reset'>Verification your phone</h3>
                                                    <div className='otpInput'>
                                                        <OtpInput
                                                            value={phoneCode}
                                                            onChange={setPhoneCode}
                                                            numInputs={6}
                                                            inputStyle='inputStyle'
                                                            renderSeparator={<span>-</span>}
                                                            renderInput={(props) => <input {...props} />}
                                                        />
                                                    </div>
                                                    <button className='button-reset content-info__button personalInfo-card__btn' type='button' onClick={onSignup}>{phoneSendCode ? <>Resend code</> : <>Send code</>}</button>
                                                    <button className='button-reset content-info__button personalInfo-card__btn' type='button' onClick={onOTPVerify}>Submit</button>
                                                </form>
                                            </div>
                                        }
                                        <div id="recaptcha-container"></div>
                                    </Rodal>
                                    <div className='personalInfo__btns flex'>
                                        <button className='logIn-content__button personalInfo__button button-reset' type='button' onClick={() => setStep(2)}>Back</button>
                                        <button className='logIn-content__button personalInfo__button button-reset' type='submit'>Submit</button>
                                    </div>
                                </form>
                            </section>
                        }
                        <div className='signUp-container__under flex'>
                            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.4165 30.1665C1.8165 30.1665 1.2915 29.9415 0.841504 29.4915C0.391504 29.0415 0.166504 28.5165 0.166504 27.9165V9.9165C0.166504 9.3165 0.391504 8.7915 0.841504 8.3415C1.2915 7.8915 1.8165 7.6665 2.4165 7.6665H11.304V2.4165C11.304 1.8165 11.529 1.2915 11.979 0.841504C12.429 0.391504 12.954 0.166504 13.554 0.166504H16.8165C17.4165 0.166504 17.9415 0.391504 18.3915 0.841504C18.8415 1.2915 19.0665 1.8165 19.0665 2.4165V7.6665H27.9165C28.5165 7.6665 29.0415 7.8915 29.4915 8.3415C29.9415 8.7915 30.1665 9.3165 30.1665 9.9165V27.9165C30.1665 28.5165 29.9415 29.0415 29.4915 29.4915C29.0415 29.9415 28.5165 30.1665 27.9165 30.1665H2.4165ZM2.4165 27.9165H27.9165V9.9165H19.0665C19.0665 10.6165 18.8353 11.1665 18.3728 11.5665C17.9103 11.9665 17.329 12.1665 16.629 12.1665H13.704C13.029 12.1665 12.4603 11.9665 11.9978 11.5665C11.5353 11.1665 11.304 10.6165 11.304 9.9165H2.4165V27.9165ZM5.8665 23.904H14.829V23.379C14.829 22.929 14.7165 22.529 14.4915 22.179C14.2665 21.829 13.979 21.5915 13.629 21.4665C12.829 21.1915 12.204 21.0103 11.754 20.9228C11.304 20.8353 10.8665 20.7915 10.4415 20.7915C9.9665 20.7915 9.46025 20.8478 8.92275 20.9603C8.38525 21.0728 7.779 21.2415 7.104 21.4665C6.729 21.5915 6.429 21.829 6.204 22.179C5.979 22.529 5.8665 22.929 5.8665 23.379V23.904ZM18.4665 21.3915H24.8415V19.5165H18.4665V21.3915ZM10.4415 19.5165C11.004 19.5165 11.4821 19.3196 11.8759 18.9259C12.2696 18.5321 12.4665 18.054 12.4665 17.4915C12.4665 16.929 12.2696 16.4509 11.8759 16.0571C11.4821 15.6634 11.004 15.4665 10.4415 15.4665C9.879 15.4665 9.40088 15.6634 9.00713 16.0571C8.61338 16.4509 8.4165 16.929 8.4165 17.4915C8.4165 18.054 8.61338 18.5321 9.00713 18.9259C9.40088 19.3196 9.879 19.5165 10.4415 19.5165ZM18.4665 17.154H24.8415V15.279H18.4665V17.154ZM13.554 9.9165H16.8165V2.4165H13.554V9.9165Z" fill="black" />
                            </svg>
                            <p className='logIn-content__paragraph paragraph-reset'>Have already an account ?</p>
                            <a className='logIn-content__link link-reset' onClick={() => navigate('/')} tabIndex={0}>Login here</a>
                        </div>
                    </div>
                </main >
            </div >
        </AnimatedPage>
    )
}