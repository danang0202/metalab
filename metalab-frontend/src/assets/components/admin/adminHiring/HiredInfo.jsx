import React from 'react'
import { apiURL, formatDateContract } from '../../../main'
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../../../apiConfig/apiConfig';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

export const HiredInfo = (props) => {
    const job = props.job;
    const hiring = props.hiring;
    const currentDate = new Date();
    const [differenceInDays, setDifferenceInDays] = useState(0);
    const token = Cookies.get('token_metalab');
    const [talent, setTalent] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/talent/${hiring.talentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response);
                if (response.status === 200) {
                    setTalent(response.data.talent);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        if (job) {
            const kontrakStart = new Date(job.kontrakStart);
            const kontrakEnd = new Date(job.kontrakEnd);
            // Menghitung selisih hari
            if (currentDate < kontrakStart) {
                // Hari ini lebih awal dari kontrakStart
                setDifferenceInDays(Math.ceil((kontrakEnd - kontrakStart) / (1000 * 60 * 60 * 24)));
            } else if (currentDate >= kontrakStart && currentDate <= kontrakEnd) {
                // Hari ini di antara kontrakStart dan kontrakEnd
                setDifferenceInDays(Math.ceil((kontrakEnd - currentDate) / (1000 * 60 * 60 * 24)));
            } else {
                console.log('ts 3')
                setDifferenceInDays(0);
            }
        }
    }, [job]);

    return (
        <>
            {job && talent && (
                <div className="mt-3 hiring-info-container w-100 d-flex justify-content-center bg-clear border shadow-sm py-5">
                    <div className="d-flex flex-row align-items-center gap-4">
                        <div className="left bg-clear d-flex flex-column gap-3 shadow" style={{ paddingBottom: '2rem', minWidth: '18rem' }}>
                            <img
                                className="card-img-top w-100 d-block"
                                src={`${apiURL}/storage/thumbnails/${job.thumbnail}`}
                                style={{ borderBottom: '5px solid  #702F8A', height: '10rem', objectFit: 'cover', borderRadius: '0.2rem .2rem 0rem 0rem' }}
                            />
                            <div className="header">
                                <Link className='text-decoration-none text-dark hover-op6' to={`/admin/job/detail/${job.id}`} >
                                    <h5 className='text-center'>{job.name}</h5>
                                </Link>
                                <h6 className='text-center text-secondary'>{job.client.companyName}</h6>
                            </div>
                            <table style={{ borderCollapse: 'collapse' }}>
                                <tr>
                                    <td className='px-3 fw-semibold'>Job type</td>
                                    <td className='px-3'><span className={`badge  rounded-pill ${job.type == 'Full Time' ? 'bg-blue-t text-blue' : job.type == 'Freelance' ? 'bg-purple-t text-purple' : 'bg-orange-t text-orange'}`}>{job.type}</span></td>
                                </tr>
                                <tr>
                                    <td className='px-3 fw-semibold'>Contract</td>
                                    <td className='fs-8 px-3'>{formatDateContract(job.kontrakStart) + ' - ' + formatDateContract(job.kontrakEnd)}</td>
                                </tr>
                                <tr>
                                    <td className='px-3 fw-semibold'>Remaining</td>
                                    <td className='fs-8 px-3 fw-bold text-success'>{differenceInDays} Days</td>
                                </tr>
                            </table>
                        </div>
                        <i className="fa-solid fa-arrows-left-right fs-1"></i>
                        <div className="right" style={{ minWidth: '18rem' }}>
                            <div className="d-flex flex-column gap-3 shadow bg-clear" style={{ paddingBottom: '2rem' }}>
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
                                <table style={{ borderCollapse: 'collapse' }}>
                                    <tr>
                                        <td className='px-3 fw-semibold'>Phone</td>
                                        <td className='px-3'>{talent.phoneNumber}</td>
                                    </tr>
                                    <tr>
                                        <td className='px-3 fw-semibold'>Gender</td>
                                        <td className='px-3'><span className={`badge rounded-pill ${talent.gender == 'Male' ? 'bg-blue-t text-blue' : 'bg-orange-t text-orange'}`}>{talent.gender}</span></td>
                                    </tr>
                                    <tr>
                                        <td className='px-3 fw-semibold'>Status</td>
                                        <td className='px-3'><span className={`badge rounded-pill ${talent.status == 'Enable' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{talent.status}</span></td>
                                    </tr>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </>
    )
}
