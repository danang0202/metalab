import { useEffect } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import api from '../../../apiConfig/apiConfig';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { apiURL } from '../../../main';
import { Link } from 'react-router-dom';
import StepLine from '../StepLine';
import Loading from '../../Loading';


const HiringDetailLayout = () => {
    const userEmail = Cookies.get('email_metalab');
    const token = Cookies.get('token_metalab');
    const navigate = useNavigate();
    const idHiring = useParams().idHiring;
    const [hiring, setHiring] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Cookies.get('email_metalab') == null) {
            navigate('/login');
        }
    }, [])

    useEffect(() => {
        if (userEmail == null) {
            navigate('/job');
        }

        const fetchHiringDetail = async () => {
            setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/hiring/detail/${idHiring}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setHiring(response.data.hiring[0])
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setLoading(false);
                }
            }
        }
        fetchHiringDetail();
    }, [])

    return (
        <>
            {hiring && (
                <div className="hiring-detail-container container d-flex justify-content-center w-100">
                    <div className=" mb-3 col-lg-7 col-md-11 col-12" style={{ marginTop: '20px' }}>
                        <div className="border rounded p-md-4 p-2 py-3 shadow-sm">
                            <div className="d-flex flex-lg-row flex-md-row flex-row gap-md-4 gap-3 align-items-start">
                                <div className="company-logo">
                                    <img src={`${apiURL}/storage/client/${hiring.job.client.companyLogo}`} className="rounded " alt="" style={{ width: '9rem', height: '9rem', objectFit: 'cover' }} />
                                </div>
                                <div className="d-flex flex-column w-100">
                                    <div className="hiring-detail-container d-flex flex-row justify-content-between w-100">
                                        <div className="description mt-2 d-flex flex-column justify-content-between">
                                            <h5 className="job-name">{hiring.job.name}</h5>
                                            <h6 className="fw-normal text-secondary company-name" style={{ fontSize:'0.9rem' }}>{hiring.job.client.companyName}</h6>
                                            <div className="d-flex flex-row gap-3">
                                                <h6><span className={`badge rounded-pill ${hiring.job.type === 'Full Time' ? 'bg-blue-t text-blue' : hiring.job.type === 'Freelance' ? 'bg-purple-t text-purple' : 'bg-orange-t text-orange'}`}>{hiring.job.type}</span></h6>
                                                <h6><span className={`badge rounded-pill ${hiring.job.status === 'Vacant' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{hiring.job.status}</span></h6>
                                            </div>
                                        </div>
                                        <div className="inner-box d-flex flex-column">
                                            <div className="d-flex flex-row justify-content-between h-100">
                                                <div className="box d-flex flex-column align-items-end">
                                                    <p className={`mt-2 badge rounded-pill ${hiring.status === 'On Progress' ? 'bg-blue' : hiring.status === 'Completed' ? 'bg-purple' : hiring.status === 'Rejected' ? 'bg-danger' : hiring.status == 'Hired' ? 'bg-green' : 'bg-orange'}`}>{hiring.status}</p>
                                                    <Link to={`/jobs/detail/${hiring.job.id}`}>
                                                        <a className="btn-detail btn bg-blue btn-sm text-light d-inline-block hover-op6" role="button">
                                                            <i className="fa-solid fa-circle-info me-2"></i>
                                                            Detail
                                                        </a>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex d-none d-lg-block">
                                        <div className="inner-box d-flex flex-column col-12">
                                            <StepLine item={hiring} mobile={false} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex d-block d-md-block d-lg-none p-0" >
                                <div className="inner-box d-flex flex-column col-12">
                                    <StepLine item={hiring} mobile={true} />
                                </div>
                            </div>
                        </div>

                        {/* ADDMINISTRASI */}

                        <div className="border rounded p-4 shadow-sm" style={{ marginTop: '20px' }}>
                            <h5 className="fw-bold mx5 ">Test Stage</h5>

                            <div className="rounded p-lg-3 p-md-3 p-1" style={{ marginTop: '10px', border: '1px solid grey' }}>
                                <div className="d-flex flex-md-row flex-lg-row flex-column gap-4 px-2 align-hirings-center">
                                    <div>
                                        <img src={`/public/images/data.svg`} className="mt-2 mt-md-0 border rounded stage-img " alt="" style={{ width: '5rem', height: '5rem' }} />
                                    </div>
                                    <div className="w-100 d-flex flex-row justify-content-between">
                                        <div className="d-flex flex-column gap-3">
                                            <h6 className="fw-bold m-0">Administration Stage</h6>
                                            <Link to={`${hiring.lastStage >= 1 ? '/hiring/detail/' + hiring.id + '/' + hiring.jobId + '/first-stage/' + hiring.firstStageId : ''}`}>
                                                <a className="icon-link text-blue">
                                                    Recrutment Detail
                                                    <img src="/public/images/arrow.svg" alt="-->" />
                                                </a>
                                            </Link>
                                        </div>
                                        <div className="d-flex flex-column gap-3 justify-content-between">
                                            <div className="d-flex text-end align-items-center">
                                                <p className={`mb-1 fw-bold ${hiring.lastStage > 1 ? 'text-green' : hiring.lastStage === 1 ? 'text-orange' : 'text-secondary'}`}>{hiring.lastStage > 1 ? 'Completed' : hiring.lastStage === 1 ? 'Pending' : 'Waiting'}</p>
                                                {hiring.lastStage > 1 ? (
                                                    <img src="/public/images/check.svg" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                ) : hiring.lastStage === 1 ? (
                                                    <img src="/public/images/rotate.svg" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                ) : (
                                                    <img src="/public/images/loading_6356630.png" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                )}

                                            </div>
                                            <div className="text-end">
                                                <Link to={`${hiring.lastStage >= 1 ? '/hiring/detail/' + hiring.id + '/' + hiring.jobId + '/first-stage/' + hiring.firstStageId : ''}`}>
                                                    <a className={`btn rounded btn-sm text-light mb-2 ${hiring.lastStage > 1 ? 'btn bg-green hover-op6' : hiring.lastStage === 1 ? 'btn-warning' : 'btn-secondary'}`} role="button">
                                                        <i className="fa-solid fa-circle-info me-2"></i>
                                                        Detail
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TEST KOMPETENSI */}

                            <div className="rounded p-lg-3 p-md-3 p-2" style={{ marginTop: '10px', border: '1px solid grey' }}>
                                <div className="d-flex flex-md-row flex-lg-row flex-column gap-4 px-2 align-hirings-center">
                                    <div>
                                        <img src={`/public/images/test.svg`} className="p-1 border rounded stage-img" alt="" style={{ width: '5rem', height: '5rem' }} />
                                    </div>
                                    <div className="w-100 d-flex flex-row justify-content-between">
                                        <div className="d-flex flex-column gap-3">
                                            <h6 className="fw-bold m-0">Competency Stage</h6>
                                            <Link to={`${hiring.lastStage >= 2 ? '/hiring/detail/' + hiring.id + '/' + hiring.jobId + '/second-stage/' + hiring.secondStageId : ''}`}>
                                                <a className="icon-link text-blue">
                                                    Recrutment Detail
                                                    <img src="/public/images/arrow.svg" alt="-->" />
                                                </a>
                                            </Link>
                                        </div>
                                        <div className="d-flex flex-column gap-3 justify-content-between">
                                            <div className="d-flex text-end align-items-center">
                                                <p className={`mb-1 fw-bold ${hiring.lastStage > 2 ? 'text-green' : hiring.lastStage === 2 ? 'text-orange' : 'text-secondary'}`}>{hiring.lastStage > 2 ? 'Completed' : hiring.lastStage === 2 ? 'Pending' : 'Waiting'}</p>
                                                {hiring.lastStage > 2 ? (
                                                    <img src="/public/images/check.svg" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                ) : hiring.lastStage === 2 ? (
                                                    <img src="/public/images/rotate.svg" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                ) : (
                                                    <img src="/public/images/loading_6356630.png" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                )}

                                            </div>
                                            <div className="text-end">
                                                <Link to={`${hiring.lastStage >= 2 ? '/hiring/detail/' + hiring.id + '/' + hiring.jobId + '/second-stage/' + hiring.secondStageId : ''}`}>
                                                    <a className={`btn rounded btn-sm text-light mb-2 ${hiring.lastStage > 2 ? 'bg-green hover-op6' : hiring.lastStage === 2 ? 'btn-warning' : 'btn-secondary'}`} role="button">
                                                        <i className="fa-solid fa-circle-info me-2"></i>
                                                        Detail
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* WAWANCARA */}
                            <div className="rounded p-lg-3 p-md-3 p-2" style={{ marginTop: '10px', border: '1px solid grey' }}>
                                <div className="d-flex flex-md-row flex-lg-row flex-column gap-4 px-2 align-hirings-center">
                                    <div>
                                        <img src={`/public/images/interview.svg`} className="p-1 border rounded stage-img" alt="" style={{ width: '5rem', height: '5rem' }} />
                                    </div>
                                    <div className="w-100 d-flex flex-row justify-content-between">
                                        <div className="d-flex flex-column gap-3 align-items-start">
                                            <h6 className="fw-bold m-0">Interview Stage</h6>
                                            <Link to={`${hiring.lastStage >= 3 ? '/hiring/detail/' + hiring.id + '/' + hiring.jobId + '/third-stage/' + hiring.thirdtageId : ''}`}>
                                                <a className="icon-link text-blue">
                                                    Recrutment Detail
                                                    <img src="/public/images/arrow.svg" alt="-->" />
                                                </a>
                                            </Link>
                                        </div>
                                        <div className="d-flex flex-column gap-3 justify-content-between">
                                            <div className="d-flex text-end">
                                                <p className={`mb-1 fw-bold ${hiring.lastStage > 3 || hiring.status === 'Hired' || hiring.status === 'Completed' ? 'text-green' : hiring.lastStage === 3 ? 'text-orange' : 'text-secondary'}`}>{hiring.lastStage > 3 || hiring.status === 'Hired' || hiring.status === 'Completed' ? 'Completed' : hiring.lastStage === 3 ? 'Pending' : 'Waiting'}</p>
                                                {hiring.lastStage > 3 || hiring.status === 'Hired' || hiring.status === 'Completed' ? (
                                                    <img src="/public/images/check.svg" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                ) : hiring.lastStage === 3 ? (
                                                    <img src="/public/images/rotate.svg" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                ) : (
                                                    <img src="/public/images/loading_6356630.png" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                )}

                                            </div>
                                            <div className="text-end">
                                                <Link to={`${hiring.lastStage >= 3 ? '/hiring/detail/' + hiring.id + '/' + hiring.jobId + '/third-stage/' + hiring.thirdtageId : ''}`}>
                                                    <a className={`btn rounded btn-sm text-light mb-2 ${hiring.lastStage > 3 || hiring.status === 'Hired' || hiring.status === 'Completed' ? 'bg-green hover-op6' : hiring.lastStage === 3 ? 'btn-warning' : 'btn-secondary'}`} role="button">
                                                        <i className="fa-solid fa-circle-info me-2"></i>
                                                        Detail
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* MATCHING */}
                            {hiring.job.type === 'Freelance' && (
                                <div className="rounded p-lg-3 p-md-3 p-2" style={{ marginTop: '10px', border: '1px solid grey' }}>
                                    <div className="d-flex flex-md-row flex-lg-row flex-column gap-4 px-2 align-hirings-center">
                                        <div>
                                            <img src={`/public/images/shuffle.svg`} className="p-1 border rounded stage-img" alt="" style={{ width: '5rem', height: '5rem' }} />
                                        </div>
                                        <div className="w-100 d-flex flex-row justify-content-between">
                                            <div className="d-flex flex-column gap-3">
                                                <h6 className="fw-bold m-0">Matching Stage</h6>
                                                <Link to={`${hiring.lastStage >= 4 ? '/hiring/detail/' + hiring.id + '/' + hiring.jobId + '/fourth-stage/' + hiring.fourthStageId : ''}`}>
                                                    <a className="icon-link text-blue">
                                                        Recrutment Detail
                                                        <img src="/public/images/arrow.svg" alt="-->" />
                                                    </a>
                                                </Link>
                                            </div>
                                            <div className="d-flex flex-column gap-3 justify-content-between">
                                                <div className="d-flex text-end align-items-center">
                                                    <p className={`mb-1 fw-bold ${hiring.lastStage > 4 || hiring.status === 'Hired' || hiring.status === 'Completed' ? 'text-green' : hiring.lastStage === 4 ? 'text-orange' : 'text-secondary'}`}>{hiring.lastStage > 4 || hiring.status === 'Hired' || hiring.status === 'Completed' ? 'Completed' : hiring.lastStage === 4 ? 'Pending' : 'Waiting'}</p>
                                                    {hiring.lastStage > 4 || hiring.status === 'Hired' || hiring.status === 'Completed' ? (
                                                        <img src="/public/images/check.svg" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                    ) : hiring.lastStage === 4 ? (
                                                        <img src="/public/images/rotate.svg" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                    ) : (
                                                        <img src="/public/images/loading_6356630.png" alt="Check Icon" className="ml-2 mb-1 px-2" style={{ marginLeft: '2px', width: '2.5rem' }} />
                                                    )}

                                                </div>
                                                <div className="text-end">
                                                    <Link to={`${hiring.lastStage >= 4 ? '/hiring/detail/' + hiring.id + '/' + hiring.jobId + '/fourth-stage/' + hiring.fourthStageId : ''}`}>
                                                        <a className={`btn rounded btn-sm text-light mb-2 ${hiring.lastStage > 4 || hiring.status === 'Hired' || hiring.status === 'Completed' ? 'bg-green' : hiring.lastStage === 4 ? 'btn-warning' : 'btn-secondary'}`} role="button">
                                                            <i className="fa-solid fa-circle-info me-2"></i>
                                                            Detail
                                                        </a>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {loading && (
                <Loading />
            )}
        </>
    )
}

export default HiringDetailLayout