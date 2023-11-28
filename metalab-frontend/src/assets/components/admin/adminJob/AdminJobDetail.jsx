import React from 'react'
import {useEffect} from 'react';
import {useState} from 'react';
import {useParams} from 'react-router-dom'
import api from '../../../apiConfig/apiConfig';
import Cookies from 'js-cookie';
import {Link} from 'react-router-dom';
import {apiURL} from '../../../main';
import {head} from 'lodash';

const AdminJobDetail = () => {
    const idJob = useParams().idJob;
    const [job, setJob] = useState({});
    const token = Cookies.get('token_metalab');
    const [disabled, setDisabled] = useState(false);
    const [hiring, setHiring] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/job/detail/${idJob}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setJob(response.data.job[0]);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchHiring = async () => {
            try {
                const response = await api.get(`/hiring/get-by-job/${idJob}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response);
                if (response.status === 200) {
                    setHiring(response.data.hiring);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
        fetchHiring();
    }, [])


    const remainingDays = (kontrakStartString, kontrakEndString) => {
        const currentDate = new Date();
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
                <div className="p-4 w-100">
                    <div className="p-3">
                        {/* <button className="btn btn-primary" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-arrow-left">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path>
                        </svg>
                    </button> */}
                    </div>
                    <div className="w-100 bg-clear p-4"
                         style={{borderRadius: '1rem'}}>
                        <div className="card-body">
                            <div className="d-flex flex-row mb-3 align-items-center px-5">
                                <div
                                    className="align-items-center align-content-center col-2 d-lg-block d-md-none d-none">
                                    <img src={`${apiURL}/storage/client/${job.client.companyLogo}`} alt=""
                                         className='rounded'
                                         style={{width: '10rem', height: "10rem", objectFit: 'cover'}}/>
                                </div>
                                <div className="col-lg-10 col-md-12 col-11">
                                    <div className="table-responsive">
                                        <h3 className='fw-bold px-1'>{job.name}</h3>
                                        <div className="d-flex flex-md-row flex-column gap-md-5 gap-0 ">
                                            <table
                                                className="table table-borderless bg-light table-info-job-detail">
                                                <tbody>
                                                <tr>
                                                    <td className='fw-bold left'
                                                        style={{minWidth: '7rem'}}>Company
                                                    </td>
                                                    <td className='fw-semibold'>{job.client.companyName}</td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold left'>Last Apply</td>
                                                    <td className='text-success fw-semibold'>30 Oktober
                                                        2023
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold left'>Type Job</td>
                                                    <td ><span
                                                        className='badge bg-orange-t text-orange rounded-pill'>Full Time</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold left'>Kuota</td>
                                                    <td><span
                                                        className='badge bg-purple-t text-purple rounded-pill'>{job.kuota}</span>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <table className="table table-borderless table-info-job-detail">
                                                <tbody>
                                                <tr>
                                                    <td className='fw-bold left bg-transparent  '>Contract</td>
                                                    <td className='fw-semibold contract  bg-transparent '>{job.kontrakStart} s.d {job.kontrakEnd}</td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold left  bg-transparent '>Salary</td>
                                                    <td className='text-success fw-semibold salary  bg-transparent '>Rp{job.gajiLower} up
                                                        to Rp{job.gajiUpper}</td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold left  bg-transparent '>Status</td>
                                                    <td className=' bg-transparent '><span
                                                        className={`badge rounded-pill ${job.status == 'Vacant' ? 'bg-green-t text-green' : 'bg-danger'}`}>{job.status}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold left  bg-transparent '>Hired</td>
                                                    <td className=' bg-transparent '><span
                                                        className='badge bg-purple-t text-purple rounded-pill'>{job.hired}</span>
                                                        <a href='#hired-info'
                                                           className='btn btn-sm bg-blue p-0 px-1 ms-2 text-light hover-op6'>Info<i
                                                            className="ms-2 fa-solid fa-arrow-right"></i></a></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <img src={`${apiURL}/storage/thumbnails/${job.thumbnail}`} alt="" style={{
                                width: '100%',
                                height: '20rem',
                                objectFit: 'cover',
                                borderBottom: '10px solid  #702F8A'
                            }}/>
                        </div>
                        <div className="container px-lg-4 px-md-2 bg-">
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
                                <h5 className="text-muted card-subtitle mb-2 fw-bold">As a {job.name}, this is what
                                    you’ll do:</h5>
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
                        </div>
                    </div>
                    <div className="table-title">
                        <hr/>
                    </div>

                    <div className="container mb-5 pb-5 mt-3" id='hired-info'>
                        <table className="table table-borderless"
                               style={{borderCollapse: 'separate', borderSpacing: '0px 6px'}}>
                            <thead className='sticky-top bg-light'>
                            <tr>
                                <th className='text-center bg-light text-black-50'>#</th>
                                <th className='bg-light text-black-50'>Talent's Name</th>
                                <th className='bg-light text-black-50'>Email</th>
                                <th className='bg-light text-black-50'>Phone Number</th>
                                <th className='text-center bg-light text-black-50'>Gender</th>
                                <th className='text-center bg-light text-black-50'>Date of Birth</th>
                                <th className='text-center bg-light text-black-50'>Remaining</th>
                            </tr>
                            </thead>
                            <tbody>
                            {hiring &&
                                hiring.map((item) => (
                                    <tr key={item.id}>
                                        <td className='px-2 text-center'
                                            style={{borderRadius: '.5rem 0rem 0rem .5rem'}}>{item.talent.id}</td>
                                        <td><img className='me-2 rounded-1'
                                                                         src={`${apiURL}/storage/thumbnails/${job.thumbnail}`}
                                                                         alt="..." style={{
                                            width: '2rem',
                                            height: '2rem',
                                            objectFit: 'cover'
                                        }}/> {item.talent.firstName} {item.talent.lastName}</td>
                                        <td><span
                                            className={`badge bg-green-t fs-6 text-green rounded-pill`}>{item.talent.email}</span>
                                        </td>
                                        <td>{item.talent.phoneNumber}</td>
                                        <td className='text-center'><span
                                            className={`badge rounded-pill fs-6 ${item.talent.gender == 'Male' ? 'bg-blue-t text-blue' : 'bg-orange-t text-orange'}`}>{item.talent.gender}</span>
                                        </td>
                                        <td className='text-center'>{item.talent.ttl ? item.talent.ttl : 'Not set'}</td>
                                        <td className='text-center' style={{borderRadius: '0rem 0.5rem 0.5rem 0rem'}}><span
                                            className="badge bg-green-t text-green  rounded-pill fs-6">{remainingDays(job.kontrakStart, job.kontrakEnd)} days</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminJobDetail