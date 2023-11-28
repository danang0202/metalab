import React from 'react';
import SecondStageAdmin from './SecondStageAdmin';
import { useEffect } from 'react';
import api from '../../../apiConfig/apiConfig';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ThirdStageAdmin from './ThirdStageAdmin';
import { HiredInfo } from './HiredInfo';
import FirstStageAdmin from './FirstStageAdmin';
import FourthStageAdmin from './FourthStageAdmin';
import { Link } from 'react-router-dom';

const AdminStage = () => {
    const id = useParams().idHiring;
    const token = Cookies.get('token_metalab');
    const [hiring, setHiring] = useState();
    const [lastStage, setLastStage] = useState();
    const [job, setJob] = useState();
    const [hired, setHired] = useState(false);
    const [tahapSatu, setTahapSatu] = useState();
    const [tahapDua, setTahapDua] = useState();
    const [tahapTiga, setTahapTiga] = useState();
    const [tahapEmpat, setTahapEmpat] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/hiring/detail/' + id, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setHiring(response.data.hiring[0]);
                    setLastStage(response.data.hiring[0].lastStage);
                    if (response.data.hiring[0].status == "Hired") {
                        setLastStage('Hired');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, [])


    useEffect(() => {
        const fetchData = async () => {
            if (hiring) {
                try {
                    const response = await api.get('/job/' + hiring.jobId, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setJob(response.data.jobs)
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };
        fetchData();
    }, [hiring])

    return (
        <div className="px-5 w-100">
            <div className="w-100 px-5 " style={{ width: '90%', height: 'fit-content', borderRadius: '2rem', minHeight: '95%' }}>
                <div>
                    <div className="container-fluid my-2 py-4">
                        <div className="header d-flex w-100 justify-content-between gap-3">
                            <h5 className=" my-1 px-2" style={{ width: '80%' }}>Job Hiring Detail</h5>
                            <Link to={`/admin/hiring`}>
                                <i className="fa fa-arrow-left fs-4 text-danger bg-white rounded-5 p-1 hover-op6"></i>
                            </Link>
                        </div>
                        <div className="container-fluid my-3 col-12 justify-content-center">
                            <div className="">
                                <ul className="me-auto mb-2 d-flex justify-content-center fw-semibold w-100 gap-4" style={{ listStyle: 'none' }}>
                                    <li className={`btn btn-sm hover-op6 fw-semibold ${lastStage == 1 ? 'bg-orange' : 'bg-blue'}`} onClick={() => {
                                        if (hiring.lastStage >= 1) {
                                            setLastStage(1);
                                        }
                                    }}>
                                        <a className="nav-link text-white" href="#">Stage I</a>
                                    </li>
                                    <li
                                        className={`btn btn-sm hover-op6 fw-semibold ${lastStage === 2 ? 'bg-orange' : 'bg-blue'
                                            }`}
                                        onClick={() => {
                                            if (hiring.lastStage >= 2) {
                                                setLastStage(2);
                                            }
                                        }}
                                    >

                                        <a className="nav-link text-white text-dark" aria-current="page" href="#">Stage II</a>
                                    </li>
                                    <li
                                        className={`btn btn-sm hover-op6 fw-semibold ${lastStage == 3 ? 'bg-orange' : 'bg-blue'}`}
                                        onClick={() => {
                                            if (hiring.lastStage >= 3) {
                                                setLastStage(3);
                                            }
                                        }}
                                    >
                                        <a className={`nav-link text-white `} href="#">Stage III</a>
                                    </li>
                                    {job && job.type == 'Freelance' && (
                                        <li className={`btn btn-sm hover-op6 fw-semibold ${lastStage == '4' ? 'bg-orange' : 'bg-blue'}`} onClick={() => {
                                            if (hiring.lastStage >= 4) {
                                                setLastStage(4);
                                            }
                                        }}>
                                            <a className="nav-link text-white" href="#">Stage IV</a>
                                        </li>
                                    )}
                                    {hiring && (hiring.status == 'Hired' || hiring.status == 'Completed') && (
                                        <li className={`btn btn-sm hover-op6 fw-semibold ${lastStage == 'Hired' ? 'bg-orange' : 'bg-blue'}`} onClick={() => {
                                            if (hiring.status == 'Hired' || hiring.status == 'Completed') {
                                                setLastStage('Hired');
                                            }
                                        }}>
                                            <a className="nav-link text-white" href="#">Hired Info</a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="content-stage d-flex flex-column">
                                {hiring ? (
                                    lastStage == 1 ? (
                                        <FirstStageAdmin hiring={hiring} job={job} setLastStage={setLastStage} setTahapSatu={setTahapSatu} tahapSatu={tahapSatu} />
                                        // Tambahkan komponen atau tampilan yang sesuai untuk lastStage === '1'
                                    ) : lastStage == 2 ? (
                                        <SecondStageAdmin hiring={hiring} job={job} setLastStage={setLastStage} setTahapDua={setTahapDua} tahapDua={tahapDua} />
                                    ) : lastStage == 3 ? (
                                        <ThirdStageAdmin hiring={hiring} job={job} setLastStage={setLastStage} setTahapTiga={setTahapTiga} tahapTiga={tahapTiga} />
                                    ) : lastStage == 4 ? (
                                        <FourthStageAdmin hiring={hiring} job={job} setLastStage={setLastStage} setTahapEmpat={setTahapEmpat} tahapEmpat={tahapEmpat} />
                                    ) : (
                                        <HiredInfo job={job} hiring={hiring} />
                                    )
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default AdminStage;
