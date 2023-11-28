import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState } from 'react';
import api from '../../../../apiConfig/apiConfig'
import HeaderForm from '../formApplyComponent/HeaderForm';
import { Link } from 'react-router-dom';
import Loading from '../../../Loading';
import Decision from './Decision';
import HeaderStage from './HeaderStage';

const FirstStage = (props) => {
    const [loading, setLoading] = useState(false);
    const jobId = useParams().jobId;
    const idTahapSatu = useParams().id;
    const [tahapSatu, setTahapSatu] = useState();
    const [job, setJob] = useState();
    const [talent, setTalent] = useState();
    const userEmail = Cookies.get('email_metalab');
    const token = Cookies.get('token_metalab');
    const [hiring, setHiring] = useState()
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
                            lastStage: 1
                        }
                        setHiring(hiringTemp);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        const fetchDataTalentLogin = async () => {
            if (token) {
                try {
                    const response = await api.get('/profil-formulir-job', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status == 200) {
                        setTalent(response.data.user)
                    }
                } catch (error) {
                    console.log('Error', error);
                }
            }
        }


        const fetchDataTahapSatu = async () => {
            try {
                const response = await api.get('/hiring/tahap-satu-detail/' + idTahapSatu, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status == 200) {
                    setTahapSatu(response.data.tahapSatu)
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                console.log('Error', error);
            }
        }

        fetchDataJob();
        fetchDataTalentLogin();
        fetchDataTahapSatu();
    }, [])

    return (
        <>
            {job && talent && tahapSatu && (
                <div className="hiring-detail-container d-flex justify-content-center p-2">
                    <div className="mb-3 col-lg-6 mw-100" style={{ marginTop: '20px' }}>
                        <HeaderStage job={job} hiring={hiring} />
                        <h1 className="text-center fw-bold  fs-md-2 fs-4" style={{ marginTop: '30px' }}>Administration Stage</h1>
                        <form encType="multipart/form-data">
                            <div className="border rounded p-md-4 p-2 shadow-sm" style={{ marginTop: '20px' }}>
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
                                            value={userEmail}
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


                            <div className="border rounded p-4 shadow-sm" style={{ marginTop: '20px' }}>
                                <h2 className="text-center fw-bold fs-md-4 fs-5 mt-3">Uploaded File</h2>

                                <div className="file-container my-4">
                                    <div className="d-none d-md-block">
                                        <div className="d-flex flex-row gap-3 justify-content-center">
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
                            <Decision status={tahapSatu.status} />
                        </form>
                    </div>
                </div>
            )}
            {loading && (
                <Loading />
            )}
        </>
    )
}

export default FirstStage