import { Link } from 'react-router-dom'
import EnableDisabelButton from './EnableDisabelButton';
import api from '../../../apiConfig/apiConfig';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { apiURL } from '../../../main';

const TalentDetailSideScreen = (props) => {
    const item = props.item;
    const setSelectedTalent = props.setSelectedTalent;
    const token = Cookies.get('token_metalab');
    const [loading, setLoading] = useState(false);
    const handleChangeUserStatus = props.handleChangeUserStatus;

    return (
        <>
            {item && (
                <div className="talent-detail bg-clear px-3 h-100 pt-2" style={{ width: '250px' }}>
                    <div className="avatar-container mb-4 d-flex flex-column align-items-center gap-2 w-100">
                        <img src={`${item.avatar ? apiURL+'/storage/avatars/'+item.avatar : '/images/avatar-default.png'}`} id="avatar"
                            style={{ width: '6rem', height: '6rem', borderRadius: '50%', objectFit: 'cover' }}
                            alt="avatar" />
                        <h6 className="name text-center rounded-5 px-3 py-1">{item.firstName} {item.lastName}</h6>
                        <span className={`badge rounded-pill ${item.status == 'Enable' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{item.status}</span>
                    </div>
                    <h6>Talent Info</h6>
                    <hr />
                    <div className="info-user d-flex flex-column px-2 gap-3 mt-3">
                        <div className="info-item d-flex flex-row gap-3 align-items-center">
                            <i className="fa-solid fa-envelope text-blue"></i>
                            <span className=' bg-light rounded-1 px-2 py-1'>{item.email}</span>
                        </div>
                        <div className="info-item d-flex flex-row gap-3 align-items-center">
                            <i className="fa-solid fa-phone text-blue"></i>
                            <span className=' bg-light rounded-1 px-2 py-1'> {item.phoneNumber}</span>
                        </div>
                        <div className="info-item d-flex flex-row gap-3 align-items-center">
                            <i className="fa-solid fa-venus-mars text-blue"></i>
                            <span className={` badge rounded-pill ${item.gender == 'Male' ? 'bg-blue-t text-blue' : 'bg-orange-t text-orange'}`}>{item.gender}</span>
                        </div>
                        <div className="info-item d-flex flex-row gap-3 align-items-center">
                            <i className="fa-solid fa-calendar-days text-blue"></i>
                            {item.ttl ? (
                                <span className=' bg-light rounded-1 px-2 py-1'>{item.ttl}</span>
                            ) : (
                                <span className=' text-danger bg-light rounded-1 px-2 py-1'>Not set</span>
                            )}
                        </div>
                        <div className="info-item d-flex flex-row gap-3 align-items-center">
                            <i className="fa-solid fa-location-dot text-blue"></i>
                            {item.address ? (
                                <span className='bg-light rounded-1 px-2 py-1'>{item.address}</span>
                            ) : (
                                <span className='text-danger bg-light rounded-1 px-2 py-1'>Not set</span>
                            )}
                        </div>
                    </div>
                    <div className=" mt-4 detail-user-button text-center">
                        <Link to={`/admin/talent/detail/${item.id}`}>
                            <span className='btn text-light hover-op6 btn-sm bg-blue px-2 py-1'><i className="fa-solid fa-circle-info me-2"></i>Rincian</span>
                        </Link>
                    </div>
                    <div className="px-3 mt-4 action d-flex flex-row gap-3 justify-content-center align-items-center">
                        <span className='fw-semibold '>Action : </span>
                        <EnableDisabelButton userStatus={item.status} handleChangeUserStatus={handleChangeUserStatus} />
                    </div>
                </div>
            )}


        </>
    )
}

export default TalentDetailSideScreen