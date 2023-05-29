import { useEffect, useRef, useState } from 'react'
import '../css/myCabinetInfoWindow.css'
import '../media/myCabinetWindow.css'
import { useNavigate } from 'react-router-dom';
import ReactStars from 'react-stars'
import PhoneInput from 'react-phone-input-2';
import { Toaster, toast } from 'react-hot-toast';
import { useUserDispatch, useUserSelector } from '../hooks/userHooks';
import { storage } from "../components/assistance/firebase.config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import Rodal from 'rodal';
import OtpInput from 'react-otp-input';
import { IUserVerify } from '../models/user/IUserVerify';
import { checkVerifyUser, deleteUser } from '../store/reducers/user/userActionCreator';
import emailjs from '@emailjs/browser';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './assistance/firebase.config';
import { changeUser } from '../store/reducers/user/userActionCreator';
import { getUser } from '../store/reducers/user/userActionCreator';
import { IUserChange } from '../models/user/IUserChange';
import { IUserDelete } from '../models/user/IUserDelete';
import { PayPalButton } from 'react-paypal-button-v2';
import { getOrderByUserId } from '../store/reducers/order/orderActionCreator';
import AnimatedPage from './assistance/AnimatedPage';
import { collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from "../components/assistance/firebase.config";

export default function MyCabinetInfoWindow() {
    // window 1
    interface SelectedFile {
        file: File | null;
        name: string | null;
    }
    const Orders = useUserSelector(state => state.OrderSlice)
    const dispatch = useUserDispatch();
    const id = window.location.pathname.split('/')[2];
    useEffect(() => {
        const parseId = parseInt(id);
        dispatch(getOrderByUserId(parseId))
        const errorMessage = localStorage.getItem('errorMessage');
        localStorage.removeItem('errorMessage');
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [])
    const [visible, setVisible] = useState(false);
    const showModal = () => {
        setVisible(true);
    };
    const hideModal = () => {
        setVisible(false);
    };
    const [btnState, setBtnState] = useState(1);
    const navigate = useNavigate()
    const [textValue, setTextValue] = useState('');
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
    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextValue(event.target.value);
    }
    const [visibleEmailYesNo, setVisibleEmailYesNo] = useState(false);
    const showModalYesNoEmail = () => {
        setVisibleEmailYesNo(true);
    };
    const hideModalYesNoEmail = () => {
        setVisibleEmailYesNo(false);
    };
    const [visiblePhoneYesNo, setVisiblePhoneYesNo] = useState(false);
    const showModalYesNoPhone = () => {
        setVisiblePhoneYesNo(true);
    };
    const hideModalYesNoPhone = () => {
        setVisiblePhoneYesNo(false);
    };
    const [emailSendCode, setEmailSendCode] = useState(false);
    const [phoneSendCode, setPhoneSendCode] = useState(false);
    const [isMailVerified, setIsMailVerified] = useState(false);
    const [isNumberVerified, setIsNumberVerified] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [starValue, setStarValue] = useState(0);
    const [fName, setFName] = useState("");
    const [sName, setSName] = useState("");
    const [email, setEmail] = useState("");
    const [Description, setdescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailCode, setEmailCode] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
    };
    const handleFNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFName(event.target.value);
    };
    const handleSNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSName(event.target.value);
    };
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setdescription(event.target.value);
    };
    function onSignup() {
        const userCheck: IUserVerify = {
            PhoneNumber: phoneNumber,
            Login: '1',
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
                const parsedID = parseInt(id);
                dispatch(getUser(parsedID)).then(state => {
                    const { isMailVerify, login, review, reviewStars, money, firstName, secondName, description, chatBotMessage, chatRoomIsOn, chatTopic, chatClosedAppeal }: any = state.payload;
                    const ChangeUser: IUserChange = {
                        Id: parsedID,
                        FirstName: fName ? fName : firstName,
                        SecondName: sName ? sName : secondName,
                        Login: login,
                        PhoneNumber: phoneNumber,
                        IsMailVerify: isMailVerify,
                        IsPhoneVerify: isNumberVerified,
                        Description: Description ? Description : description,
                        Review: review,
                        ReviewStars: reviewStars,
                        Money: money,
                        ChatBotMessage: chatBotMessage,
                        ChatRoomIsOn: chatRoomIsOn,
                        ChatTopic: chatTopic,
                        ChatClosedAppeal: chatClosedAppeal
                    }
                    dispatch(changeUser(ChangeUser)).then(() => {
                        dispatch(getUser(parsedID)).then(state => {
                            const { firstName, secondName }: any = state.payload;
                            setFullName(`${firstName} ${secondName}`)
                            setPhoneNumber('');
                        })
                    });
                })
            })
            .catch((err: any) => {
                console.log(err);
                toast.error("Error ! Incorrect verification code");
            });
    }
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<SelectedFile>({ file: null, name: null });
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileInputChange = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile({
            file: file,
            name: file.name
        });
    };
    const form = useRef<HTMLFormElement>(null);
    const sendEmail = (e: any) => {
        const userCheck: IUserVerify = {
            PhoneNumber: '1',
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
    useEffect(() => {
        uploadImage();
    }, [selectedFile])
    const uploadImage = () => {
        if (selectedFile.file == null || selectedFile.name == null) return;
        const imageRef = ref(storage, `images/${id}`);
        getDownloadURL(imageRef)
            .then(() => {
                deleteObject(imageRef).then(() => {
                    if (selectedFile.file == null || selectedFile.name == null) return;
                    getDownloadURL(imageRef)
                        .then((url) => {
                            setAvatarUrl(url);
                        })
                        .catch((error) => {
                            console.error('Error getting avatar URL:', error);
                        });
                    uploadBytes(imageRef, selectedFile.file).then(() => {
                        getDownloadURL(imageRef)
                            .then((url) => {
                                setAvatarUrl(url);
                            })
                            .catch((error) => {
                                console.error('Error getting avatar URL:', error);
                            });
                    });
                });
            })
            .catch(() => {
                if (selectedFile.file == null || selectedFile.name == null) return;
                getDownloadURL(imageRef)
                    .then((url) => {
                        setAvatarUrl(url);
                    })
                    .catch((error) => {
                        console.error('Error getting avatar URL:', error);
                    });
                uploadBytes(imageRef, selectedFile.file);
            });
    };
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = event.target.value;
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setEmail(emailValue);
        setIsValidEmail(emailRegex.test(emailValue));
    };
    const cancelResetHandler = () => {
        setFName('');
        setSName('');
        setdescription('');
        setEmail('');
        setPhoneNumber('');
        setIsMailVerified(false);
        setIsNumberVerified(false);
        toast.success('Reset changes was done')
    }
    const handleSaveChangesWindow1 = () => {
        if (fName.length >= 2 && fName.length <= 10) {
            if (sName.length >= 2 && sName.length <= 10) {
                if (Description.length >= 10 && sName.length <= 50) {
                    if (isValidEmail) {
                        if (!isMailVerified) {
                            toast('Attention ! Go through email verification method', {
                                icon: '📢',
                            });
                        }
                    }
                    else {
                        if (!isMailVerified || email.length === 0) {
                            toast('Attention ! Incorrect email', {
                                icon: '📢',
                            });
                        }
                        const parsedID = parseInt(id);
                        dispatch(getUser(parsedID)).then(state => {
                            const { id, isMailVerify, isPhoneVerify, login, phoneNumber, review, reviewStars, money, chatBotMessage, chatRoomIsOn, chatTopic, chatClosedAppeal }: any = state.payload;
                            const ChangeUser: IUserChange = {
                                Id: id,
                                FirstName: fName,
                                SecondName: sName,
                                Login: login,
                                PhoneNumber: phoneNumber,
                                IsMailVerify: isMailVerify,
                                IsPhoneVerify: isPhoneVerify,
                                Description: Description,
                                Review: review,
                                ReviewStars: reviewStars,
                                Money: money,
                                ChatBotMessage: chatBotMessage,
                                ChatRoomIsOn: chatRoomIsOn,
                                ChatTopic: chatTopic,
                                ChatClosedAppeal: chatClosedAppeal
                            }
                            dispatch(changeUser(ChangeUser)).then(() => {
                                dispatch(getUser(parsedID)).then(state => {
                                    const { firstName, secondName }: any = state.payload;
                                    setFullName(`${firstName} ${secondName}`)
                                    toast.success('Save changes was done')
                                })
                            });
                        })
                    }
                    if (isValid) {
                        if (!isNumberVerified) {
                            toast('Attention ! Go through phone verification method', {
                                icon: '📢',
                            });
                        }
                    }
                    else {
                        toast('Attention ! Incorrect phone', {
                            icon: '📢',
                        });
                        const parsedID = parseInt(id);
                        dispatch(getUser(parsedID)).then(state => {
                            const { id, isMailVerify, isPhoneVerify, login, phoneNumber, review, reviewStars, money, chatBotMessage, chatRoomIsOn, chatTopic, chatClosedAppeal }: any = state.payload;
                            const ChangeUser: IUserChange = {
                                Id: id,
                                FirstName: fName,
                                SecondName: sName,
                                Login: login,
                                PhoneNumber: phoneNumber,
                                IsMailVerify: isMailVerify,
                                IsPhoneVerify: isPhoneVerify,
                                Description: Description,
                                Review: review,
                                ReviewStars: reviewStars,
                                Money: money,
                                ChatBotMessage: chatBotMessage,
                                ChatRoomIsOn: chatRoomIsOn,
                                ChatTopic: chatTopic,
                                ChatClosedAppeal: chatClosedAppeal
                            }
                            dispatch(changeUser(ChangeUser)).then(() => {
                                dispatch(getUser(parsedID)).then(state => {
                                    const { firstName, secondName }: any = state.payload;
                                    setFullName(`${firstName} ${secondName}`)
                                    toast.success('Save changes was done')
                                })
                            });
                        })
                    }
                }
                else {
                    toast.error("Error ! description must be longer than 10 letter and smaller than 50 letter");
                }
            }
            else {
                toast.error("Error ! Second name must be longer than 2 letter and smaller than 10 letter");
            }
        }
        else {
            toast.error("Error ! First name must be longer than 2 letter and smaller than 10 letter");
        }
    }
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    useEffect(() => {
        const avatarRef = ref(storage, `images/${id}`);
        getDownloadURL(avatarRef)
            .then((url) => {
                setAvatarUrl(url);
            })
            .catch((error) => {
                console.error('Error getting avatar URL:', error);
            });
    }, [avatarUrl]);
    const [fullName, setFullName] = useState('');
    useEffect(() => {
        const parsedID = parseInt(id);
        dispatch(getUser(parsedID)).then(state => {
            const { firstName, secondName }: any = state.payload;
            setFullName(`${firstName} ${secondName}`)
        })
    }, [fullName])
    const [descriptionn, setDescriptionn] = useState('');
    useEffect(() => {
        const parsedID = parseInt(id);
        dispatch(getUser(parsedID)).then(state => {
            const { description }: any = state.payload;
            setDescriptionn(description)
        })
    }, [Description])
    const [isMailVerifiedDb, setIsMailVerifiedDb] = useState(false);
    const [isNumberVerifiedDb, setIsNumberVerifiedDb] = useState(false);
    useEffect(() => {
        const parsedID = parseInt(id);
        dispatch(getUser(parsedID)).then(state => {
            const { isMailVerify, isPhoneVerify }: any = state.payload;
            setIsMailVerifiedDb(isMailVerify);
            setIsNumberVerifiedDb(isPhoneVerify);
        })
    })
    const [doNotShowEmailYesNo, setDoNotShowEmailYesNo] = useState(false);
    const handleDoNotShowEmailYesNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDoNotShowEmailYesNo(event.target.checked);
    }
    const [doNotShowPhoneYesNo, setDoNotShowPhoneYesNo] = useState(false);
    const handleDoNotShowPhoneYesNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDoNotShowPhoneYesNo(event.target.checked);
    }
    const [moneyAmount, setMoneyAmount] = useState('');
    useEffect(() => {
        const parsedID = parseInt(id);
        dispatch(getUser(parsedID)).then(state => {
            const { money }: any = state.payload;
            setMoneyAmount(money)
        })
    }, [moneyAmount])
    const returnMain = () => {
        navigate(`/main/${id}`)
    }
    // window 2
    const initialOptions = {
        "client-id": "Acn1ZbzEXfS6OAyUDAFP0D8oaBzkEZ9umFiBIdm1N02L1jtbcerRzrfXu7czqfCykPrre7rLFQANAtIB",
        currency: "USD",
        intent: "capture",
    };
    const [paypalAmount, setPaypalAmount] = useState('1');
    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaypalAmount(event.target.value);
    };
    const handlePaymentSuccess = () => {
        const parsedID = parseInt(id);
        const parsedAmount = parseInt(paypalAmount);
        dispatch(getUser(parsedID)).then(state => {
            const { isMailVerify, login, firstName, secondName, description, isPhoneVerify, phoneNumber, reviewStars, review, chatBotMessage, chatRoomIsOn, chatTopic, chatClosedAppeal }: any = state.payload;
            let { money }: any = state.payload
            const moneyAmount = `${money + parsedAmount}`
            const parsedMoneyAmount = parseInt(moneyAmount);
            const ChangeUser: IUserChange = {
                Id: parsedID,
                FirstName: firstName,
                SecondName: secondName,
                Login: login,
                PhoneNumber: phoneNumber,
                IsMailVerify: isMailVerify,
                IsPhoneVerify: isPhoneVerify,
                Description: description,
                Review: review,
                ReviewStars: reviewStars,
                Money: parsedMoneyAmount,
                ChatBotMessage: chatBotMessage,
                ChatRoomIsOn: chatRoomIsOn,
                ChatTopic: chatTopic,
                ChatClosedAppeal: chatClosedAppeal
            }
            dispatch(changeUser(ChangeUser)).then((state) => {
                console.log(state.payload);
            });
        });
        toast.success('Payment was successful !')
        window.location.href = window.location.href;
    };
    function handleDownload(orderType: string) {
        const downloadLink = document.createElement('a');
        let href = '';
        let downloadName = '';
        if (orderType === 'standart') {
            href = '../../public/myCabinetWindow/Standart.docx';
            downloadName = 'standart';
        } else if (orderType === 'enormous') {
            href = '../../public/myCabinetWindow/Enormous.docx';
            downloadName = 'enormous';
        } else if (orderType === 'exclusive') {
            href = '../../public/myCabinetWindow/Exclusive.docx';
            downloadName = 'exclusive';
        }
        downloadLink.href = href;
        downloadLink.download = downloadName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    // window 3
    const sendReviewWindow3 = () => {
        const parsedID = parseInt(id);
        if (textValue.length >= 25 && textValue.length <= 100) {
            if (starValue !== 0) {
                dispatch(getUser(parsedID)).then(state => {
                    const { isMailVerify, login, firstName, secondName, description, isPhoneVerify, phoneNumber, money, chatBotMessage, chatRoomIsOn, chatTopic, chatClosedAppeal }: any = state.payload;
                    const ChangeUser: IUserChange = {
                        Id: parsedID,
                        FirstName: firstName,
                        SecondName: secondName,
                        Login: login,
                        PhoneNumber: phoneNumber,
                        IsMailVerify: isMailVerify,
                        IsPhoneVerify: isPhoneVerify,
                        Description: description,
                        Review: textValue,
                        ReviewStars: starValue,
                        Money: money,
                        ChatBotMessage: chatBotMessage,
                        ChatRoomIsOn: chatRoomIsOn,
                        ChatTopic: chatTopic,
                        ChatClosedAppeal: chatClosedAppeal
                    }
                    dispatch(changeUser(ChangeUser)).then(() => {
                        setTextValue('');
                        setStarValue(0);
                        toast.success('Your review was send')
                    });
                });
            }
            else {
                toast.error("Error ! The star rating must be at least 1 star");
            }
        }
        else {
            toast.error("Error ! Review must be longer than 25 letter and smaller than 100 letter");
        }
    }
    const messageRef = collection(db, "messages")
    // delete account
    const deleteAccount = () => {
        const room = `room ${id}`
        const queryMessages = query(
            messageRef,
            where("room", "==", room),
        );
        onSnapshot(queryMessages, (snapshot) => {
            snapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });
        });
        const parsedID = parseInt(id);
        const userDelete: IUserDelete = {
            Id: parsedID
        };
        const imageRef = ref(storage, `images/${id}`);
        deleteObject(imageRef)
            .then(() => {
                dispatch(deleteUser(userDelete))
                    .then(() => {
                        navigate('/');
                    })
                    .catch((error) => {
                        console.error('Error deleting user:', error);
                    });
            })
            .catch((error) => {
                console.error('Error deleting avatar image:', error);
                dispatch(deleteUser(userDelete))
                    .then(() => {
                        navigate('/');
                    })
                    .catch((error) => {
                        console.error('Error deleting user:', error);
                    });
            });
        navigate('/');
    };
    return (
        <AnimatedPage>
            <div className='body'>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
                <main className='container fixed__container flex'>
                    <section className='fixed-list flex'>
                        <div className='fixed-list__user flex'>
                            {avatarUrl ? (
                                <img className='fixed-list__avatar' src={avatarUrl} alt="User icon" />
                            ) : (
                                <img className='fixed-list__avatar' src="../../public/myCabinetWindow/myCabinet__user.svg" alt="User icon" />
                            )}
                            <h3 className='fixed-list__title title-reset'>{fullName ? fullName : 'FirstName SecondName'}</h3>
                            <p className='fixed-list__balance paragraph-reset'>{moneyAmount ? `${moneyAmount}$` : '00.00$'}</p>
                            <p className='fixed-list__title fixed-list__title--update paragraph-reset'>Balance</p>
                        </div>
                        <nav className='fixed-list__menu'>
                            <ul className='list-reset'>
                                <li className={btnState != 1 ? "fixed-list__item" : 'fixed-list__item content-info__selected-background'}>
                                    <button className='fixed-list__button button-reset flex' onClick={() => setBtnState(1)}>
                                        <svg className='fixed-list__svgButton fixed-list__svgNormal' width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={btnState != 1 ? "fixed-list__pathButton" : 'fixed-list__pathButton content-info__selected-svg'} d="M12.1665 22.5416L21.6665 13.0416L19.9165 11.3333L12.2915 18.9583L8.08317 14.75L6.24984 16.5833L12.1665 22.5416ZM13.9998 33.625C10.1109 32.6527 6.9165 30.3958 4.4165 26.8541C1.9165 23.3125 0.666504 19.4305 0.666504 15.2083V5.29163L13.9998 0.291626L27.3332 5.29163V15.2083C27.3332 19.4305 26.0832 23.3125 23.5832 26.8541C21.0832 30.3958 17.8887 32.6527 13.9998 33.625ZM13.9998 31.0416C17.1943 29.9861 19.7984 27.993 21.8123 25.0625C23.8262 22.1319 24.8332 18.8472 24.8332 15.2083V7.04163L13.9998 2.95829L3.1665 7.04163V15.2083C3.1665 18.8472 4.17345 22.1319 6.18734 25.0625C8.20123 27.993 10.8054 29.9861 13.9998 31.0416Z" fill="black" fill-opacity="0.5" />
                                        </svg>
                                        <svg className='fixed-list__svgButton fixed-list__svgSmaller' width="21" height="25" viewBox="0 0 21 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={btnState != 1 ? "fixed-list__pathButton" : 'fixed-list__pathButton content-info__selected-svg'} d="M9.2915 16.3116L16.4165 9.47163L15.104 8.24163L9.38525 13.7316L6.229 10.7016L4.854 12.0216L9.2915 16.3116ZM10.6665 24.2916C7.74984 23.5916 5.354 21.9666 3.479 19.4166C1.604 16.8666 0.666504 14.0716 0.666504 11.0316V3.89163L10.6665 0.291626L20.6665 3.89163V11.0316C20.6665 14.0716 19.729 16.8666 17.854 19.4166C15.979 21.9666 13.5832 23.5916 10.6665 24.2916ZM10.6665 22.4316C13.0623 21.6716 15.0155 20.2366 16.5259 18.1266C18.0363 16.0166 18.7915 13.6516 18.7915 11.0316V5.15163L10.6665 2.21163L2.5415 5.15163V11.0316C2.5415 13.6516 3.29671 16.0166 4.80713 18.1266C6.31755 20.2366 8.27067 21.6716 10.6665 22.4316Z" fill="black" fill-opacity="0.5" />
                                        </svg>
                                        <span className={btnState != 1 ? "fixed-list__textButton" : 'fixed-list__textButton content-info__selected-text'}>Personal information</span>
                                    </button>
                                </li>
                                <li className={btnState != 2 ? "fixed-list__item" : 'fixed-list__item content-info__selected-background'}>
                                    <button className='fixed-list__button button-reset flex' onClick={() => setBtnState(2)}>
                                        <svg className='fixed-list__svgButton fixed-list__svgNormal' width="34" height="28" viewBox="0 0 34 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={btnState != 2 ? "fixed-list__pathButton" : 'fixed-list__pathButton content-info__selected-svg'} d="M12.6668 20.75L17.0002 17.375L21.3335 20.75L19.6668 15.4167L23.7502 12H18.7502L17.0002 6.91666L15.2502 12H10.2502L14.3335 15.4167L12.6668 20.75ZM2.8335 27.3333C2.11127 27.3333 1.51405 27.0972 1.04183 26.625C0.569607 26.1528 0.333496 25.5556 0.333496 24.8333V18.4583C1.36127 18.2361 2.21544 17.7153 2.896 16.8958C3.57655 16.0764 3.91683 15.1111 3.91683 14C3.91683 12.8889 3.57655 11.9167 2.896 11.0833C2.21544 10.25 1.36127 9.73611 0.333496 9.54166V3.16666C0.333496 2.44444 0.569607 1.84722 1.04183 1.375C1.51405 0.902775 2.11127 0.666664 2.8335 0.666664H31.1668C31.889 0.666664 32.4863 0.902775 32.9585 1.375C33.4307 1.84722 33.6668 2.44444 33.6668 3.16666V9.54166C32.639 9.73611 31.7849 10.25 31.1043 11.0833C30.4238 11.9167 30.0835 12.8889 30.0835 14C30.0835 15.1111 30.4238 16.0764 31.1043 16.8958C31.7849 17.7153 32.639 18.2361 33.6668 18.4583V24.8333C33.6668 25.5556 33.4307 26.1528 32.9585 26.625C32.4863 27.0972 31.889 27.3333 31.1668 27.3333H2.8335ZM2.8335 24.8333H31.1668V20.2917C30.1113 19.5694 29.2502 18.6667 28.5835 17.5833C27.9168 16.5 27.5835 15.3056 27.5835 14C27.5835 12.6944 27.9168 11.5 28.5835 10.4167C29.2502 9.33333 30.1113 8.43055 31.1668 7.70833V3.16666H2.8335V7.70833C3.91683 8.43055 4.78488 9.33333 5.43766 10.4167C6.09044 11.5 6.41683 12.6944 6.41683 14C6.41683 15.3056 6.09044 16.5 5.43766 17.5833C4.78488 18.6667 3.91683 19.5694 2.8335 20.2917V24.8333Z" fill="black" fill-opacity="0.5" />
                                        </svg>
                                        <svg className='fixed-list__svgButton fixed-list__svgSmaller' width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={btnState != 2 ? "fixed-list__pathButton" : 'fixed-list__pathButton content-info__selected-svg'} d="M9.2135 15.7292L12.3335 13.1979L15.4535 15.7292L14.2535 11.7292L17.1935 9.16666H13.5935L12.3335 5.35416L11.0735 9.16666H7.4735L10.4135 11.7292L9.2135 15.7292ZM2.1335 20.6667C1.6135 20.6667 1.1835 20.4896 0.843496 20.1354C0.503496 19.7812 0.333496 19.3333 0.333496 18.7917V14.0104C1.0735 13.8437 1.6885 13.4531 2.1785 12.8385C2.6685 12.224 2.9135 11.5 2.9135 10.6667C2.9135 9.83333 2.6685 9.10416 2.1785 8.47916C1.6885 7.85416 1.0735 7.46875 0.333496 7.32291V2.54166C0.333496 2 0.503496 1.55208 0.843496 1.19791C1.1835 0.843747 1.6135 0.666664 2.1335 0.666664H22.5335C23.0535 0.666664 23.4835 0.843747 23.8235 1.19791C24.1635 1.55208 24.3335 2 24.3335 2.54166V7.32291C23.5935 7.46875 22.9785 7.85416 22.4885 8.47916C21.9985 9.10416 21.7535 9.83333 21.7535 10.6667C21.7535 11.5 21.9985 12.224 22.4885 12.8385C22.9785 13.4531 23.5935 13.8437 24.3335 14.0104V18.7917C24.3335 19.3333 24.1635 19.7812 23.8235 20.1354C23.4835 20.4896 23.0535 20.6667 22.5335 20.6667H2.1335ZM2.1335 18.7917H22.5335V15.3854C21.7735 14.8437 21.1535 14.1667 20.6735 13.3542C20.1935 12.5417 19.9535 11.6458 19.9535 10.6667C19.9535 9.6875 20.1935 8.79166 20.6735 7.97916C21.1535 7.16666 21.7735 6.48958 22.5335 5.94791V2.54166H2.1335V5.94791C2.9135 6.48958 3.5385 7.16666 4.0085 7.97916C4.4785 8.79166 4.7135 9.6875 4.7135 10.6667C4.7135 11.6458 4.4785 12.5417 4.0085 13.3542C3.5385 14.1667 2.9135 14.8437 2.1335 15.3854V18.7917Z" fill="black" fill-opacity="0.5" />
                                        </svg>
                                        <span className={btnState != 2 ? "fixed-list__textButton" : 'fixed-list__textButton content-info__selected-text'}>My orders</span>
                                    </button>
                                </li>
                                <li className={btnState != 3 ? "fixed-list__item" : 'fixed-list__item content-info__selected-background'}>
                                    <button className='fixed-list__button button-reset flex' onClick={() => setBtnState(3)}>
                                        <svg className='fixed-list__svgButton fixed-list__svgNormal' width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={btnState != 3 ? "fixed-list__pathButton" : 'fixed-list__pathButton content-info__selected-svg'} d="M13.8752 20.3333H27.0002V17.8333H16.3752L13.8752 20.3333ZM7.00016 20.3333H10.2918L20.7918 9.95833C20.9585 9.79166 21.0418 9.58333 21.0418 9.33333C21.0418 9.08333 20.9585 8.87499 20.7918 8.70833L18.5002 6.62499C18.3613 6.48611 18.1877 6.41666 17.9793 6.41666C17.771 6.41666 17.5974 6.48611 17.4585 6.62499L7.00016 17.25V20.3333ZM0.333496 33.6667V2.83333C0.333496 2.19444 0.583496 1.61805 1.0835 1.10416C1.5835 0.590273 2.16683 0.333328 2.8335 0.333328H31.1668C31.8057 0.333328 32.3821 0.590273 32.896 1.10416C33.4099 1.61805 33.6668 2.19444 33.6668 2.83333V24.5C33.6668 25.1389 33.4099 25.7153 32.896 26.2292C32.3821 26.743 31.8057 27 31.1668 27H7.00016L0.333496 33.6667ZM2.8335 27.625L5.9585 24.5H31.1668V2.83333H2.8335V27.625Z" fill="black" fill-opacity="0.5" />
                                        </svg>
                                        <svg className='fixed-list__svgButton fixed-list__svgSmaller' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={btnState != 3 ? "fixed-list__pathButton" : 'fixed-list__pathButton content-info__selected-svg'} d="M8.4585 12.3333H16.3335V10.8333H9.9585L8.4585 12.3333ZM4.3335 12.3333H6.3085L12.6085 6.10833C12.7085 6.00833 12.7585 5.88333 12.7585 5.73333C12.7585 5.58333 12.7085 5.45833 12.6085 5.35833L11.2335 4.10833C11.1502 4.025 11.046 3.98333 10.921 3.98333C10.796 3.98333 10.6918 4.025 10.6085 4.10833L4.3335 10.4833V12.3333ZM0.333496 20.3333V1.83333C0.333496 1.44999 0.483496 1.10416 0.783496 0.795828C1.0835 0.487495 1.4335 0.333328 1.8335 0.333328H18.8335C19.2168 0.333328 19.5627 0.487495 19.871 0.795828C20.1793 1.10416 20.3335 1.44999 20.3335 1.83333V14.8333C20.3335 15.2167 20.1793 15.5625 19.871 15.8708C19.5627 16.1792 19.2168 16.3333 18.8335 16.3333H4.3335L0.333496 20.3333ZM1.8335 16.7083L3.7085 14.8333H18.8335V1.83333H1.8335V16.7083Z" fill="black" fill-opacity="0.5" />
                                        </svg>
                                        <span className={btnState != 3 ? "fixed-list__textButton" : 'fixed-list__textButton content-info__selected-text'}>Write review</span>
                                    </button>
                                </li>
                                <li className="fixed-list__item">
                                    <button className='fixed-list__button button-reset flex' onClick={deleteAccount}>
                                        <svg className='fixed-list__svgButton fixed-list__svgNormal' width="35" height="37" viewBox="0 0 35 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='fixed-list__pathButton' d="M11.2697 27.8674L17.5916 21.8174L23.9666 27.8674L26.4634 25.4674L20.1416 19.4174L26.4634 13.3674L23.9666 10.9674L17.5916 17.0174L11.2697 10.9674L8.71968 13.3674L15.0947 19.4174L8.71968 25.4674L11.2697 27.8674ZM5.95718 36.8174C5.10718 36.8174 4.36343 36.5174 3.72593 35.9174C3.08843 35.3174 2.76968 34.6174 2.76968 33.8174V5.31738H0.591553V2.31738H10.5791V0.817383H24.6041V2.31738H34.5916V5.31738H32.4134V33.8174C32.4134 34.6174 32.0947 35.3174 31.4572 35.9174C30.8197 36.5174 30.0759 36.8174 29.2259 36.8174H5.95718ZM29.2259 5.31738H5.95718V33.8174H29.2259V5.31738Z" fill="black" fill-opacity="0.5" />
                                        </svg>
                                        <svg className='fixed-list__svgButton fixed-list__svgSmaller' width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='fixed-list__pathButton' d="M6.68686 19.4981L10.5916 15.2967L14.5291 19.4981L16.0712 17.8314L12.1666 13.63L16.0712 9.42866L14.5291 7.76199L10.5916 11.9634L6.68686 7.76199L5.11187 9.42866L9.04937 13.63L5.11187 17.8314L6.68686 19.4981ZM3.40562 25.7134C2.88061 25.7134 2.42124 25.505 2.02749 25.0884C1.63374 24.6717 1.43687 24.1856 1.43687 23.63V3.83838H0.0915527V1.75505H6.2603V0.713379H14.9228V1.75505H21.0916V3.83838H19.7462V23.63C19.7462 24.1856 19.5494 24.6717 19.1556 25.0884C18.7619 25.505 18.3025 25.7134 17.7775 25.7134H3.40562ZM17.7775 3.83838H3.40562V23.63H17.7775V3.83838Z" fill="black" fill-opacity="0.5" />
                                        </svg>
                                        <span className='fixed-list__textButton'>Delete account</span>
                                    </button>
                                </li>
                                <li className="fixed-list__item">
                                    <button className='fixed-list__button button-reset flex' onClick={returnMain}>
                                        <svg className='fixed-list__svgButton fixed-list__svgNormal' xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
                                            <path className='fixed-list__pathButton' d="M360 816 121 577l239-239 43 43-167 167h544V376h60v231H237l166 166-43 43Z" />
                                        </svg>
                                        <svg className='fixed-list__svgButton fixed-list__svgSmaller' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="34">
                                            <path className='fixed-list__pathButton' d="M360 816 121 577l239-239 43 43-167 167h544V376h60v231H237l166 166-43 43Z" />
                                        </svg>
                                        <span className='fixed-list__textButton'>Go back</span>
                                    </button>
                                </li>
                                <li className='fixed-list__item fixed-list__logOutButton'>
                                    <button className='fixed-list__button fixed-list__LogOutBtn button-reset flex' onClick={() => navigate('/')}>
                                        <svg className='fixed-list__svgButton fixed-list__svgNormal' width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='fixed-list__pathButtonLogOut' d="M2.5 30C1.83333 30 1.25 29.75 0.75 29.25C0.25 28.75 0 28.1667 0 27.5V2.5C0 1.83333 0.25 1.25 0.75 0.75C1.25 0.25 1.83333 0 2.5 0H14.625V2.5H2.5V27.5H14.625V30H2.5ZM22.75 22.2917L20.9583 20.5L25.2083 16.25H10.625V13.75H25.125L20.875 9.5L22.6667 7.70833L30 15.0417L22.75 22.2917Z" fill="#FF7676" />
                                        </svg>
                                        <svg className='fixed-list__svgButton fixed-list__svgSmaller' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='fixed-list__pathButtonLogOut' d="M1.66667 20C1.22222 20 0.833333 19.8333 0.5 19.5C0.166667 19.1667 0 18.7778 0 18.3333V1.66667C0 1.22222 0.166667 0.833333 0.5 0.5C0.833333 0.166667 1.22222 0 1.66667 0H9.75V1.66667H1.66667V18.3333H9.75V20H1.66667ZM15.1667 14.8611L13.9722 13.6667L16.8056 10.8333H7.08333V9.16667H16.75L13.9167 6.33333L15.1111 5.13889L20 10.0278L15.1667 14.8611Z" fill="#FF7676" />
                                        </svg>
                                        <span className='fixed-list__textLogOutButton'>Log out</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </section>
                    <section className='content flex'>
                        <div className={btnState != 1 ? "none" : 'block'}>
                            <div className='content-info content__info'>
                                <div className='content-info__personalInfo fixed--background-info flex'>
                                    <h2 className='content__title title-reset'>Personal Infromation</h2>
                                    <p className='content__paragraph paragraph-reset'>Please be cautious when entering your personal information on this website.
                                        Ensure that you trust the website and its operators before providing any sensitive
                                        information such as your full name, phone number, email, or credit card details.
                                        Always look for the padlock icon in the address bar to confirm that the website
                                        is secure and has a valid SSL certificate.
                                    </p>
                                </div>
                                <form className='content-info__form'>
                                    <div className='content-info__formLeft'>
                                        <input className={fName ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'} type="text" placeholder='First name' value={fName} onChange={handleFNameChange} required />
                                        <input className={email ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'} type="email" placeholder='Email' value={email} onChange={handleEmailChange} required />
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
                                        <button className='content-info__button update-info-button button-reset flex' type='button' onClick={handleButtonClick}>
                                            <span><img className='content-info__button-icon' src="../../public/myCabinetWindow/myCabinet_changeAvatar.svg" alt="Icon for Change Avatar" /></span>
                                            <span className='content-info__button-text'>Change Avatar</span>
                                        </button>
                                        <input type='file' style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileInputChange} accept='.png,.jpg,.jpeg,.svg' />
                                        <button className='content-info__button update-save-button button-reset' type='button' onClick={handleSaveChangesWindow1}>Save</button>
                                    </div>
                                    <div className='content-info__formRight'>
                                        <input className={sName ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'} type="text" placeholder='Second name' value={sName} onChange={handleSNameChange} required />
                                        {doNotShowEmailYesNo ? (
                                            <button className='content-info__button button-reset' type='button' onClick={showModalEmail}>Verify mail</button>
                                        ) : (
                                            <button className='content-info__button button-reset' type='button' onClick={isMailVerifiedDb ? showModalYesNoEmail : showModalEmail}>Verify mail</button>
                                        )}
                                        <Rodal visible={visibleEmailYesNo} onClose={hideModalYesNoEmail}>
                                            <div className='products__cards personalInfo-card'>
                                                <div className='personalInfo-card__flex flex' >
                                                    <h3 className='personalInfo__title personalInfo-card__title title-reset'>You already have a verified email! Are you sure you want to confirm the new login?</h3>
                                                    <button className='button-reset content-info__button personalInfo-card__btn personalInfo-card__btnYesNo' type='button' onClick={() => {
                                                        showModalEmail();
                                                        hideModalYesNoEmail();
                                                    }}>Yes</button>
                                                    <button className='button-reset content-info__button personalInfo-card__btn personalInfo-card__btnYesNo' type='button' onClick={hideModalYesNoEmail}>No</button>
                                                    <input className='logIn-content__checkbox input-reset' type="checkbox" id="myCheckbox" name="myCheckbox" onChange={handleDoNotShowEmailYesNoChange} />
                                                    <label className='logIn-content__label' htmlFor="myCheckbox">Don't show this modal window again</label>
                                                </div>
                                            </div>
                                        </Rodal>
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
                                                                const parsedID = parseInt(id);
                                                                dispatch(getUser(parsedID)).then(state => {
                                                                    const { isPhoneVerify, phoneNumber, review, reviewStars, money, firstName, secondName, description, chatBotMessage, chatRoomIsOn, chatTopic, chatClosedAppeal }: any = state.payload;
                                                                    const ChangeUser: IUserChange = {
                                                                        Id: parsedID,
                                                                        FirstName: fName ? fName : firstName,
                                                                        SecondName: sName ? sName : secondName,
                                                                        Login: email,
                                                                        PhoneNumber: phoneNumber,
                                                                        IsMailVerify: isMailVerified,
                                                                        IsPhoneVerify: isPhoneVerify,
                                                                        Description: Description ? Description : description,
                                                                        Review: review,
                                                                        ReviewStars: reviewStars,
                                                                        Money: money,
                                                                        ChatBotMessage: chatBotMessage,
                                                                        ChatRoomIsOn: chatRoomIsOn,
                                                                        ChatTopic: chatTopic,
                                                                        ChatClosedAppeal: chatClosedAppeal
                                                                    }
                                                                    dispatch(changeUser(ChangeUser)).then(() => {
                                                                        dispatch(getUser(parsedID)).then(() => {
                                                                            setEmail('');
                                                                        })
                                                                    });
                                                                })
                                                            }
                                                            else {
                                                                toast.error("Error ! Incorrect verification code");
                                                            }
                                                        }}>Submit</button>
                                                    </form>
                                                </div>
                                            }
                                        </Rodal>
                                        {doNotShowPhoneYesNo ? (
                                            <button className='content-info__button button-reset' type='button' onClick={showModalPhone}>Verify number</button>
                                        ) : (
                                            <button className='content-info__button button-reset' type='button' onClick={isNumberVerifiedDb ? showModalYesNoPhone : showModalPhone}>Verify number</button>
                                        )}
                                        <Rodal visible={visiblePhoneYesNo} onClose={hideModalYesNoPhone}>
                                            <div className='products__cards personalInfo-card'>
                                                <div className='personalInfo-card__flex flex' >
                                                    <h3 className='personalInfo__title personalInfo-card__title title-reset'>You already have a verified phone number! Are you sure you want to confirm the new login?</h3>
                                                    <button className='button-reset content-info__button personalInfo-card__btn personalInfo-card__btnYesNo' type='button' onClick={() => {
                                                        showModalPhone();
                                                        hideModalYesNoPhone();
                                                    }}>Yes</button>
                                                    <button className='button-reset content-info__button personalInfo-card__btn personalInfo-card__btnYesNo' type='button' onClick={hideModalYesNoPhone}>No</button>
                                                    <input className='logIn-content__checkbox input-reset' type="checkbox" id="myCheckbox" name="myCheckbox" onChange={handleDoNotShowPhoneYesNoChange} />
                                                    <label className='logIn-content__label' htmlFor="myCheckbox">Don't show this modal window again</label>
                                                </div>
                                            </div>
                                        </Rodal>
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
                                        <textarea className={Description ? 'content-info__input content-info__textArea input-reset activeInput' : 'content-info__input content-info__textArea input-reset'} placeholder='Description' value={Description} onChange={handleDescriptionChange} minLength={25} maxLength={50} required />
                                        <button className='content-info__button button-reset' type='button' onClick={cancelResetHandler}>Cancel</button>
                                    </div>
                                </form>
                                <form className='content-info__formCenter'>
                                    <input className={fName ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'} type="text" placeholder='First name' value={fName} onChange={handleFNameChange} required />
                                    <input className={sName ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'} type="text" placeholder='Second name' value={sName} onChange={handleSNameChange} required />
                                    <input className={email ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'} type="email" placeholder='Email' value={email} onChange={handleEmailChange} required />
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
                                    {doNotShowEmailYesNo ? (
                                        <button className='content-info__button button-reset' type='button' onClick={showModalEmail}>Verify mail</button>
                                    ) : (
                                        <button className='content-info__button button-reset' type='button' onClick={isMailVerifiedDb ? showModalYesNoEmail : showModalEmail}>Verify mail</button>
                                    )}
                                    <Rodal visible={visibleEmailYesNo} onClose={hideModalYesNoEmail}>
                                        <div className='products__cards personalInfo-card'>
                                            <div className='personalInfo-card__flex flex' >
                                                <h3 className='personalInfo__title personalInfo-card__title title-reset'>You already have a verified email! Are you sure you want to confirm the new login?</h3>
                                                <button className='button-reset content-info__button personalInfo-card__btn personalInfo-card__btnYesNo' type='button' onClick={() => {
                                                    showModalEmail();
                                                    hideModalYesNoEmail();
                                                }}>Yes</button>
                                                <button className='button-reset content-info__button personalInfo-card__btn personalInfo-card__btnYesNo' type='button' onClick={hideModalYesNoEmail}>No</button>
                                                <input className='logIn-content__checkbox input-reset' type="checkbox" id="myCheckbox" name="myCheckbox" onChange={handleDoNotShowEmailYesNoChange} />
                                                <label className='logIn-content__label' htmlFor="myCheckbox">Don't show this modal window again</label>
                                            </div>
                                        </div>
                                    </Rodal>
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
                                                            const parsedID = parseInt(id);
                                                            dispatch(getUser(parsedID)).then(state => {
                                                                const { isPhoneVerify, phoneNumber, review, reviewStars, money, chatBotMessage, chatRoomIsOn, chatTopic, chatClosedAppeal }: any = state.payload;
                                                                const ChangeUser: IUserChange = {
                                                                    Id: parsedID,
                                                                    FirstName: fName,
                                                                    SecondName: sName,
                                                                    Login: email,
                                                                    PhoneNumber: phoneNumber,
                                                                    IsMailVerify: isMailVerified,
                                                                    IsPhoneVerify: isPhoneVerify,
                                                                    Description: Description,
                                                                    Review: review,
                                                                    ReviewStars: reviewStars,
                                                                    Money: money,
                                                                    ChatBotMessage: chatBotMessage,
                                                                    ChatRoomIsOn: chatRoomIsOn,
                                                                    ChatTopic: chatTopic,
                                                                    ChatClosedAppeal: chatClosedAppeal
                                                                }
                                                                dispatch(changeUser(ChangeUser)).then(() => {
                                                                    dispatch(getUser(parsedID)).then(state => {
                                                                        const { firstName, secondName }: any = state.payload;
                                                                        setFullName(`${firstName} ${secondName}`)
                                                                    })
                                                                    setEmail('');
                                                                });
                                                            })
                                                        }
                                                        else {
                                                            toast.error("Error ! Incorrect verification code");
                                                        }
                                                    }}>Submit</button>
                                                </form>
                                            </div>
                                        }
                                    </Rodal>
                                    {isNumberVerifiedDb ? (
                                        <button className='content-info__button button-reset' type='button' onClick={showModalPhone}>Verify number</button>
                                    ) : (
                                        <button className='content-info__button button-reset' type='button' onClick={isNumberVerifiedDb ? showModalYesNoPhone : showModalPhone}>Verify number</button>
                                    )}
                                    <Rodal visible={visiblePhoneYesNo} onClose={hideModalYesNoPhone}>
                                        <div className='products__cards personalInfo-card'>
                                            <div className='personalInfo-card__flex flex' >
                                                <h3 className='personalInfo__title personalInfo-card__title title-reset'>You already have a verified phone number! Are you sure you want to confirm the new login?</h3>
                                                <button className='button-reset content-info__button personalInfo-card__btn personalInfo-card__btnYesNo' type='button' onClick={() => {
                                                    showModalPhone();
                                                    hideModalYesNoPhone();
                                                }}>Yes</button>
                                                <button className='button-reset content-info__button personalInfo-card__btn personalInfo-card__btnYesNo' type='button' onClick={hideModalYesNoPhone}>No</button>
                                                <input className='logIn-content__checkbox input-reset' type="checkbox" id="myCheckbox" name="myCheckbox" onChange={handleDoNotShowPhoneYesNoChange} />
                                                <label className='logIn-content__label' htmlFor="myCheckbox">Don't show this modal window again</label>
                                            </div>
                                        </div>
                                    </Rodal>
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
                                    <textarea className={Description ? 'content-info__input content-info__textArea input-reset activeInput' : 'content-info__input content-info__textArea input-reset'} placeholder='Description' value={Description} onChange={handleDescriptionChange} required />
                                    <button className='content-info__button update-info-button button-reset flex' type='button' onClick={handleButtonClick}>
                                        <span><img className='content-info__button-icon' src="../../public/myCabinetWindow/myCabinet_changeAvatar.svg" alt="Icon for Change Avatar" /></span>
                                        <span className='content-info__button-text'>Change Avatar</span>
                                    </button>
                                    <input type='file' style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileInputChange} accept='.png,.jpg,.jpeg,.svg' />
                                    <button className='content-info__button update-save-button button-reset' type='button' onClick={handleSaveChangesWindow1}>Save</button>
                                    <button className='content-info__button button-reset' type='button' onClick={cancelResetHandler}>Cancel</button>
                                </form>
                            </div>
                        </div>
                        <div className={btnState != 2 ? "none" : 'block'}>
                            <div className='content-orders'>
                                <ul className='conent-orders__list list-reset'>
                                    {Orders.Orders.length > 0 ? Orders.Orders.map((order, index) =>
                                        <li className='content-orders__item flex'>
                                            <div className='border-right flex'>
                                                <p className='content-orders__paragraph paragraph-reset'>{index + 1}</p>
                                            </div>
                                            <div className='border-right flex'>
                                                <p className='content-orders__paragraph paragraph-reset'>{order.type}</p>
                                            </div>
                                            <div className='border-right flex'>
                                                <p className='content-orders__paragraph paragraph-reset'>{order.date}</p>
                                            </div>
                                            <button className='content-orders__button button-reset' onClick={() => handleDownload(order.type)}>
                                                <svg className='content-orders__svgNormal' width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path className='content-orders__path' d="M3.479 30.6667C2.729 30.6667 2.07275 30.3854 1.51025 29.8229C0.947754 29.2604 0.666504 28.6042 0.666504 27.8542V21.1511H3.479V27.8542H27.854V21.1511H30.6665V27.8542C30.6665 28.6042 30.3853 29.2604 29.8228 29.8229C29.2603 30.3854 28.604 30.6667 27.854 30.6667H3.479ZM15.6665 23.4948L6.61963 14.4479L8.63525 12.4323L14.2603 18.0573V0.666687H17.0728V18.0573L22.6978 12.4323L24.7134 14.4479L15.6665 23.4948Z" fill="black" />
                                                </svg>
                                                <svg className='content-orders__svgSmaller' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path className='content-orders__path' d="M2.5415 20.6667C2.0415 20.6667 1.604 20.4792 1.229 20.1042C0.854004 19.7292 0.666504 19.2917 0.666504 18.7917V14.3229H2.5415V18.7917H18.7915V14.3229H20.6665V18.7917C20.6665 19.2917 20.479 19.7292 20.104 20.1042C19.729 20.4792 19.2915 20.6667 18.7915 20.6667H2.5415ZM10.6665 15.8854L4.63525 9.85419L5.979 8.51044L9.729 12.2604V0.666687H11.604V12.2604L15.354 8.51044L16.6978 9.85419L10.6665 15.8854Z" fill="black" />
                                                </svg>
                                            </button>
                                        </li>
                                    ) :
                                        <li className='content-orders__item flex'>
                                            <h3 className='content__title title-reset'>You haven't shopped yet</h3>
                                        </li>
                                    }
                                </ul>
                            </div>
                            <button className='content-orders-btn button-reset flex' onClick={showModal}>
                                <svg className='content-orders-btn__svg' width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='content-orders-btn__path' d="M17.962 18.4791C16.8256 18.4791 15.8597 17.9323 15.0642 16.8385C14.2688 15.7448 13.871 14.4166 13.871 12.8541C13.871 11.2916 14.2688 9.9635 15.0642 8.86975C15.8597 7.776 16.8256 7.22913 17.962 7.22913C19.0983 7.22913 20.0642 7.776 20.8597 8.86975C21.6551 9.9635 22.0529 11.2916 22.0529 12.8541C22.0529 14.4166 21.6551 15.7448 20.8597 16.8385C20.0642 17.9323 19.0983 18.4791 17.962 18.4791ZM7.05287 25.0416C6.49037 25.0416 6.00883 24.7662 5.60827 24.2155C5.2077 23.6647 5.00741 23.0026 5.00741 22.2291V3.47913C5.00741 2.70569 5.2077 2.04358 5.60827 1.4928C6.00883 0.942017 6.49037 0.666626 7.05287 0.666626H28.8711C29.4336 0.666626 29.9151 0.942017 30.3157 1.4928C30.7162 2.04358 30.9165 2.70569 30.9165 3.47913V22.2291C30.9165 23.0026 30.7162 23.6647 30.3157 24.2155C29.9151 24.7662 29.4336 25.0416 28.8711 25.0416H7.05287ZM10.462 22.2291H25.462C25.462 20.9166 25.7915 19.8073 26.4506 18.901C27.1097 17.9948 27.9165 17.5416 28.8711 17.5416V8.16663C27.9165 8.16663 27.1097 7.7135 26.4506 6.80725C25.7915 5.901 25.462 4.79163 25.462 3.47913H10.462C10.462 4.79163 10.1324 5.901 9.47332 6.80725C8.81423 7.7135 8.00741 8.16663 7.05287 8.16663V17.5416C8.00741 17.5416 8.81423 17.9948 9.47332 18.901C10.1324 19.8073 10.462 20.9166 10.462 22.2291ZM26.8256 30.6666H2.96196C2.39946 30.6666 1.91792 30.3912 1.51736 29.8405C1.11679 29.2897 0.916504 28.6276 0.916504 27.8541V6.29163H2.96196V27.8541H26.8256V30.6666Z" fill="#59B82C" fill-opacity="0.7" />
                                </svg>
                                <span className='content-orders-btn__text'>Replenish account</span>
                            </button>
                            <Rodal visible={visible} onClose={hideModal}>
                                <div className='products__cards content-orders__paypal'>
                                    <input
                                        className={paypalAmount ? 'content-info__input input-reset activeInput' : 'content-info__input input-reset'}
                                        type="number"
                                        value={paypalAmount}
                                        onChange={handlePaymentChange}
                                        placeholder="Enter the payment amount"
                                        min={1}
                                        max={100000}
                                    />
                                    <div className='rodalButtons flex'>
                                        <button className='content-orders-btn button-reset' onClick={() => setPaypalAmount('25')}>
                                            <span className='content-orders-btn__text'>25</span>
                                        </button>
                                        <button className='content-orders-btn button-reset' onClick={() => setPaypalAmount('50')}>
                                            <span className='content-orders-btn__text'>50</span>
                                        </button>
                                        <button className='content-orders-btn button-reset' onClick={() => setPaypalAmount('75')}>
                                            <span className='content-orders-btn__text'>75</span>
                                        </button>
                                        <button className='content-orders-btn button-reset' onClick={() => setPaypalAmount('100')}>
                                            <span className='content-orders-btn__text'>100</span>
                                        </button>
                                    </div>
                                    <PayPalButton
                                        amount={paypalAmount}
                                        onSuccess={handlePaymentSuccess}
                                        onError={(error) => {
                                            console.log(error);
                                            toast.error(`Payment error enter any payment amount`);
                                        }}
                                        options={initialOptions}
                                    />
                                </div>
                            </Rodal>
                        </div>
                        <div className={btnState != 3 ? "none" : 'block'}>
                            <div className='content-reviews'>
                                <form className='content-reviews__form flex'>
                                    <div className='content-reviews__formLeft flex'>
                                        <textarea className={textValue ? 'content-reviews__review activeInput' : 'content-reviews__review'} placeholder='Your review' maxLength={100} minLength={25} value={textValue} onChange={handleTextareaChange} />
                                        <div className='star-container star-containerNormal'>
                                            <ReactStars
                                                half={false}
                                                count={5}
                                                size={40}
                                                valuet={starValue}
                                                onChange={star => setStarValue(star)}
                                                color2={'#ffd700'} />
                                        </div>
                                        <div className='star-container star-containerSmaller'>
                                            <ReactStars
                                                half={false}
                                                count={5}
                                                value={starValue}
                                                onChange={star => setStarValue(star)}
                                                size={20}
                                                color2={'#ffd700'} />
                                        </div>
                                        <button className='content-reviews__button button-reset flex' type='button' onClick={sendReviewWindow3}>
                                            <svg className='content-reviews__svg' width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='content-reviews__path' d="M0 30V0L30 15L0 30ZM2.36842 25.6406L23.8421 15L2.36842 4.21875V12.0938L11.9211 15L2.36842 17.8125V25.6406Z" fill="#007ABF" />
                                            </svg>
                                            <span className='content-reviews__text'>Send review</span>
                                        </button>
                                    </div>
                                    <div className='content-reviews__formRight'>
                                        <div className='content-reviews__result'>
                                            <div className='fixed--background-info content-reviews__background content-reviews__userReview flex' style={{ backgroundImage: 'none' }}>
                                                {avatarUrl ? (
                                                    <img className='slide__userSwipe__avatar' src={avatarUrl} alt="User icon" />
                                                ) : (
                                                    <img className='slide__userSwipe__avatar' src="../../public/myCabinetWindow/myCabinet__user.svg" alt="User icon" />
                                                )}
                                                <div className='flex column'>
                                                    <h3 className='content-reviews__title title-reset'>{fullName ? fullName : 'FirstName SecondName'}</h3>
                                                    <p className='content-reviews__paragraph paragraph-reset'>{descriptionn ? descriptionn : 'Description'}</p>
                                                </div>
                                            </div>
                                            <p className='content-reviews__reviewResult paragraph-reset'>"{textValue}"</p>
                                            <div className='star-container star-containerNormal'>
                                                <ReactStars
                                                    edit={false}
                                                    half={false}
                                                    count={5}
                                                    value={starValue}
                                                    size={40}
                                                    color2={'#ffd700'} />
                                            </div>
                                            <div className='star-container star-containerSmaller'>
                                                <ReactStars
                                                    edit={false}
                                                    half={false}
                                                    count={5}
                                                    value={starValue}
                                                    size={20}
                                                    color2={'#ffd700'} />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </AnimatedPage>
    )
}