import { apiURL } from '../../../main'
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../../../apiConfig/apiConfig';
import Cookies from 'js-cookie';
import FullHiredWarning from './FullHiredWarning';
import Decision from './Decision';
import { Link } from 'react-router-dom';
import DecisionButton from './DecisionButton';
import NotifFloatAdmin from '../NotifFloatAdmin';
import Loading from '../../Loading';

const FourthStageAdmin = (props) => {

    const job = props.job;
    const hiring = props.hiring;
    const setLastStage = props.setLastStage;
    const token = Cookies.get('token_metalab');
    const [talent, setTalent] = useState();
    const [client, setClient] = useState();
    const setTahapEmpat = props.setTahapEmpat;
    const tahapEmpat = props.tahapEmpat;
    const [loading, setLoading] = useState();
    const [failNotif, setFailNotif] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/talent/${hiring.talentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setTalent(response.data.talent);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchDataTahapEmpat = async () => {
            if (hiring.fourthStageId) {
                try {
                    const response = await api.get(`/fourth-stage/${hiring.fourthStageId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log(response);
                    if (response.status === 200) {
                        setTahapEmpat(response.data.tahapEmpat);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

        };
        fetchData();
        fetchDataTahapEmpat();
    }, [])


    useEffect(() => {
        if (job) {
            const fetchData = async () => {
                try {
                    const response = await api.get(`/client/${job.clientId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setClient(response.data.clients);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            fetchData();
        }
    }, [job]);


    const decisionSubmit = async (status) => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('status', status);
            data.append('idHiring', hiring.id);
            data.append('idJob', job.id);
            const response = await api.post(`/fourth-stage/input-decision-admin`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status == 200) {
                setTahapEmpat(response.data.tahapEmpat);
                if (response.data.tahapEmpat.status == 'Accepted') {
                    setLastStage('Hired');
                    hiring.status = 'Hired';
                }
            }
        } catch (error) {
            console.log(error);
            setFailNotif('Fail to submit decision');
        } finally {
            setLoading(false)
            setTimeout(() => {
                setFailNotif('');
            }, 3000);
        }


    }

    useEffect(() => {
        console.log(tahapEmpat);
    }, [tahapEmpat])

    return (
        <>
            {client && talent && (
                <>
                    {failNotif && (
                        <NotifFloatAdmin status="fail" text={failNotif} />
                    )}
                    <div className="mt-3 hiring-info-container w-100 d-flex justify-content-center bg-clear border rounded shadow-sm py-4">
                        <div className="d-flex flex-row align-items-center gap-4">
                            <div className="left d-flex flex-column gap-3 shadow bg-clear" style={{ paddingBottom: '2rem', minWidth: '18rem' }}>
                                <img
                                    className="card-img-top w-100 d-block"
                                    src={`${apiURL}/storage/client/${client.companyLogo}`}
                                    style={{ borderBottom: '5px solid  #702F8A', height: '10rem', objectFit: 'cover', borderRadius: '0.2rem .2rem 0rem 0rem' }}
                                />
                                <div className="header">
                                    <Link className='text-decoration-none text-dark hover-op6' to={`/admin/client/detail/${client.id}`} >
                                        <h5 className='text-center'>{client.companyName}</h5>
                                    </Link>
                                    <h6 className='text-center text-secondary'>{client.companyEmail}</h6>
                                </div>
                                <table style={{ borderCollapse: 'collapse', lineHeight: '2rem' }}>
                                    <tr>
                                        <td className='px-3 fw-semibold'><i className="fa-solid fa-user me-2"></i>Name</td>
                                        <td className='px-3'>{client.picName}</td>
                                    </tr>
                                    <tr>
                                        <td className='px-3 fw-semibold'><i className="fa-solid fa-envelope me-2"></i>Email</td>
                                        <td className=' px-3'>{client.picEmail}</td>
                                    </tr>
                                    <tr>
                                        <td className='px-3 fw-semibold'><i className="fa-solid fa-phone me-2"></i>Phone</td>
                                        <td className='px-3'>{client.picPhoneNumber}</td>
                                    </tr>
                                </table>
                            </div>
                            <i className="fa-solid fa-arrows-left-right fs-1"></i>
                            <div className="right" style={{ minWidth: '18rem' }}>
                                <div className="left shadow d-flex flex-column gap-3 bg-clear" style={{ paddingBottom: '2rem' }}>
                                    <img
                                        className="card-img-top w-100 d-block"
                                        src={`${talent.avatar ? apiURL + '/storage/avatars/' + talent.avatar : '/images/avatar-default.png'}`}
                                        style={{ borderBottom: '5px solid  #702F8A', height: '10rem', objectFit: 'cover', borderRadius: '0.2rem .2rem 0rem 0rem' }}
                                    />
                                    <div className="header">
                                        <Link className='text-decoration-none text-dark hover-op6' to={`/admin/talent/detail/${talent.id}`} >
                                            <h5 className='text-center'>{talent.firstName} {talent.lastName}</h5>
                                        </Link>
                                        <h6 className='text-center text-secondary'>{talent.email}</h6>
                                    </div>
                                    <table style={{ borderCollapse: 'collapse', lineHeight: '2rem' }}>
                                        <tr>
                                            <td className='px-3 fw-semibold'><i className="fa-solid fa-phone me-2"></i>Phone</td>
                                            <td className='px-3'>{talent.phoneNumber}</td>
                                        </tr>
                                        <tr>
                                            <td className='px-3 fw-semibold'><i className="fa-solid fa-venus-mars me-1"></i>Gender</td>
                                            <td className='px-3'><span className={`badge rounded-pill ${talent.gender == 'Male' ? 'bg-blue-t text-blue' : 'bg-orange-t text-orange'}`}>{talent.gender}</span></td>
                                        </tr>
                                        <tr>
                                            <td className='px-3 fw-semibold'><i className="fa-solid fa-flag me-2"></i>Status</td>
                                            <td className='px-3'><span className={`badge rounded-pill ${talent.status == 'Enable' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{talent.status}</span></td>
                                        </tr>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                    {!tahapEmpat && (
                        <>
                            <hr className="my-3 px-3" />
                            <h5 className="text-center fw-bold p-1">Interview Stage Result</h5>
                            <DecisionButton decisionSubmit={decisionSubmit} jobStatus={job.status} />
                        </>
                    )
                    }
                    {tahapEmpat && tahapEmpat.status != 'Pending' && (
                        <Decision status={tahapEmpat.status} />
                    )}

                </>
            )}
            {loading &&
                < Loading />
            }

        </>
    )
}

export default FourthStageAdmin