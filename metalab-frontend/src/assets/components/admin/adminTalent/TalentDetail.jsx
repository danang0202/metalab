import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import api from '../../../apiConfig/apiConfig';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import TableTalentHiring from './TableTalentHiring';
import Pagination from '../../pagination/Pagination';
import EnableDisabelButton from './EnableDisabelButton';
import Loading from './../../Loading'
import { apiURL } from '../../../main';

const TalentDetail = () => {
    const idTalent = useParams().idTalent;
    const token = Cookies.get('token_metalab');
    const [talent, setTalent] = useState();
    const [baseTalentHiring, setBaseTalentHiring] = useState([]);
    const [talentHiring, setTalentHiring] = useState([]);
    const [talentHiringLimit, setTalentHiringLimit] = useState([]);
    const [filter, setFilter] = useState('Hired');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [totalPage, setTotalPage] = useState(1);
    const [loading, setLoading] = useState();

    useEffect(() => {
        const fetchDataTalent = async () => {
            setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/talent/detail/${idTalent}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setTalent(response.data['talent'][[0]]);
                        setBaseTalentHiring(response.data['hiring']);
                    }
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    console.error('Error:', error);
                }
            }
        };
        fetchDataTalent();
    }, [])


    useEffect(() => {
        if (baseTalentHiring != null && baseTalentHiring.length != 0) {
            let array;
            array = baseTalentHiring.filter((item) => item.status == filter);
            if (array != null && array.length != 0) {
                setTalentHiring(array)
            } else {
                setTalentHiring([]);
            }
            setPage(1);
        }
    }, [filter, baseTalentHiring])

    useEffect(() => {
        const getTalentLimits = function (pages, limits) {
            if (talentHiring != null && talentHiring.length !== 0) {
                let array = [];
                for (let i = (pages - 1) * limits; i < (pages * limits) && i < talentHiring.length; i++) {
                    array.push(talentHiring[[i]])

                }
                setTalentHiringLimit(array);
                setTotalPage(Math.ceil(talentHiring.length / limit));
            } else {
                {
                    [
                        setTalentHiringLimit([])
                    ]
                }
            }
        }
        getTalentLimits(page, limit);
    }, [talentHiring, page, limit])

    const onPageChange = (value) => {
        if (value == '&laquo' || value == '... ') {
            setPage(1);
        } else if (value == '&lsaquo') {
            if (page != 1) {
                setPage(page - 1);
            }
        } else if (value == '&rsaquo') {
            if (page != totalPage) {
                setPage(page + 1);
            }
        } else if (value == '&raquo' || value == ' ...') {
            setPage(totalPage);
        } else {
            setPage(value);
        }
    }

    const handleChangeUserStatus = async (command) => {
        setLoading(true);
        if (command == 'makeDisable') {
            const response = await api.get(`/make-disable/${talent.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setTalent(response.data.user);
            }
        } else {
            const response = await api.get(`/make-enable/${talent.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setTalent(response.data.user);
            }
        }
        setLoading(false);
    }

    return (
        <>
            <div className="w-100 py-2">
                <div className="bg-light w-100 h-100" style={{ borderRadius: '2rem' }}>
                    <div className="container h-100 px-4 py-3" >
                        <div className="d-flex flex-column h-100">
                            <div className="header d-flex w-100 justify-content-between gap-3">
                                <h5>Talent Detail</h5>
                                <Link to={'/admin/talent'}>
                                    <i className="fa fa-arrow-left fs-4 text-danger bg-white rounded-5 p-1 hover-op6"></i>
                                </Link>
                            </div>
                            <div className="detail-container d-flex flex-lg-row flex-md-column my-2 px-3 py-2 rounded align-items-md-center align-items-lg-start">
                                <div className="profile-container bg-clear rounded-3 d-flex flex-column col-lg-4 py-md-3 align-items-center px-3" style={{ marginRight: '2rem' }}>
                                    <div className="avatar-container d-flex flex-column align-items-center gap-2">
                                        <img src={`${talent != null && talent.avatar ?  apiURL+'/storage/avatars/'+talent.avatar : '/images/avatar-default.png'}`} id="avatar"
                                            style={{ width: '6rem', height: '6rem', borderRadius: '50%', objectFit: 'cover' }}
                                            alt="avatar" />
                                        {talent != null && (
                                            <>
                                                <h6 className="name text-center rounded-5 px-3 py-1"> {talent.firstName} {talent.lastName}</h6>
                                                <span className={`badge rounded-pill ${talent.status == 'Enable' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{talent.status}</span>
                                            </>
                                        )}

                                    </div>
                                    <div className="info-profil mt-3 py-2">
                                        <h6>Talent Info</h6>
                                        <hr />
                                        {talent != null && (
                                            <table className='tabel-info-talent' style={{ borderCollapse: 'separate', borderSpacing: '0px 6px' }}>
                                                <tbody>
                                                    <tr>
                                                        <td className='fw-semibold' style={{ width:'8rem' }}>Email</td>
                                                        <td className='fw-semibold text-black-50'>{talent.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='fw-semibold' style={{ width:'8rem' }}>Phone Number</td>
                                                        <td className='fw-semibold text-black-50'>{talent.phoneNumber}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='fw-semibold' style={{ width:'8rem' }}>Gender</td>
                                                        <td className='fw-semibold text-black-50'>{talent.gender}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='fw-semibold' style={{ width:'8rem' }}>Birth Date</td>
                                                        {talent.ttl ? (
                                                            <td className='fw-semibold text-black-50'>{talent.ttl}</td>
                                                        ) : (
                                                            <td className='text-danger px-2 fw-semibold'>Birth date not set</td>
                                                        )}

                                                    </tr><tr>
                                                        <td className='fw-semibold' style={{ width:'8rem' }}>Address</td>
                                                        {talent.address ? (
                                                            <td>{talent.address}</td>
                                                        ) : (
                                                            <td className='text-danger px-2 fw-semibold'>Address not set</td>
                                                        )}

                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                    {talent && (
                                        <div className="action d-flex flex-row gap-3 mt-3">
                                            <span className='fw-semibold'>Action :</span>
                                            <EnableDisabelButton userStatus={talent.status} handleChangeUserStatus={handleChangeUserStatus} />
                                        </div>
                                    )}

                                </div>
                                <div className="talent-hiring col-lg-8  col-md-12 h-100">
                                    <div className="filter-container d-flex flex-row gap-4 justify-content-center">
                                        <span className={`btn btn-sm hover-op6 text-light ${filter == 'On Progress' ? 'bg-blue ' : 'bg-orange'}`} onClick={() => setFilter('On Progress')}><i className="fa-solid fa-spinner me-2"></i>On Progress</span>
                                        <span className={`btn btn-sm hover-op6 text-light ${filter == 'Hired' ? 'bg-blue ' : 'bg-orange'}`} onClick={() => setFilter('Hired')}><i className="fa-brands fa-get-pocket me-2"></i>Hired</span>
                                        <span className={`btn btn-sm hover-op6 text-light ${filter == 'Completed' ? 'bg-blue ' : 'bg-orange'}`} onClick={() => setFilter('Completed')}><i className="fa-solid fa-receipt me-2"></i> Completed</span>
                                        <span className={`btn btn-sm hover-op6 text-light ${filter == 'Rejected' ? 'bg-blue ' : 'bg-orange'}`} onClick={() => setFilter('Rejected')}><i className="fa-solid fa-circle-xmark me-2"></i>Rejected</span>
                                    </div>
                                    <div className="table-container mt-3">
                                        <TableTalentHiring filter={filter} hiring={talentHiringLimit} />
                                    </div>
                                    <div className="pagination d-flex justify-content-end mt-2">
                                        <Pagination totalPage={totalPage} page={page} limit={limit} siblings={1} onPageChange={onPageChange} setLimit={setLimit} setPage={setPage} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            {loading && (
                <Loading />
            )}
        </>
    )
}
export default TalentDetail