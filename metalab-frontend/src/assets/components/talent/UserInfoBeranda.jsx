import Cookies from 'js-cookie';
import { apiURL } from '../../main';
const userEmail = Cookies.get('email_metalab');

const UserInfoBeranda = (props) => {
    const user = props.user;
    return (
        <>
            {user && (
                <div className="container d-flex justify-content-center profile-container">
                    <div className="profile-box shadow rounded d-flex flex-column col-lg-7 col-md-12 col-12 px-4 py-3 mt-3 mb-4" style={{ height: '11rem',  background: 'linear-gradient(to right, #00A3E1, #00A3E1, #91EAE4)'  }}>
                        <div className="inner-box-profile d-flex justify-content-between align-items-center">
                            <div className="info-name text-light">
                                <h4 className=""><span className="badge rounded-pill bg-clear text-dark fw-semibold">{user.firstName} {user.lastName}</span></h4>
                                <h6>{userEmail} </h6>
                                <h6 className='fs-7' >PT Meta Lab Nusantara</h6>
                            </div>
                            <div className="avatar mx-3">
                                <img src={`${user.avatar ? apiURL + '/storage/avatars/' + user.avatar : '/images/avatar-default.png'}`} className="d-none d-md-none d-lg-block" alt="" style={{ width: '7rem', height: "7rem", borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff' }} />
                                <img src={`${user.avatar ? apiURL + '/storage/avatars/' + user.avatar : '/images/avatar-default.png'}`} className="d-block d-md-block d-lg-none" alt="" style={{ width: '4rem', height: "4rem", borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff' }} />
                            </div>
                        </div>
                        <div className="card-container d-flex flex-row gap-3 mt-1 justify-content-start w-100">
                            <div className="bg-clear shadow rounded d-flex flex-md-row flex-lg-row flex-column py-1 pt-2 gap-2 px-3 align-items-center">
                                <i className="fa-solid fa-spinner fs-3 bg-orange-t p-2 text-orange" style={{ borderRadius: '50%' }}></i>
                                <div className="card-label text-center text-md-start text-lg-start">
                                    <h6 className='text-purple fw-bold text-center'>{user.onProgress}</h6>
                                    <p className="fs-7 fw-semibold d-none d-md-block">Hiring On Progress</p>
                                </div>
                            </div>
                            <div className="bg-clear shadow rounded d-flex flex-md-row flex-lg-row flex-column py-1 pt-2 gap-2 px-3 align-items-center">
                                <i className="fa-solid fa-briefcase fs-3 bg-orange-t p-2 text-orange" style={{ borderRadius: '50%' }}></i>
                                <div className="card-label text-center text-md-start text-lg-start">
                                    <h6 className='text-purple fw-bold text-center'>{user.hired}</h6>
                                    <p className="fs-7 fw-semibold d-none d-md-block">Job Hired</p>
                                </div>
                            </div>
                            <div className="bg-clear shadow rounded d-flex flex-md-row flex-lg-row flex-column py-1 pt-2 gap-2 px-3 align-items-center">
                                <i className="fa-solid fa-clipboard-check fs-3 px-2 bg-orange-t py-2 text-orange" style={{ borderRadius: '50%' }}></i>
                                <div className="card-label text-center text-md-start text-lg-start">
                                    <h6 className='text-purple fw-bold text-center'>{user.completed}</h6>
                                    <p className="fs-7 fw-semibold d-none d-md-block">Hiring Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default UserInfoBeranda