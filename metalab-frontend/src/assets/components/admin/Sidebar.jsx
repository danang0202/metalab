import React from 'react'
import {useLocation} from 'react-router-dom';

const Sidebar = (props) => {
    const showSidebar = props.showSidebar;
    const location = useLocation();
    return (
        <>
            <aside id="sidebar" className={`bg-clear ${showSidebar ? 'show-sidebar' : 'hidden-sidebar'}`}
                   style={{top: '0', minWidth:'200px'}}>
                <div className="logo-container w-100 text-center">
                    <img src="/images/metalab-logo.png" alt="" className='py-4 px-2' style={{width: '11rem'}}/>
                </div>
                <div className="sidebar-container d-flex flex-column justify-content-between">
                    <div className="navigasi-caontainer d-flex flex-column">
                        <div
                            className={`admin-nav-item w-100 d-flex flex-column px-3 justify-content-center ${location.pathname.startsWith('/admin/talent') ? 'admin-nav-active' : ''}`}
                            style={{height: '3rem'}}>
                            <a className="nav-link d-flex flex-row gap-2 align-items-center" href="/admin/talent">
                                <i className="fa-solid me-2 fa-user text-blue"></i>
                                <span className='fw-semibold text-secondary'>Talent</span>
                            </a>
                        </div>
                        <div
                            className={`admin-nav-item w-100 d-flex flex-column px-3 justify-content-center ${location.pathname.startsWith('/admin/client') ? 'admin-nav-active' : ''}`}
                            style={{height: '3rem'}}>
                            <a className="nav-link d-flex flex-row gap-2 align-items-center" href="/admin/client">
                                <i className="fa-solid me-2 fa-building text-blue"></i>
                                <span className='fw-semibold text-secondary'>Client</span>
                            </a>
                        </div>
                        <div
                            className={`admin-nav-item w-100 d-flex flex-column px-3 justify-content-center ${location.pathname.startsWith('/admin/job') ? 'admin-nav-active' : ''}`}
                            style={{height: '3rem'}}>
                            <a className="nav-link d-flex flex-row gap-2 align-items-center" href="/admin/job">
                                <i className="fa-solid me-2 fa-bag-shopping text-blue"></i>
                                <span className='fw-semibold text-secondary'>Job</span>
                            </a>
                        </div>
                        <div
                            className={`admin-nav-item w-100 d-flex flex-column px-3 justify-content-center ${location.pathname.startsWith('/admin/hiring') ? 'admin-nav-active' : ''}`}
                            style={{height: '3rem'}}>
                            <a className="nav-link d-flex flex-row gap-2 align-items-center" href="/admin/hiring">
                                <i className="fa-solid fa-person-walking-arrow-right text-blue"></i>
                                <span className='fw-semibold text-secondary'>Hiring</span>
                            </a>
                        </div>
                        <div
                            className={`admin-nav-item w-100 d-flex flex-column px-3 justify-content-center ${location.pathname.startsWith('/admin/calender') ? 'admin-nav-active' : ''}`}
                            style={{height: '3rem'}}>
                            <a className="nav-link d-flex flex-row gap-2 align-items-center" href="/admin/calender">
                                <i className="fa-solid me-2 fa-calendar-days text-blue"></i>
                                <span className='fw-semibold text-secondary'>Calendar</span>
                            </a>
                        </div>
                    </div>
                    <div
                        className={`admin-nav-item w-100 d-flex flex-column px-3 justify-content-center mt-5`}
                        style={{height: '3rem'}}>
                        <a className={`nav-link ${location.pathname.startsWith('/logout') ? 'text-blue' : ''} `}
                           href="/logout">
                            <span className='fw-semibold text-secondary'>Logout</span>
                            <i className="fa fa-sign-out text-orange"
                               style={{marginLeft: '0.5em'}}></i>
                        </a>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar