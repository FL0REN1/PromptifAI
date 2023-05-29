import '../css/mainWindow.css'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import '../media/mainWindow.css'
import { Keyboard, EffectCards, EffectFade, Autoplay, Pagination } from "swiper";
import Tabs from './assistance/tabComponent';
import { useEffect, useState } from 'react';
import { Link } from "react-scroll";
import BurgerMenu from './assistance/burgerMenuComponent';
import TabAccordion from './assistance/tabAccordionComponent';
import { useNavigate } from 'react-router-dom';
import 'rodal/lib/rodal.css';
import { useUserDispatch, useUserSelector } from '../hooks/userHooks';
import { changeUser, getAllUsers, getUser } from '../store/reducers/user/userActionCreator';
import ReactStars from 'react-stars'
import { ref, getDownloadURL } from "firebase/storage"
import { storage } from './assistance/firebase.config';
import { Background, Parallax } from 'react-parallax';
import { IUserChange } from '../models/user/IUserChange';
import toast, { Toaster } from 'react-hot-toast';
import { IUserRead } from '../models/user/IUserRead';
import { createOrder } from '../store/reducers/order/orderActionCreator';
import { IOrderCreate } from '../models/order/IOrderCreate';
import AnimatedPage from './assistance/AnimatedPage';
import ErrorWindow from './assistance/ErrorWindow';
import ChatBot from 'react-simple-chatbot';

