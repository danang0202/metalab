import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import api from '../../apiConfig/apiConfig'

const LayoutAdmin = () => {

    // Cek jika bukan admin maka redirecrt ke job
    const [showSidebar, setShowSidebar] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [newMessage, setNewMessage] = useState();
    const token = Cookies.get('token_metalab');

    useEffect(() => {
        if (Cookies.get('role_metalab') !== 'admin') {
            navigate('/')
        }
        if(sessionStorage.getItem('newMessages')){
            setNewMessage(true);
        }

        const fetchNewChat = async () => {
            if (token) {
                try {
                    const response = await api.get(`/is-new-chat-present`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setNewMessage(true);
                        sessionStorage.setItem('newMessages',true);
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
            if (!location.pathname.startsWith('/admin/chat') && !sessionStorage.getItem('newMessages')) {
                fetchNewChat();
            }

            // Jika showChat bernilai true, hentikan interval
            if (location.pathname.startsWith('/admin/chat')) {
                clearInterval(intervalId);
            }
        };

        intervalId = setInterval(checkNewChat, 3000);

        // Membersihkan interval saat komponen di-unmount atau saat showChat menjadi true
        return () => {
            clearInterval(intervalId);
        };
    }, [location.pathname])



    return (
        <>
            <div className="d-flex flex-row" style={{ maxWidth: '100vw', maxHeight: '100vh' }}>
                <Sidebar showSidebar={showSidebar} />
                <div className="d-flex flex-column w-100" style={{ height: '100vh' }}>
                    <div className="header d-flex">
                        <div className="box d-flex gap-3 align-items-center px-4 col-9 bg-clear" style={{ paddingTop: '1rem', paddingBottom: '0.5rem' }}>
                            <div className="hamburger-menu" id='hamburger-menu'>
                                <i className="fa-solid fa-bars fs-4" onClick={() => setShowSidebar(!showSidebar)}></i>
                            </div>
                            <h5 className='fw-bold'>{location.pathname.startsWith('/admin/talent') ? 'Talent' : location.pathname.startsWith('/admin/client') ? 'Client' : location.pathname.startsWith('/admin/job') ? 'Job' : location.pathname.startsWith('/admin/hiring') ? 'Hiring' : 'Calendar'}</h5>
                        </div>
                        <div className="col-2 bg-clear"></div>
                        <Link to={`/admin/chat`}>
                            <button type="button" className="mt-3 btn text-light hover-op6 position-fixed d-flex align-items-center p-0" onClick={() => setNewMessage(false)}>
                                <i className="fa-solid fa-message fs-4 text-blue"></i>
                                {newMessage && (
                                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-green border border-light rounded-circle">
                                        <span className="visually-hidden">New alerts</span>
                                    </span>
                                )}
                            </button>
                        </Link>
                    </div>
                    <div className="pt-1" style={{ minHeight: '89vh' }}>
                        <div className="admin content d-flex flex-row bg-light rounded-3" style={{ width: '100%', height: '100%' }}>
                            <Outlet />
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default LayoutAdmin