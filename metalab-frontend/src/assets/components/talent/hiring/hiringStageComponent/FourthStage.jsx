import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState } from 'react';
import api from '../../../../apiConfig/apiConfig';
import HeaderForm from '../formApplyComponent/HeaderForm';
import { apiURL } from '../../../../main';
import Loading from '../../../Loading';
import Decision from './Decision';
import { Link } from 'react-router-dom';
import StepLine from '../../StepLine';
import HeaderStage from './HeaderStage';

const FourthStage = () => {
    const [job, setJob] = useState();
    const [loading, setLoading] = useState(false);
    const token = Cookies.get('token_metalab');
    const jobId = useParams().jobId;
    const idTahapEmpat = useParams().id;
    const [client, setClient] = useState();
    const [talent, setTalent] = useState();
    const [tahapEmpat, setTahapEmpat] = useState();
    const [hiring, setHiring] = useState();

    useEffect(() => {
        const fetchDataJob = async () => {
            setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/job/${jobId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setJob(response.data.jobs);
                        let hiringTemp = {
                            job: response.data.jobs,
                            lastStage: 4
                        }
                        setHiring(hiringTemp);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/fourth-stage/${idTahapEmpat}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setTahapEmpat(response.data.tahapEmpat);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchProfil = async () => {
            try {
                setLoading(true);
                const response = await api.get('/profil', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setTalent(response.data.user);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchProfil();
        if (idTahapEmpat != 'null') {
            console.log(idTahapEmpat);
            fetchData();
        }
        fetchDataJob();
    }, []);


    useEffect(() => {
        if (job) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await api.get(`/client/${job.clientId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setClient(response.data.clients);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setLoading(false);
                }
            }

            fetchData();
        }
    }, [job]);

    return (
        <>
            <div className="hiring-detail-container container mb-3 col-lg-6 col-md-11 mt-4">
                {job && hiring && (
                    <HeaderStage job={job} hiring={hiring} />
                )}
                <div className="border rounded p-2 p-lg-4 shadow mt-4 py-md-0 py-3">
                    <h5 className="text-center fw-bold">Matching Test</h5>
                    {client && talent && (
                        <div className="container-fluid mt-3">
                            <div className="mt-md-5 mt-0 hiring-info-container w-100 d-flex justify-content-center">
                                <div className="d-flex flex-md-row flex-column align-items-center gap-4">
                                    <div className="left d-flex flex-column gap-3 bg-clear rounded" style={{ paddingBottom: '2rem', minWidth: '18rem', border: '1px solid grey' }}>
                                        <img
                                            className="card-img-top w-100 d-block"
                                            src={`${apiURL}/storage/client/${client.companyLogo}`}
                                            style={{ borderBottom: '5px solid  #702F8A', height: '10rem', objectFit: 'cover', borderRadius: '0.2rem .2rem 0rem 0rem' }}
                                        />
                                        <div className="header">
                                            <h5 className='text-center'>{client.companyName}</h5>
                                            <h6 className='text-center text-secondary'>{client.companyEmail}</h6>
                                        </div>
                                        <table style={{ borderCollapse: 'collapse', lineHeight: '2rem' }}>
                                            <tr>
                                                <td className='ps-3 fw-semibold'><i className="fa-solid fa-user me-2"></i>Name</td>
                                                <td className=''>{client.picName}</td>
                                            </tr>
                                            <tr>
                                                <td className='ps-3 fw-semibold'><i className="fa-solid fa-envelope me-2"></i>Email</td>
                                                <td className=''>{client.picEmail}</td>
                                            </tr>
                                            <tr>
                                                <td className='ps-3 fw-semibold'><i className="fa-solid fa-phone me-2"></i>Phone</td>
                                                <td className=''>{client.picPhoneNumber}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <i className="d-none d-md-block fa-solid fa-arrows-left-right fs-1"></i>
                                    <i className="d-block d-md-none fa-solid fa-arrows-up-down  fs-1"></i>
                                    <div className="right" style={{ minWidth: '18rem' }}>
                                        <div className="left d-flex flex-column gap-3 bg-clear rounded" style={{ paddingBottom: '2rem', border: '1px solid grey' }}>
                                            <img
                                                className="card-img-top w-100 d-block"
                                                src={`${talent.avatar ? apiURL + '/storage/avatars/' + talent.avatar : '/images/avatar-default.png'}`}
                                                style={{ borderBottom: '5px solid  #702F8A', height: '10rem', objectFit: 'cover', borderRadius: '0.2rem .2rem 0rem 0rem' }}
                                            />
                                            <div className="header">
                                                <h5 className='text-center'>{talent.firstName} {talent.lastName}</h5>
                                                <h6 className='text-center text-secondary'>{talent.email}</h6>
                                            </div>
                                            <table style={{ borderCollapse: 'collapse', lineHeight: '2rem' }}>
                                                <tr>
                                                    <td className='ps-3 fw-semibold'><i className="fa-solid fa-phone me-2"></i>Phone</td>
                                                    <td className=''>{talent.phoneNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td className='ps-3 fw-semibold'><i className="fa-solid fa-venus-mars me-1"></i>Gender</td>
                                                    <td className=''><span className={`badge rounded-pill ${talent.gender == 'Male' ? 'bg-blue-t text-blue' : 'bg-orange-t text-orange'}`}>{talent.gender}</span></td>
                                                </tr>
                                                <tr>
                                                    <td className='ps-3 fw-semibold'><i className="fa-solid fa-flag me-2"></i>Status</td>
                                                    <td className=''><span className={`badge rounded-pill ${talent.status == 'Enable' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{talent.status}</span></td>
                                                </tr>
                                            </table>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {(!tahapEmpat) && (
                    <Decision status="Pending" />
                )}
                {(tahapEmpat && tahapEmpat.status == 'Pending') && (
                    <Decision status="Pending" />
                )}
                {tahapEmpat && tahapEmpat.status != 'Pending' && (
                    <Decision status={tahapEmpat.status} />
                )}
            </div>
            {loading && (
                <Loading />
            )}
        </>
    )
}

export default FourthStage