export default function MainWindow() {
    const dispatch = useUserDispatch();
    const user = useUserSelector(state => state.UserSlice)
    const [usersNew, setUsersNew] = useState<IUserRead[]>([]);
    useEffect(() => {
        dispatch(getAllUsers()).then((state) => {
            const payload = state.payload as IUserRead[];
            setUsersNew(payload);
        });
    }, []);
    const tabs1 = [
        {
            id: 'description',
            title: 'DESCRIPTION',
            content: <p className='products__paragraph paragraph-reset'>The company offers prompts for AI developed by professionals to enhance performance.</p>,
        },
        {
            id: 'details',
            title: 'DETAILS',
            content: <p className='products__paragraph paragraph-reset'>Prompts are a crucial component of AI and our company provides a wide range of prompts for natural language processing,
                speech recognition, and machine translation. The prompts can be adapted to the needs of various AI systems.</p>,
        },
        {
            id: 'reviews',
            title: 'REVIEWS',
            content: <p className='products__paragraph paragraph-reset'>The prompts from this company helped improve the performance of our AI system and reduce errors. They provide quality prompts for
                natural language processing and speech recognition. We recommend this company to anyone looking to enhance the performance of their AI systems.
            </p>,
        },
    ];
    const tabs2 = [
        {
            id: 'standart',
            title: 'STANDART',
            content: <p className='products__paragraph paragraph-reset'>Include: 100 prompts, 5 good AI, instruction in .docx</p>,
        },
        {
            id: 'enormous',
            title: 'ENORMOUS',
            content: <p className='products__paragraph paragraph-reset'>Include: 250 prompts, 15 good AI, instruction in .docx</p>,
        },
        {
            id: 'exclusive',
            title: 'EXCLUSIVE',
            content: <p className='products__paragraph paragraph-reset'>Include: 400 prompts, 40 good AI, instruction in discord</p>,
        },
    ];
    const navigate = useNavigate()
    const id = window.location.pathname.split('/')[2];
    const roomName = `room ${id}`;
    const MyCabinetNavigate = () => {
        navigate(`/cabinet/${id}`)
    }
    const [price, setPrice] = useState(39);
    const handleLiKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            const linkElement = event.currentTarget.querySelector('a');
            if (linkElement) {
                linkElement.click();
            }
        }
    };
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
    const [moneyAmount, setMoneyAmount] = useState('');
    useEffect(() => {
        const parseId = parseInt(id);
        dispatch(getUser(parseId)).then(state => {
            const { money }: any = state.payload;
            setMoneyAmount(money);
        })
    }, [moneyAmount])
    const [fullName, setFullName] = useState('');
    useEffect(() => {
        const parsedID = parseInt(id);
        dispatch(getUser(parsedID)).then(state => {
            const { firstName, secondName }: any = state.payload;
            setFullName(`${firstName} ${secondName}`)
        })
    }, [fullName])

    const [opened, setOpened] = useState(false);
    const toggleFloating = ({ opened }: any) => {
        setOpened(opened);
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
    const [chatRoomIsOnOff, setChatRoomIsOnOff] = useState(false);
    const [chatTopic, setChatTopic] = useState('');
    const handleEnd = ({ values }: any) => {
        handleClick();
        const msg = values[1]
        const parsedID = parseInt(id);
        dispatch(getUser(parsedID)).then(state => {
            const { isMailVerify, login, firstName, secondName, description, isPhoneVerify, phoneNumber, money, review, reviewStars, chatClosedAppeal }: any = state.payload;
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
                Money: money,
                ChatBotMessage: msg,
                ChatRoomIsOn: chatRoomIsOnOff,
                ChatTopic: chatTopic,
                ChatClosedAppeal: chatClosedAppeal
            }
            dispatch(changeUser(ChangeUser)).then(() => {
                if (chatRoomIsOnOff) {
                    const navigationChat = `/chat/user/${id}/${code}`;
                    navigate(navigationChat)
                }
            });
        });
    };
    const steps = [
        {
            id: 'intro',
            message: `Hello, ${fullName} ! Choose the option below that suits you best ⬇`,
            trigger: 'first options',
        },
        {
            id: 'first options',
            options: [
                { value: 1, label: 'Problems with replenishment/purchase', trigger: 'Problems with replenishment/purchase' },
                { value: 2, label: 'Problems with the account', trigger: 'Problems with the account' },
                { value: 3, label: 'I found bugs on the site', trigger: 'I found bugs on the site' },
            ],
        },
        {
            id: 'Problems with replenishment/purchase',
            message: 'Write everything we need to know',
            trigger: 'Problems with replenishment/purchase_user',
        },
        {
            id: 'Problems with replenishment/purchase_user',
            user: true,
            validator: (value: string) => {
                if (value.length < 10 || value.length > 250) {
                    return 'Should be 10-250 characters long';
                }
                return true;
            },
            trigger: 'Problems with replenishment/purchase_user_text',
        },
        {
            id: 'Problems with replenishment/purchase_user_text',
            message: (() => {
                setChatTopic('Problems with replenishment/purchase')
                return (
                    'Do you want to contact customer service?'
                )
            }),
            trigger: 'Problems with replenishment/purchase_user_options',
        },
        {
            id: 'Problems with replenishment/purchase_user_options',
            options: [
                { value: 1, label: 'Yes', trigger: 'Problems with replenishment/purchase_yes' },
                { value: 2, label: 'No', trigger: 'Problems with replenishment/purchase_no' },
            ],
        },
        {
            id: 'Problems with replenishment/purchase_yes',
            message: (() => {
                setChatRoomIsOnOff(true);
                return (
                    'Redirect to another page...'
                )
            }),
            end: true
        },
        {
            id: 'Problems with replenishment/purchase_no',
            message: (() => {
                setChatRoomIsOnOff(false);
                return (
                    `We sent your message to the customer service for checking and fixing the error. Have a nice day !`
                )
            }),
            end: true
        },
        {
            id: 'Problems with the account',
            message: `Write everything we need to know`,
            trigger: 'Problems with the account_user',
        },
        {
            id: 'Problems with the account_user',
            user: true,
            validator: (value: string) => {
                if (value.length < 10 || value.length > 250) {
                    return 'Should be 10-250 characters long';
                }
                return true;
            },
            trigger: 'Problems with the account_user_text',
        },
        {
            id: 'Problems with the account_user_text',
            message: (() => {
                setChatTopic('Problems with the account')
                return (
                    `Do you want to contact customer service?`
                )
            }),
            trigger: 'Problems with the account_user_options',
        },
        {
            id: 'Problems with the account_user_options',
            options: [
                { value: 1, label: 'Yes', trigger: 'Problems with the account_yes' },
                { value: 2, label: 'No', trigger: 'Problems with the account_no' },
            ],
        },
        {
            id: 'Problems with the account_yes',
            message: (() => {
                setChatRoomIsOnOff(true);
                return (
                    'Redirect to another page...'
                )
            }),
            end: true
        },
        {
            id: 'Problems with the account_no',
            message: (() => {
                setChatRoomIsOnOff(false);
                return (
                    `We sent your message to the customer service for checking and fixing the error. Have a nice day !`
                )
            }),
            end: true
        },
        {
            id: 'I found bugs on the site',
            message: `Write everything we need to know`,
            trigger: 'I found bugs on the site_user',
        },
        {
            id: 'I found bugs on the site_user',
            user: true,
            validator: (value: string) => {
                if (value.length < 10 || value.length > 250) {
                    return 'Should be 10-250 characters long';
                }
                return true;
            },
            trigger: 'I found bugs on the site_user_text',
        },
        {
            id: 'I found bugs on the site_user_text',
            message: (() => {
                setChatTopic('I found bugs on the site')
                return (
                    'Do you want to contact customer service?'
                )
            }),
            trigger: 'I found bugs on the site_user_options',
        },
        {
            id: 'I found bugs on the site_user_options',
            options: [
                { value: 1, label: 'Yes', trigger: 'I found bugs on the site_yes' },
                { value: 2, label: 'No', trigger: 'I found bugs on the site_no' },
            ],
        },
        {
            id: 'I found bugs on the site_yes',
            message: (() => {
                setChatRoomIsOnOff(true);
                return (
                    'Redirect to another page...'
                )
            }),
            end: true
        },
        {
            id: 'I found bugs on the site_no',
            message: (() => {
                setChatRoomIsOnOff(false);
                return (
                    `We sent your message to the customer service for checking and fixing the error. Have a nice day !`
                )
            }),
            end: true
        },
    ];
    return (
        <AnimatedPage>
            {user.Error ? <ErrorWindow /> :
                <div className='body'>
                    <Toaster
                        position="bottom-right"
                        reverseOrder={false}
                    />
                    <div>
                        {avatarUrl ?
                            <ChatBot
                                handleEnd={handleEnd}
                                recognitionEnable={true}
                                steps={steps}
                                floating={true}
                                opened={opened}
                                toggleFloating={toggleFloating}
                                headerTitle={roomName}
                                userAvatar={avatarUrl}
                            />
                            :
                            <ChatBot
                                handleEnd={handleEnd}
                                recognitionEnable={true}
                                steps={steps}
                                floating={true}
                                opened={opened}
                                toggleFloating={toggleFloating}
                                headerTitle={roomName}
                                userAvatar='../../public/myCabinetWindow/myCabinet__user.svg'
                            />
                        }
                        <header className='marginNull'>
                            <div className='container'>
                                <div className='header'>
                                    <div className='header-update flex'>
                                        <BurgerMenu />
                                        <img className='logo header__logo' src="../../public/PromptifyAI_Logo.png" alt="Company Logo" />
                                        <ul className='header__list list-reset flex'>
                                            <li className='header__item header__content header__background' tabIndex={0} onKeyPress={handleLiKeyPress}>
                                                <Link
                                                    className="header__link link-reset"
                                                    to="aboutUs"
                                                    smooth={true}
                                                    duration={500}
                                                >
                                                    About us
                                                </Link>
                                            </li>
                                            <li className='header__item header__content header__background header__background__2' tabIndex={0} onKeyPress={handleLiKeyPress}>
                                                <Link
                                                    className="header__link link-reset"
                                                    to="products"
                                                    smooth={true}
                                                    duration={500}
                                                >
                                                    Products
                                                </Link>
                                            </li>
                                            <li className='header__item header__content header__background header__background__3' tabIndex={0} onKeyPress={handleLiKeyPress}>
                                                <Link
                                                    className="header__link link-reset"
                                                    to="reviews"
                                                    smooth={true}
                                                    duration={500}
                                                >
                                                    Reviews
                                                </Link>
                                            </li>
                                            <li className='header__item header__content header__background header__background__4' tabIndex={0} onKeyPress={handleLiKeyPress}>
                                                <Link
                                                    className="header__link link-reset"
                                                    to="contacts"
                                                    smooth={true}
                                                    duration={500}
                                                >
                                                    Contacts
                                                </Link>
                                            </li>
                                        </ul>
                                        <div className='header__list header__content header__background header__background__5' tabIndex={0} onKeyPress={handleLiKeyPress}>
                                            <a className='header__link link-reset' onClick={MyCabinetNavigate} tabIndex={-1}>My cabinet</a>
                                        </div>
                                    </div>
                                    <div className='slider'>
                                        <Swiper
                                            spaceBetween={30}
                                            effect={"fade"}
                                            keyboard={{
                                                enabled: true,
                                            }}
                                            pagination={{
                                                clickable: true,
                                            }}
                                            autoplay={{
                                                delay: 2500,
                                                disableOnInteraction: false,
                                            }}
                                            modules={[Keyboard, Autoplay, EffectFade, Pagination]}
                                            className="mySwiper"
                                        >
                                            <div className='swiper-pagination' tabIndex={0}></div>
                                            <SwiperSlide>
                                                <img className='sliderWorlds' src="../../public/mainWindow/header__firstWorld.jpg" alt="Slide 1" />
                                                <div className='header__sliderText'>
                                                    <h2 className='slider__title title-reset'>Touch The <br />F U T U R E</h2>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <img className='sliderWorlds' src="../../public/mainWindow/header__secondWorld.jpg" alt="Slide 2" />
                                                <div className='header__sliderText'>
                                                    <h2 className='slider__title title-reset'>Touch The <br />F U T U R E</h2>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <img className='sliderWorlds' src="../../public/mainWindow/header__lastWorld.jpg" alt="Slide 3" />
                                                <div className='header__sliderText'>
                                                    <h2 className='slider__title title-reset'>Touch The <br />F U T U R E</h2>
                                                </div>
                                            </SwiperSlide>
                                        </Swiper>
                                    </div>
                                    <div className='parent-container'>
                                        <div className='elipse' tabIndex={0} onKeyPress={handleLiKeyPress}>
                                            <Link
                                                className="elipse__link link-reset"
                                                to="aboutUs"
                                                smooth={true}
                                                duration={500}
                                            >
                                                <img className='elipse__image' src="../../public/mainWindow/header__downRow.png" alt="down__row" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <Parallax strength={500} className='shadow'>
                            <Background className="custom-bg custom-bg-brain" />
                            <div>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>
                        </Parallax>
                        <main className='main'>
                            <section className='about-us main__about-us' id='aboutUs' >
                                <div className='container'>
                                    <div className='title-background'>
                                        <h2 className='title-reset main__title'>About us</h2>
                                    </div>
                                    <p className='about-us__paragraph main__paragraph paragraph-reset'>We offer advanced prompts for AI developed by experienced professionals and language experts to enhance the accuracy, speed,
                                        and overall performance of AI systems. Our mission is to make AI accessible to everyone through innovative and excellent prompt development.</p>
                                    <Swiper
                                        tabIndex={0}
                                        effect={"cards"}
                                        keyboard={{
                                            enabled: true,
                                        }}
                                        grabCursor={true}
                                        modules={[Keyboard, EffectCards]}
                                        onSwiper={(swiper) => {
                                            swiper.slideTo(2, 0);
                                        }}
                                        className="about-us__swiper"
                                    >
                                        <SwiperSlide className='about-us__swiper'>
                                            <img className='about-us__swiper' src="../../public/mainWindow/about-us__firstRobot.jpg" alt="first avatar" />
                                            <div className='about-us__sliderText about-us__sliderText-update'>
                                                <h2 className='about-us__title slider__title title-reset'>GARY</h2>
                                                <p className='slider__paragraph paragraph-reset'>Designer</p>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide className='about-us__swiper'>
                                            <img className='about-us__swiper' src="../../public/mainWindow/about-us__secondRobot.jpg" alt="second avatar" />
                                            <div className='about-us__sliderText'>
                                                <h2 className='about-us__title slider__title title-reset'>SAM</h2>
                                                <p className='slider__paragraph paragraph-reset'>Front-end developer</p>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide className='about-us__swiper'>
                                            <img className='about-us__swiper' src="../../public/mainWindow/about-us__thirdRobot.jpg" alt="third avatar" />
                                            <div className='about-us__sliderText'>
                                                <h2 className='about-us__title slider__title title-reset'>JACOB</h2>
                                                <p className='slider__paragraph paragraph-reset'>Back-end developer</p>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide className='about-us__swiper'>
                                            <img className='about-us__swiper' src="../../public/mainWindow/about-us__fourthRobot.jpg" alt="fourth avatar" />
                                            <div className='about-us__sliderText'>
                                                <h2 className='about-us__title slider__title title-reset'>LILY</h2>
                                                <p className='slider__paragraph paragraph-reset'>Sales representative</p>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide className='about-us__swiper'>
                                            <img className='about-us__swiper' src="../../public/mainWindow/about-us__lastRobot.jpg" alt="last avatar" />
                                            <div className='about-us__sliderText'>
                                                <h2 className='about-us__title slider__title title-reset'>OSCAR</h2>
                                                <p className='slider__paragraph paragraph-reset'>Promts developer</p>
                                            </div>
                                        </SwiperSlide>
                                    </Swiper>
                                </div>
                            </section>
                            <Parallax strength={500} className='shadow'>
                                <Background className="custom-bg custom-bg-boost" />
                                <div>
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                </div>
                            </Parallax>
                            <section className='products main__products' id='products'>
                                <div className='container'>
                                    <div className='title-background main__title-background'>
                                        <h2 className='title-reset main__title'>Products</h2>
                                    </div>
                                    <div className='products__content flex'>
                                        <video autoPlay muted loop className='products__video'>
                                            <source src="../../public/mainWindow/main__productVideo.mp4" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                        <div className='products__items'>
                                            <div className='background__products'>
                                                <h2 className='title-reset products__title'>Prompt Packs</h2>
                                            </div>
                                            <h2 className='title-reset products__title products__title-update'>First collection</h2>
                                            <div className='products__Tabs'>
                                                <Tabs tabs={tabs1} />
                                            </div>
                                            <div className='products__Tabs tabs--update'>
                                                <TabAccordion tabs={tabs1} />
                                            </div>
                                            <h2 className='title-reset products__title products__title-update products__color-change'>TYPE</h2>
                                            <div className='products__Tabs'>
                                                <Tabs tabs={tabs2} onTabClick={(tabId) => {
                                                    if (tabId === 'standart') {
                                                        setPrice(39);
                                                    } else if (tabId === 'enormous') {
                                                        setPrice(59);
                                                    } else if (tabId === 'exclusive') {
                                                        setPrice(99);
                                                    }
                                                }} />
                                            </div>
                                            <div className='products__Tabs tabs--update'>
                                                <TabAccordion tabs={tabs2} onTabChange={(tabId) => {
                                                    if (tabId === 'standart') {
                                                        setPrice(39);
                                                    } else if (tabId === 'enormous') {
                                                        setPrice(59);
                                                    } else if (tabId === 'exclusive') {
                                                        setPrice(99);
                                                    }
                                                }} />
                                            </div>
                                            <div className='products__buySection flex'>
                                                <button className='btn products__buyBtn button-reset' type='button' onClick={() => {
                                                    let money = parseInt(moneyAmount);
                                                    if (money - price < 0) {
                                                        localStorage.setItem('errorMessage', 'Error! Not enough money to make a transaction');
                                                        MyCabinetNavigate();
                                                    }
                                                    else {
                                                        const parsedID = parseInt(id);
                                                        money -= price;
                                                        dispatch(getUser(parsedID)).then(state => {
                                                            const { isPhoneVerify, phoneNumber, review, reviewStars, firstName, secondName, login, isMailVerify, description, chatBotMessage, chatRoomIsOn, chatTopic, chatClosedAppeal }: any = state.payload;
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
                                                                Money: money,
                                                                ChatBotMessage: chatBotMessage,
                                                                ChatRoomIsOn: chatRoomIsOn,
                                                                ChatTopic: chatTopic,
                                                                ChatClosedAppeal: chatClosedAppeal
                                                            }
                                                            dispatch(changeUser(ChangeUser)).then(() => {
                                                                let type = '';
                                                                if (price == 39) {
                                                                    type = 'standart'
                                                                }
                                                                if (price == 59) {
                                                                    type = 'enormous'
                                                                }
                                                                if (price == 99) {
                                                                    type = 'exclusive'
                                                                }
                                                                let dateTime = new Date();
                                                                const date = `${dateTime.getFullYear()}-${dateTime.getMonth().toString().padStart(2, "0")}-${dateTime.getDate().toString().padStart(2, "0")}`
                                                                const time = `${dateTime.getHours().toString().padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}:${dateTime.getSeconds().toString().padStart(2, "0")}`
                                                                const order: IOrderCreate = {
                                                                    OrderId: parsedID,
                                                                    Type: type,
                                                                    Date: `${date} ${time}`
                                                                }
                                                                dispatch(createOrder(order))
                                                                toast.success('Payment was successful')
                                                            });
                                                        })
                                                    }
                                                }}><span className='btn__text'>BUY NOW</span></button>
                                                <div className='products__price flex'>
                                                    <p className='elipse__paragraph paragraph-reset'>{price}</p>
                                                    <p className='paragraph-reset products__button'>DOLLARS</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <Parallax strength={500} className='shadow'>
                                <Background className="custom-bg custom-bg-your" />
                                <div>
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                </div>
                            </Parallax>
                            <section className='reviews main__reviews' id='reviews'>
                                <div className='container'>
                                    <div className='title-background reviews__title-background'>
                                        <h2 className='title-reset main__title'>Reviews</h2>
                                    </div>
                                    <div className='swiperTwoSlide'>
                                        <Swiper
                                            tabIndex={0}
                                            keyboard={{
                                                enabled: true,
                                            }}
                                            modules={[Keyboard]}
                                            slidesPerView={2}
                                            spaceBetween={30}
                                            className='slide'
                                        >
                                            <SwiperSlide className='slide reviews__slide'>
                                                <div className='slide__content'>
                                                    <div className='title-background slide__title-background'>
                                                        <h2 className='title-reset slide__titleName'>Evander Wilderwood</h2>
                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">A fiery spirit with the ability to control flames.</h3>
                                                        <div className='tooltip tooltip--visible'>
                                                            <h3 className="title-reset slide__titleDescription">A fiery spirit...</h3>
                                                            <span className="tooltip-text">A fiery spirit with the ability to control flames.</span>
                                                        </div>
                                                    </div>
                                                    <p className='paragraph-reset slide__review'>
                                                        "PromptifyAI has revolutionized the way I approach writing. It's like having a personal writing assistant!"
                                                    </p>
                                                    <div className='slide__stars'>
                                                        <ReactStars
                                                            edit={false}
                                                            half={false}
                                                            count={5}
                                                            value={5}
                                                            size={40}
                                                            color2={'#ffd700'} />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className='slide reviews__slide'>
                                                <div className='slide__content'>
                                                    <div className='title-background slide__title-background slide__title-background2'>
                                                        <h2 className='title-reset slide__titleName'>Dante Shadowblade</h2>
                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">A fierce warrior with a heart of gold.</h3>
                                                        <div className='tooltip tooltip--visible'>
                                                            <h3 className="title-reset slide__titleDescription">A fierce warrior...</h3>
                                                            <span className="tooltip-text">A fierce warrior with a heart of gold.</span>
                                                        </div>
                                                    </div>
                                                    <p className='paragraph-reset slide__review'>
                                                        "Congratulations, this project pleasantly surprised me, I made my site using Chat gpt, Midjourney
                                                        and 3 other artificial intelligence, and now I'm a billionaire !"
                                                    </p>
                                                    <div className='slide__stars'>
                                                        <ReactStars
                                                            edit={false}
                                                            half={false}
                                                            count={5}
                                                            value={5}
                                                            size={40}
                                                            color2={'#ffd700'} />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className='slide reviews__slide'>
                                                <div className='slide__content'>
                                                    <div className='title-background slide__title-background slide__title-background3'>
                                                        <h2 className='title-reset slide__titleName'>Orion Emberheart</h2>
                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">A gentle healer who has the power to soothe and mend.</h3>
                                                        <div className='tooltip tooltip--visible'>
                                                            <h3 className="title-reset slide__titleDescription">A gentle healer...</h3>
                                                            <span className="tooltip-text">A gentle healer who has the power to soothe and mend.</span>
                                                        </div>
                                                    </div>
                                                    <p className='paragraph-reset slide__review'>
                                                        "I used to struggle with writer's block, but with PromptifyAI, the words just flow effortlessly."
                                                    </p>
                                                    <div className='slide__stars'>
                                                        <ReactStars
                                                            edit={false}
                                                            half={false}
                                                            count={5}
                                                            value={5}
                                                            size={40}
                                                            color2={'#ffd700'} />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className='slide reviews__slide'>
                                                <div className='slide__content'>
                                                    <div className='title-background slide__title-background slide__title-background4'>
                                                        <h2 className='title-reset slide__titleName'>Galen Nightingale</h2>
                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">A skilled ranger with a deep connection to the natural world.</h3>
                                                        <div className='tooltip tooltip--visible'>
                                                            <h3 className="title-reset slide__titleDescription">A skilled ranger...</h3>
                                                            <span className="tooltip-text">A skilled ranger with a deep connection to the natural world.</span>
                                                        </div>
                                                    </div>
                                                    <p className='paragraph-reset slide__review'>
                                                        "I'm blown away by the level of accuracy and speed that PromptifyAI provides. It's a game changer!"
                                                    </p>
                                                    <div className='slide__stars'>
                                                        <ReactStars
                                                            edit={false}
                                                            half={false}
                                                            count={5}
                                                            value={5}
                                                            size={40}
                                                            color2={'#ffd700'} />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className='slide reviews__slide'>
                                                <div className='slide__content'>
                                                    <div className='title-background slide__title-background slide__title-background5'>
                                                        <h2 className='title-reset slide__titleName'>Caspian Stormcaller</h2>
                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">A celestial being with the ability to manipulate the winds</h3>
                                                        <div className='tooltip tooltip--visible'>
                                                            <h3 className="title-reset slide__titleDescription">A celestial being...</h3>
                                                            <span className="tooltip-text">A celestial being with the ability to manipulate the winds</span>
                                                        </div>
                                                    </div>
                                                    <p className='paragraph-reset slide__review'>
                                                        "Thanks to PromptifyAI, I'm able to produce high-quality content in a fraction of the time it used to take me.
                                                        I couldn't be happier!"
                                                    </p>
                                                    <div className='slide__stars'>
                                                        <ReactStars
                                                            edit={false}
                                                            half={false}
                                                            count={5}
                                                            value={5}
                                                            size={40}
                                                            color2={'#ffd700'} />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            {usersNew.length > 0 && usersNew.map(user => {
                                                if (user.reviewStars) {
                                                    return (
                                                        <SwiperSlide className='slide reviews__slide'>
                                                            <div className='slide__content'>
                                                                <div className='title-background slide__title-background slide__title-background5 slide__userSwipe flex' style={{ backgroundImage: 'none' }}>
                                                                    {avatarUrl ? (
                                                                        <img className='slide__userSwipe__avatar' src={avatarUrl} alt="User icon" />
                                                                    ) : (
                                                                        <img className='slide__userSwipe__avatar' src="../../public/myCabinetWindow/myCabinet__user.svg" alt="User icon" />
                                                                    )}
                                                                    <div>
                                                                        <h2 className='title-reset slide__titleName'>{user.firstName} {user.secondName}</h2>
                                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">{user.description}</h3>
                                                                        <div className='tooltip tooltip--visible'>
                                                                            <h3 className="title-reset slide__titleDescription">
                                                                                {user && user.description && user.description.slice(0, Math.ceil((user.description.length * 30) / 100))}
                                                                            </h3>
                                                                            <span className="tooltip-text">{user.description}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <p className='paragraph-reset slide__review'>
                                                                    "{user.review}"
                                                                </p>
                                                                <div className='slide__stars'>
                                                                    <ReactStars
                                                                        edit={false}
                                                                        half={false}
                                                                        count={5}
                                                                        value={user.reviewStars}
                                                                        size={40}
                                                                        color2={'#ffd700'} />
                                                                </div>
                                                            </div>
                                                        </SwiperSlide>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            })}
                                        </Swiper>
                                    </div>
                                    <div className='swiperOneSlide'>
                                        <Swiper
                                            tabIndex={0}
                                            keyboard={{
                                                enabled: true,
                                            }}
                                            modules={[Keyboard]}
                                            slidesPerView={1}
                                            spaceBetween={30}
                                            className='slide'
                                        >
                                            <SwiperSlide className='slide reviews__slide'>
                                                <div className='slide__content'>
                                                    <div className='title-background slide__title-background'>
                                                        <h2 className='title-reset slide__titleName'>Evander Wilderwood</h2>
                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">A fiery spirit with the ability to control flames.</h3>
                                                        <div className='tooltip tooltip--visible'>
                                                            <h3 className="title-reset slide__titleDescription">A fiery spirit...</h3>
                                                            <span className="tooltip-text">A fiery spirit with the ability to control flames.</span>
                                                        </div>
                                                    </div>
                                                    <p className='paragraph-reset slide__review'>
                                                        "PromptifyAI has revolutionized the way I approach writing. It's like having a personal writing assistant!"
                                                    </p>
                                                    <div className='slide__stars'>
                                                        <ReactStars
                                                            edit={false}
                                                            half={false}
                                                            count={5}
                                                            value={5}
                                                            size={40}
                                                            color2={'#ffd700'} />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className='slide reviews__slide'>
                                                <div className='slide__content'>
                                                    <div className='title-background slide__title-background slide__title-background2'>
                                                        <h2 className='title-reset slide__titleName'>Dante Shadowblade</h2>
                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">A fierce warrior with a heart of gold.</h3>
                                                        <div className='tooltip tooltip--visible'>
                                                            <h3 className="title-reset slide__titleDescription">A fierce warrior...</h3>
                                                            <span className="tooltip-text">A fierce warrior with a heart of gold.</span>
                                                        </div>
                                                    </div>
                                                    <p className='paragraph-reset slide__review'>
                                                        "Congratulations, this project pleasantly surprised me, I made my site using Chat gpt, Midjourney
                                                        and 3 other artificial intelligence, and now I'm a billionaire !"
                                                    </p>
                                                    <div className='slide__stars'>
                                                        <ReactStars
                                                            edit={false}
                                                            half={false}
                                                            count={5}
                                                            value={5}
                                                            size={40}
                                                            color2={'#ffd700'} />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className='slide reviews__slide'>
                                                <div className='slide__content'>
                                                    <div className='title-background slide__title-background slide__title-background3'>
                                                        <h2 className='title-reset slide__titleName'>Orion Emberheart</h2>
                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">A gentle healer who has the power to soothe and mend.</h3>
                                                        <div className='tooltip tooltip--visible'>
                                                            <h3 className="title-reset slide__titleDescription">A gentle healer...</h3>
                                                            <span className="tooltip-text">A gentle healer who has the power to soothe and mend.</span>
                                                        </div>
                                                    </div>
                                                    <p className='paragraph-reset slide__review'>
                                                        "I used to struggle with writer's block, but with PromptifyAI, the words just flow effortlessly."
                                                    </p>
                                                    <div className='slide__stars'>
                                                        <ReactStars
                                                            edit={false}
                                                            half={false}
                                                            count={5}
                                                            value={5}
                                                            size={40}
                                                            color2={'#ffd700'} />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className='slide reviews__slide'>
                                                <div className='slide__content'>
                                                    <div className='title-background slide__title-background slide__title-background4'>
                                                        <h2 className='title-reset slide__titleName'>Galen Nightingale</h2>
                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">A skilled ranger with a deep connection to the natural world.</h3>
                                                        <div className='tooltip tooltip--visible'>
                                                            <h3 className="title-reset slide__titleDescription">A skilled ranger...</h3>
                                                            <span className="tooltip-text">A skilled ranger with a deep connection to the natural world.</span>
                                                        </div>
                                                    </div>
                                                    <p className='paragraph-reset slide__review'>
                                                        "I'm blown away by the level of accuracy and speed that PromptifyAI provides. It's a game changer!"
                                                    </p>
                                                    <div className='slide__stars'>
                                                        <ReactStars
                                                            edit={false}
                                                            half={false}
                                                            count={5}
                                                            value={5}
                                                            size={40}
                                                            color2={'#ffd700'} />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className='slide reviews__slide'>
                                                <div className='slide__content'>
                                                    <div className='title-background slide__title-background slide__title-background5'>
                                                        <h2 className='title-reset slide__titleName'>Caspian Stormcaller</h2>
                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">A celestial being with the ability to manipulate the winds</h3>
                                                        <div className='tooltip tooltip--visible'>
                                                            <h3 className="title-reset slide__titleDescription">A celestial being...</h3>
                                                            <span className="tooltip-text">A celestial being with the ability to manipulate the winds</span>
                                                        </div>
                                                    </div>
                                                    <p className='paragraph-reset slide__review'>
                                                        "Thanks to PromptifyAI, I'm able to produce high-quality content in a fraction of the time it used to take me.
                                                        I couldn't be happier!"
                                                    </p>
                                                    <div className='slide__stars'>
                                                        <ReactStars
                                                            edit={false}
                                                            half={false}
                                                            count={5}
                                                            value={5}
                                                            size={40}
                                                            color2={'#ffd700'} />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            {usersNew.length > 0 && usersNew.map(user => {
                                                if (user.reviewStars) {
                                                    return (
                                                        <SwiperSlide className='slide reviews__slide'>
                                                            <div className='slide__content'>
                                                                <div className='title-background slide__title-background slide__title-background5 slide__userSwipe flex' style={{ backgroundImage: 'none' }}>
                                                                    {avatarUrl ? (
                                                                        <img className='slide__userSwipe__avatar' src={avatarUrl} alt="User icon" />
                                                                    ) : (
                                                                        <img className='slide__userSwipe__avatar' src="../../public/myCabinetWindow/myCabinet__user.svg" alt="User icon" />
                                                                    )}
                                                                    <div>
                                                                        <h2 className='title-reset slide__titleName'>{user.firstName} {user.secondName}</h2>
                                                                        <h3 className="title-reset slide__titleDescription slide__title--visible">{user.description}</h3>
                                                                        <div className='tooltip tooltip--visible'>
                                                                            <h3 className="title-reset slide__titleDescription">
                                                                                {user && user.description && user.description.slice(0, Math.ceil((user.description.length * 30) / 100))}
                                                                            </h3>
                                                                            <span className="tooltip-text">{user.description}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <p className='paragraph-reset slide__review'>
                                                                    "{user.review}"
                                                                </p>
                                                                <div className='slide__stars'>
                                                                    <ReactStars
                                                                        edit={false}
                                                                        half={false}
                                                                        count={5}
                                                                        value={user.reviewStars}
                                                                        size={40}
                                                                        color2={'#ffd700'} />
                                                                </div>
                                                            </div>
                                                        </SwiperSlide>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            })}
                                        </Swiper>
                                    </div>
                                </div>
                            </section>
                        </main>
                        <Parallax strength={500} className='shadow'>
                            <Background className="custom-bg custom-bg-skill" />
                            <div>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>
                        </Parallax>
                        <footer className='contacts footer__contacts' id='contacts'>
                            <div className='container'>
                                <div className='title-background contacts__title-background'>
                                    <h2 className='title-reset main__title'>Contacts</h2>
                                </div>
                                <div className='contacts__content flex'>
                                    <img className='contacts__image' src="../../public/mainWindow/main__alchemist.png" alt="alchemist icon" />
                                    <div className='contacts__infromation'>
                                        <div className='contacts__visitUs'>
                                            <h2 className='contacts__title title-reset'>Visit us:</h2>
                                            <p className='paragraph__ttitle paragraph-reset'>123 Main Street, Kyiv, Ukraine</p>
                                        </div>
                                        <div className='contacts__contact'>
                                            <h2 className='contacts__title title-reset'>Contact:</h2>
                                            <div className='contacts__links flex'>
                                                <a className='contacts__link link-reset' href="tel:+123456789">+380 (99) 351 11 22</a>
                                                <a className='contacts__link link-reset' href="mailto:contacts@promtifyAI.com">contacts@promtifyAI.com</a>
                                            </div>
                                        </div>
                                        <form className='contacts__form flex' action="#">
                                            <input className='contacts__input input-reset' type="email" placeholder='Email' />
                                            <button className='btn button-reset contacts__btn' type='submit'><span className='footer__btn-text'>Subscribe</span></button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div >
            }
        </AnimatedPage>
    )
}