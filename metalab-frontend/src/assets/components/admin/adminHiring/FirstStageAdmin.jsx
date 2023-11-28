import { useState } from 'react'
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import api from '../../../apiConfig/apiConfig';
import { Link } from 'react-router-dom';
import FullHiredWarning from './FullHiredWarning';
import Decision from './Decision';
import DecisionButton from './DecisionButton';
import Loading from '../../Loading';

const FirstStageAdmin = (props) => {
    const hiring = props.hiring;
    const setLastStage = props.setLastStage;
    const job = props.job;
    const token = Cookies.get('token_metalab');
    const [tahapSatu, setTahapSatu] = useState();
    const [talent, setTalent] = useState();
    const [loading, setLoading] = useState();
    const [notif,setNotif]= useState();
    useEffect(() => {
        setLoading(true);
        const fetchDataTahapSatu = async () => {
            try {
                const response = await api.get('/hiring/tahap-satu-detail/' + hiring.firstStageId, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status == 200) {
                    setTahapSatu(response.data.tahapSatu)
                    setLoading(false);
                }
            } catch (error) {
                console.log('Error', error);
                setLoading(false);
            }
        }

        const fetchTalent = async () => {
            try {
                const response = await api.get(`/talent/${hiring.talentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setTalent(response.data.talent);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };
        fetchTalent();
        fetchDataTahapSatu();
    }, [])

    const decisionSubmit = async (status) => {
        try {
            setLoading(true);
            const data = new FormData();
            data.append('status', status);
            data.append('idHiring', hiring.id);
            const response = await api.post(`/first-stage/${tahapSatu.id}/input-decision-admin`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status == 200) {
                setLoading(false);
                setTahapSatu(response.data.tahapSatu);
                if (response.data.tahapSatu.status == 'Accepted') {
                    setLastStage(2);
                    hiring.lastStage = 2;
                }
            }
        } catch (error) {
            setLoading(false);
            setNotif('fail-decision-submit');
            console.log(error);
        }
    }

    return (
        <>
            {tahapSatu && job && (
                <div className="container mb-3 col-11 " style={{ marginTop: '20px' }}>
                    {job && (hiring.status == 'On Progress' && job.status == 'Full Hired') && (
                        <FullHiredWarning job={job} />
                    )}
                    
                v

                    <form encType="multipart/form-data">
                        <div className="border bg-clear rounded p-4 shadow-sm" style={{ marginTop: '20px' }}>
                            <h2 className="text-center fw-bold fs-md-4 fs-5 mb-4">Personal Data</h2>
                            {/*  personal v untuk tampilan laptop dan tablet */}
                            <div className="row mb-3">
                                <div className="form-floating col">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={talent.firstName + " " + talent.lastName}
                                        readOnly
                                        placeholder='Name'
                                    />
                                    <label htmlFor="name" className='text-blue mx-2'>Your name</label>
                                </div>

                                <div className="col form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={talent.email}
                                        readOnly
                                    />
                                    <label htmlFor="email" className='mx-2 text-blue'>
                                        Email
                                    </label>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="form-floating col">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nik"
                                        name="nik"
                                        placeholder='NIK'
                                        value={tahapSatu.nik}
                                        readOnly
                                    />
                                    <label htmlFor="nik" className='text-blue mx-2'>Single Identity Number (NIK)</label>
                                </div>

                            </div>

                            <div className="row mb-3">
                                <div className="col form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="placeOfBirth"
                                        name="placeOfBirth"
                                        placeholder='Place of Birth'
                                        value={tahapSatu.placeOfBirth}
                                        readOnly
                                    />
                                    <label htmlFor="nik" className='mx-2 text-blue'>Place of Birth</label>
                                </div>
                                <div className="col form-floating">
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        placeholder='Date of Birth'
                                        value={tahapSatu.dateOfBirth}
                                        readOnly
                                    />
                                    <label htmlFor="dateOfBirth" className='mx-2 text-blue'>Date of Birth</label>
                                </div>
                            </div>
                            <div className="mb-3 form-floating">
                                    <textarea
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        value={tahapSatu.address}
                                        readOnly
                                    ></textarea>
                                <label htmlFor="address" className="text-blue">
                                    Address
                                </label>
                            </div>

                            {/* Pesonal data untuk tampilan HP */}
                        </div>


                        <div className="border rounded-3 bg-clear p-4 shadow-sm" style={{ marginTop: '20px' }}>
                            <h2 className="text-center fw-bold fs-md-4 fs-5 mt-3">Uploaded File</h2>

                            <div className="file-container my-4">
                                <div className="d-none d-md-block">
                                    <div className="d-flex flex-row gap-4 justify-content-center">
                                        <Link to={`/file/${tahapSatu.fileKTP.replace(/\.[^/.]+$/, "")}/${tahapSatu.fileKTP.replace(/^.*\./, "")}`} target="_blank">
                                            <span className="btn bg-purple text-light hover-op6 shadow-sm"><i className="fa-solid fa-file me-2"></i>File KTP</span>
                                        </Link>
                                        <Link to={`/file/${tahapSatu.fileKK.replace(/\.[^/.]+$/, "")}/${tahapSatu.fileKK.replace(/^.*\./, "")}`} target="_blank">
                                            <span className="btn bg-purple text-light hover-op6 shadow-sm"><i className="fa-solid fa-file me-2"></i>File KK</span>
                                        </Link>
                                        <Link to={`/file/${tahapSatu.fileCV.replace(/\.[^/.]+$/, "")}/${tahapSatu.fileCV.replace(/^.*\./, "")}`} target="_blank">
                                            <span className="btn bg-purple text-light hover-op6 shadow-sm"><i className="fa-solid fa-file me-2"></i>File CV</span>
                                        </Link>
                                        <Link to={`/file/${tahapSatu.fileIjazah.replace(/\.[^/.]+$/, "")}/${tahapSatu.fileIjazah.replace(/^.*\./, "")}`} target="_blank">
                                            <span className="btn bg-purple text-light hover-op6 shadow-sm"><i className="fa-solid fa-file me-2"></i>File Ijazah</span>
                                        </Link>
                                        <Link to={`/file/${tahapSatu.fileSertifikat.replace(/\.[^/.]+$/, "")}/${tahapSatu.fileSertifikat.replace(/^.*\./, "")}`} target="_blank">
                                            <span className="btn bg-purple text-light hover-op6 shadow-sm"><i className="fa-solid fa-file me-2"></i>File Certificate</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="d-block d-md-none">
                                    <div className="d-flex flex-row gap-1 justify-content-center">
                                        <Link to={`/file/${tahapSatu.fileKTP.replace(/\.[^/.]+$/, "")}/${tahapSatu.fileKTP.replace(/^.*\./, "")}`} target="_blank">
                                            <span className="btn bg-purple text-light hover-op6 shadow-sm fs-8"><i className="fa-solid fa-file"></i>KTP</span>
                                        </Link>
                                        <Link to={`/file/${tahapSatu.fileKK.replace(/\.[^/.]+$/, "")}/${tahapSatu.fileKK.replace(/^.*\./, "")}`} target="_blank">
                                            <span className="btn bg-purple text-light hover-op6 shadow-sm fs-8"><i className="fa-solid fa-file"></i>KK</span>
                                        </Link>
                                        <Link to={`/file/${tahapSatu.fileCV.replace(/\.[^/.]+$/, "")}/${tahapSatu.fileCV.replace(/^.*\./, "")}`} target="_blank">
                                            <span className="btn bg-purple text-light hover-op6 shadow-sm fs-8"><i className="fa-solid fa-file"></i>CV</span>
                                        </Link>
                                        <Link to={`/file/${tahapSatu.fileIjazah.replace(/\.[^/.]+$/, "")}/${tahapSatu.fileIjazah.replace(/^.*\./, "")}`} target="_blank">
                                            <span className="btn bg-purple text-light hover-op6 shadow-sm fs-8"><i className="fa-solid fa-file"></i>Ijazah</span>
                                        </Link>
                                        <Link to={`/file/${tahapSatu.fileSertifikat.replace(/\.[^/.]+$/, "")}/${tahapSatu.fileSertifikat.replace(/^.*\./, "")}`} target="_blank">
                                            <span className="btn bg-purple text-light hover-op6 shadow-sm fs-8"><i className="fa-solid fa-file"></i>Certificate</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    {tahapSatu.status != 'Pending' && (
                        <Decision status={tahapSatu.status} />
                    )}
                    {tahapSatu.status == "Pending" && job && (
                        <>
                            <hr className="my-3 px-3" />
                            <h5 className="text-center fw-bold p-1">Administration Stage Result</h5>
                            <DecisionButton decisionSubmit={decisionSubmit} jobStatus={job.status} />
                        </>
                    )}
            </div>
            )}
            {loading &&(
                <Loading/>
            )}
        </>
    )
}

export default FirstStageAdmin