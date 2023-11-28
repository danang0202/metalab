import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import { apiURL } from "../../main.js";
import api from "../../apiConfig/apiConfig.js";
import Cookies from "js-cookie";
import TalentChat from "./chat/TalentChat.jsx";

const NavbarTalent = () => {
    const location = useLocation();
    const [avatar, setAvatar] = useState();
    const token = Cookies.get('token_metalab');
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const [showChat, setShowChat] = useState();
    const [newMessage, setNewMessage] = useState();


    useEffect(() => {

        if (sessionStorage.getItem('newMessages')) {
            setNewMessage(true);
        }

        const fetchDataTalent = async () => {
            // setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/profil`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.status === 200) {
                        if (response.data.user.status == "Disable") {
                            navigate('/logout');
                        }
                        setUser(response.data.user);
                    }
                    // setLoading(false);
                } catch (error) {
                    // setLoading(false);
                    console.error('Error:', error);
                }
            }
        };
        fetchDataTalent();
    }, []);

    useEffect(() => {
        if (user && user.avatar) {
            setAvatar(`${apiURL}/storage/avatars/${user.avatar}`);
        }
    }, [user]);

    useEffect(() => {
        const fetchNewChat = async () => {
            if (token) {
                try {
                    const response = await api.get(`/is-new-chat-present`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log(response);
                    if (response.status === 200) {
                        setNewMessage(true);
                        sessionStorage.setItem('newMessages', true);
                    } else {
                        setNewMessage(false);
                    }
                } catch (error) {
                    setNewMessage(false);
                    console.error('Error:', error);
                }
            }
        };
        let intervalId;

        const checkNewChat = () => {
            if (!showChat && !sessionStorage.getItem('newMessages')) {
                fetchNewChat();
            }

            // Jika showChat bernilai true, hentikan interval
            if (showChat) {
                clearInterval(intervalId);
            }
        };

        intervalId = setInterval(checkNewChat, 3000);

        // Membersihkan interval saat komponen di-unmount atau saat showChat menjadi true
        return () => {
            clearInterval(intervalId);
        };
    }, [showChat])


    return (
        <>
            <nav className="navbar navbar-expand-lg bg-clear shadow shadow-sm p-2 py-3 sticky-top z-5">
                <div className="container-fluid">
                    <div className="logo-container col-4 text-end">
                        <img src="/images/metalab-logo.png" alt="" style={{ width: '9rem' }} />
                    </div>
                    <button className="navbar-toggler mx-2" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-center fw-semibold w-100">
                            <li className="nav-item mx-5 small d-flex align-items-center">
                                <a className={`nav-link ${location.pathname.startsWith('/beranda') ? 'text-blue' : ''} `}
                                    aria-current="page" href="/beranda">
                                    <i className="fa-solid fa-house-user d-md-none"
                                        style={{ marginRight: '0.5em' }}></i>Dashboard</a>
                            </li>
                            <li className="nav-item mx-5  small d-flex align-items-center">
                                <a className={`nav-link ${location.pathname == ('/') ? 'text-blue' : ''} `}
                                    href="/">
                                    <i className="fa-solid fa-briefcase d-md-none"
                                        style={{ marginRight: '0.5em' }}></i>Jobs</a>
                            </li>
                            <li className="nav-item mx-5  small d-flex align-items-center">
                                <a className={`nav-link ${location.pathname.startsWith('/hiring') ? 'text-blue' : ''} `}
                                    href="/hiring">
                                    <i className="fa-solid fa-list-check d-md-none"
                                        style={{ marginRight: '0.5em' }}></i>Hiring</a>
                            </li>
                            {token ? (
                                <>
                                    <li className="nav-item mx-5 d-block d-md-block d-lg-none small">
                                        <a className={`nav-link ${location.pathname.startsWith('/profile') ? 'text-blue' : ''} `}
                                            href="/profile">
                                            <i className="fa-solid fa-user"
                                                style={{ marginRight: '0.5em' }}></i>Profile</a>
                                    </li>
                                    <li className="nav-item mx-5 d-block d-md-block d-lg-none small">
                                        <a className={`nav-link ${location.pathname.startsWith('/logout') ? 'text-blue' : ''} `}
                                            href="/logout">
                                            <i className="fa fa-sign-out"
                                                style={{ marginRight: '0.5em' }}></i>Logout</a>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item mx-5 d-block d-md-block d-lg-none">
                                        <a className={`nav-link ${location.pathname.startsWith('/login') ? 'text-blue' : ''} `}
                                            href="/login">
                                            <i className="fa-solid fa-arrow-right-to-bracket"
                                                style={{ marginRight: '0.5em' }}></i>Login</a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div className="user-icon col-3 text-start d-none d-md-none d-lg-block">
                        <div className="dropdown">
                            <button className="p-0 border-0 d-flex align-items-center" type="button" data-bs-toggle="dropdown"
                                style={{ borderRadius: '50%' }} aria-expanded="false">
                                <img src={`${avatar ? avatar : '/images/avatar-default.png'}`} id="avatar"
                                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                                    alt="avatar" />
                            </button>

                            <div className="dropdown-menu p-2 w-auto">
                                {token ? (
                                    <>
                                        <Link to={`/profile`} style={{ textDecoration: 'none' }}>
                                            <button
                                                className="dropdown-item btn p-1 d-flex align-items-center rounded-2 p-2 bg-opacity-25 hover-op1 text-decoration-none">
                                                <i className="fa-solid fa-user text-decoration-none"
                                                    style={{ marginRight: '0.5em' }}></i> Profile
                                            </button>
                                        </Link>
                                        <Link to={`/logout`} style={{ textDecoration: 'none' }}>
                                            <button
                                                className="dropdown-item btn p-1 d-flex align-items-center mt-1 rounded-2 p-2 bg-opacity-25 hover-op1">
                                                <i className="fa fa-sign-out"
                                                    style={{ marginRight: '0.5em' }}></i>
                                                Logout
                                            </button>
                                        </Link>
                                    </>
                                ) : (
                                    <Link to={`/login`} style={{ textDecoration: 'none' }}>
                                        <button
                                            className="dropdown-item btn p-1 d-flex align-items-center rounded-2 p-2 bg-opacity-25 hover-op1">
                                            <i className="fa-solid fa-arrow-right-to-bracket"
                                                style={{ marginRight: '0.5em' }}></i>
                                            Login
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <button type="button" className="btn bg-blue text-light hover-op6 position-fixed d-flex align-items-center pt-2 px-2" onClick={() => {
                setShowChat(true);
                setNewMessage(false);
                if (sessionStorage.getItem('newMessages')) {
                    sessionStorage.removeItem('newMessages');
                }
            }} style={{ right: '1rem', bottom: '1.5rem' }}>
                <i className="fa-solid fa-message fs-4"></i>
                {newMessage && (
                    <span className="position-absolute top-0 start-100 translate-middle p-2 bg-green border border-light rounded-circle">
                        <span className="visually-hidden">New alerts</span>
                    </span>
                )}
            </button>

            {/* <div className="icon-message-container" onClick={() => { setShowChat(true), setNewMessage(false) }}>
                <span className="icon-message"><i className="fa-solid fa-message px-1"></i></span>{newMessage && 'new'}
            </div> */}
            {showChat && (
                <TalentChat setShowChat={setShowChat} showChat={showChat} />
            )}
        </>
    )
}

export default NavbarTalent