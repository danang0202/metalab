import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import api from '../../../apiConfig/apiConfig';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { apiURL, formatDateContract, formattedSalary } from '../../../main';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Loading';


const JobDetail = () => {
    const { idJob } = useParams();
    const [job, setJob] = useState({});
    const token = Cookies.get('token_metalab');
    const idTalent = Cookies.get('id_metalab');
    const [disabled, setDisabled] = useState(false);
    const [applied, setApplied] = useState();
    const navigate = useNavigate();
    const [hiringCheck, setHiringCheck] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/job/detail/${idJob}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setJob(response.data.job[0]);
                    if (response.data.job[0].status == 'Full Hired' || response.data.job[0].status == 'Closed' || response.data.job[0].status == 'Disable') {
                        setDisabled(true);
                    }
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                console.error('Error:', error);
            }
        };

        const check = async () => {
            if (idTalent) {
                try {

                    const data = {
                        idTalent: idTalent,
                        idJob: idJob,
                    }
                    const response = await api.post(`/check-hiring-by-user-and-job`, data, {
                    });
                    if (response.status == 200) {
                        setApplied(response.data.hiring.id);
                        setDisabled(true);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

        };

        fetchData();
        check();
    }, [])


    useEffect(() => {
        if (job) {
            let currentDate = new Date();
            if (currentDate > new Date(job.lastApplyDate)) {
                setDisabled(true);
            }

        }
    }, [job])

    const goToFormApply = (link) => {
        const check = async () => {
            try {
                const data = {
                    idTalent: idTalent
                }
                const response = await api.post(`/check-hiring-full-time-constrain`, data, {
                });
                console.log(response);
                if (response.status == 200) {
                    setHiringCheck(response.data.hiring);
                    window.scrollTo(0, 0);
                } else if (response.status == 204) {
                    sessionStorage.setItem('idJob', job.id);
                    navigate(link);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        if (Cookies.get('email_metalab') == null) {
            navigate(`/login`)
        } else if (job.type != 'Freelance') {
            check();
        } else {
            sessionStorage.setItem('idJob', job.id);
            navigate(link);
        }

    }

    const remainingDays = (kontrakStartString, kontrakEndString) => {
        const currentDate = new Date()
        const kontrakStart = new Date(kontrakStartString);
        const kontrakEnd = new Date(kontrakEndString);
        if (currentDate < kontrakStart) {
            // Hari ini lebih awal dari kontrakStart
            return (Math.ceil((kontrakEnd - kontrakStart) / (1000 * 60 * 60 * 24)));
        } else if (currentDate >= kontrakStart && currentDate <= kontrakEnd) {
            // Hari ini di antara kontrakStart dan kontrakEnd
            return (Math.ceil((kontrakEnd - currentDate) / (1000 * 60 * 60 * 24)));
        } else {
            return (0);
        }
    }

    return (
        <>

            {job.client != null && (
                <div className="m-3 col-lg-8  col-11 col-md-11 m-auto pt-4 bg-clear " style={{ textAlign: 'justify' }}>
                    {hiringCheck && (
                        <div className="alert alert-warning" role="alert">
                            <h5>Please, read this Warning !</h5>
                            You cannot register for Full-Time and Part-Time jobs because you are still registered in the following hiring:
                            <div className="d-flex flex-row justify-content-between">
                                <div className="box">
                                    <div className="box d-flex flex-row gap-5 mt-3">
                                        <h6 style={{ minWidth: '6rem' }}>Job Name</h6>
                                        <span className='fw-semibold'>{hiringCheck.job.name}</span>
                                    </div>
                                    <div className="box d-flex flex-row gap-5">
                                        <h6 style={{ minWidth: '6rem' }}>Job Type</h6>
                                        <div><span className='badge bg-orange rounded-pill '>{hiringCheck.job.type}</span></div>
                                    </div>
                                    <div className="box d-flex flex-row gap-5">
                                        <h6 style={{ minWidth: '6rem' }}>Hiring Status</h6>
                                        <div><span className={`badge rounded-pill ${hiringCheck.status == 'Hired' ? 'bg-green' : 'bg-blue text-light'}`}>{hiringCheck.status}</span></div>
                                    </div>
                                    {hiringCheck.status == 'Hired' && (
                                        <div className="box d-flex flex-row gap-5">
                                            <h6 style={{ minWidth: '6rem' }}>Remaining</h6>
                                            <span className={`fw-semibold text-green`}>{remainingDays(hiringCheck.job.kontrakStart, hiringCheck.job.kontrakEnd)} days</span>
                                        </div>
                                    )}
                                </div>
                                <Link to={`/hiring/detail/${hiringCheck.id}`}>
                                    <div className="button me-5 mt-5">
                                        <span className='btn bg-blue text-light hover-op6 btn-sm'><i className="fa-solid fa-circle-info me-2"></i>Click for Details</span>
                                    </div>
                                </Link>
                            </div>

                        </div>
                    )}
                    <div className="card-body">
                        <div className="d-flex flex-row mb-3 align-items-center  justify-content-center">
                            <div className="align-items-center align-content-center col-2 d-lg-block d-md-none d-none">
                                <img src={`${apiURL}/storage/client/${job.client.companyLogo}`} alt="" className='rounded' style={{ width: '10rem', height: "10rem", objectFit: 'cover' }} />
                            </div>
                            <div className="col-lg-10 col-md-12 col-11">
                                <div className="table-responsive">
                                    <div className="w-100 d-flex flex-row justify-content-between mb-lg-0 mb-md-2 mb-2">
                                        {applied && (
                                            <div className="box">
                                                <span className='bg-green-t badge text-green rounded-pill'><i className="fa-solid fa-bell me-2"></i>You have applied for this job !</span>
                                            </div>
                                        )}
                                        {applied && (
                                            <Link to={`/hiring/detail/${applied}`}>
                                                <span className='btn btn-sm bg-blue text-light hover-op6'>Hiring<i className="fa-solid fa-arrow-right ms-2"></i></span>
                                            </Link>
                                        )}
                                    </div>
                                    <div className="box w-100 d-flex flex-row justify-content-between align-items-center">
                                        <h3 className='fw-bold px-1'>{job.name}</h3>
                                    </div>
                                    <hr className="w-100 border-3 hr-color d-md-none d-lg-none" />
                                    <div className="d-flex flex-md-row flex-column">
                                        <table className="table table-borderless table-info-job-detail" >
                                            <tbody>
                                                <tr>
                                                    <td className='fw-bold left' style={{ minWidth: '6rem' }}>Company</td>
                                                    <td className=''>{job.client.companyName} </td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold left'>Last Apply</td>
                                                    <td className='text-success'>30 Oktober 2023</td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold left'>Type Job</td>
                                                    <td><span className={`badge  rounded-pill ${job.type == 'Full Time' ? 'bg-blue-t text-blue' : job.type == 'Freelance' ? 'bg-purple-t text-purple' : 'bg-orange-t text-orange'}`}>{job.type}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table className="table table-borderless table-info-job-detail" >
                                            <tbody>
                                                <tr>
                                                    <td className='fw-bold left'>Contract</td>
                                                    <td className='contract'>{formatDateContract(job.kontrakStart)} - {formatDateContract(job.kontrakEnd)}</td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold left'>Salary</td>
                                                    <td className='text-success fw-semibold salary' >{formattedSalary(job.gajiLower)} - {formattedSalary(job.gajiUpper)}</td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold left'>Status</td>
                                                    <td><span className={`badge rounded-pill ${job.status === 'Vacant' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{job.status}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <img src={`${apiURL}/storage/thumbnails/${job.thumbnail}`} alt="" style={{ width: '100%', height: '20rem', objectFit: 'cover', borderBottom: '10px solid  #702F8A' }} />
                    </div>
                    <div className="">
                        <div className="card-body mt-4 col-12">
                            <h5 className="text-muted card-subtitle mb-2 fw-bold">Description</h5>
                            <p className="card-text">{job.description}</p>
                        </div>
                        <div className="card-body mt-4">
                            <h5 className="text-muted card-subtitle mb-2 fw-bold">Why Join Us?</h5>
                            {job ? (job.whyJoin.split('•').map((line, index) => (
                                line !== '' && line !== ' ' ? (
                                    <div key={index} className="d-flex flex-row gap-2">
                                        <p className='mb-1'>•</p>
                                        <p className='mb-1'>{line}</p>
                                    </div>
                                ) : null)
                            )) : null}
                        </div>
                        <div className="card-body mt-4">
                            <h5 className="text-muted card-subtitle mb-2 fw-bold">As a {job.name}, this is what you’ll do:</h5>
                            {job ? (job.willDo.split('•').map((line, index) => (
                                line !== '' && line !== ' ' ? (
                                    <div key={index} className="d-flex flex-row gap-2">
                                        <p className='mb-1'>•</p>
                                        <p className='mb-1'>{line}</p>
                                    </div>
                                ) : null)
                            )) : null}
                        </div>
                        <div className="card-body mt-4">
                            <h5 className="text-muted card-subtitle mb-2 fw-bold">Job Requirements</h5>
                            {job ? (job.requirements.split('•').map((line, index) => (
                                line !== '' && line !== ' ' ? (
                                    <div key={index} className="d-flex flex-row gap-2">
                                        <p className='mb-1'>•</p>
                                        <p className='mb-1'>{line}</p>
                                    </div>
                                ) : null)
                            )) : null}
                        </div>
                        <div className="card-body mt-4">
                            <h5 className="text-muted card-subtitle mb-2 fw-bold">What we offer</h5>
                            {job ? (job.offer.split('•').map((line, index) => (
                                line !== '' && line !== ' ' ? (
                                    <div key={index} className="d-flex flex-row gap-2">
                                        <p className='mb-1'>•</p>
                                        <p className='mb-1'>{line}</p>
                                    </div>
                                ) : null)
                            )) : null}
                        </div>

                        <div className="p-3 d-flex justify-content-end">
                            {disabled ? (
                                <div className="" style={{ cursor: 'not-allowed' }}><button className="btn bg-blue text-light hover-op6" type="button" disabled={disabled} >Apply Job</button></div>

                            ) : (
                                <div onClick={() => goToFormApply('/job/' + idJob + '/hiring/form-apply')} style={{ cursor: 'pointer' }}>
                                    <button className="btn bg-blue text-light hover-op6" type="button" disabled={disabled}>Apply Job</button>
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

export default JobDetail
