
import { useEffect } from 'react';
import api from '../../../../apiConfig/apiConfig';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { isMinimumAge } from '../../../../main';
import Swal from 'sweetalert2'
import Loading from '../../../Loading';
import HeaderStage from '../hiringStageComponent/HeaderStage';
import NotifFloatTalent from '../../NotifFloatTalent';

const FormApply = () => {
    const [loading, setLoading] = useState(false);
    const jobId = useParams().jobId;
    const [job, setJob] = useState({});
    const [talent, setTalent] = useState({});
    const userEmail = Cookies.get('email_metalab');
    const token = Cookies.get('token_metalab');
    const [err, setErr] = useState({
        nikErr: '', placeOfBirthErr: '', dateOfBirthErr: '', addressErr: '', ktpErr: '', kkErr: '', certificateErr: '', cv: ''
    })
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const navigate = useNavigate();
    const [hiring, setHiring] = useState();
    const [notif, setNotif] = useState();

    useEffect(() => {

        if (!sessionStorage.getItem('idJob')) {
            navigate('/jobs')
        } else {
            if (sessionStorage.getItem('idJob') != jobId) {
                navigate('/jobs')
            }
        }
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
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
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
                    console.log(response);
                    if (response.status == 200) {
                        if (response.data.user.status == 'Disable') {
                            navigate('/logout')
                        }
                        setTalent(response.data.user)
                    }
                } catch (error) {
                    console.log('Error', error);
                }
            }
        }
        fetchDataJob();
        fetchDataTalentLogin();
    }, [])

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        if (name == 'nik') {
            setButtonDisabled(true);
            if (value == '') {
                setErr({
                    ...err, nikErr: 'Please fill in your NIK number'
                })
            } else {
                setErr({
                    ...err, nikErr: ''
                })
                setButtonDisabled(false);
            }
        } else if (name == 'placeOfBirth') {
            setButtonDisabled(true);
            if (value == '') {
                setErr({
                    ...err, placeOfBirthErr: 'Please fill in your place of birth'
                })
            } else {
                setButtonDisabled(false);
                setErr({
                    ...err, placeOfBirthErr: ''
                })
            }
        } else if (name == 'dateOfBirth') {
            setButtonDisabled(true);
            if (value == '' || value == null) {
                setErr({
                    ...err, dateOfBirthErr: 'Please select your date of birth'
                })
            } else if (!isMinimumAge(value)) {
                setErr({
                    ...err, dateOfBirthErr: 'Minimum age 17 years'
                })
            } else {
                setButtonDisabled(false);
                setErr({
                    ...err, dateOfBirthErr: ''
                })
            }

        } else if (name == 'address') {
            setButtonDisabled(true);
            if (value == '') {
                setErr({
                    ...err, addressErr: 'Please fill your address'
                })
            } else {
                setButtonDisabled(false);
                setErr({
                    ...err, addressErr: ''
                })
            }
        }
    }

    useEffect(() => {

    }, [])
    const handleSubmit = async (e) => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('nik', e.target.nik.value);
            data.append('placeOfBirth', e.target.placeOfBirth.value);
            data.append('dateOfBirth', e.target.dateOfBirth.value);
            data.append('address', e.target.address.value);
            data.append('fileKTP', e.target.ktp.files[0]);
            data.append('fileKK', e.target.kk.files[0]);
            data.append('fileCV', e.target.cv.files[0]);
            data.append('fileSertifikat', e.target.certificate.files[0]);
            data.append('fileIjazah', e.target.ijazah.files[0]);
            const response = await api.post(`/job/${jobId}/hiring/apply`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                navigate(`/hiring/detail/${response.data.hiring.id}`)
            } else if (response.status === 200) {
                setLoading(false)
                setNotif('submit-fail')
                setTimeout(() => {
                    setNotif('')
                }, 3000);
            }
        } catch (error) {
            setLoading(false)
            setNotif('submit-success')
            setTimeout(() => {
                setNotif('')
            }, 3000);
        }
    }

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn bg-blue text-light hover-op6 ms-2",
            cancelButton: "btn bg-danger text-light hover-op6 me-2"
        },
        buttonsStyling: false
    });

    const confirmation = (e) => {
        e.preventDefault(0);
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, sure !",
            cancelButtonText: "No, cancel !",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmit(e);
            }
        });
    }

    return (
        <>
            {job != null && job.client != null && (
                <div className="container mb-3 col-lg-7 col-md-12" style={{ marginTop: '20px' }}>
                    {notif && notif == 'submit-fail' && (
                        <NotifFloatTalent status="fail" text="Fail to submit form!" />
                    )}
                    <div className="hiring-detail-container">
                        <HeaderStage job={job} hiring={hiring} />
                    </div>
                    <h1 className="text-center fw-bold  fs-md-2 fs-4" style={{ marginTop: '30px' }}>Administration Stage</h1>
                    <form encType="multipart/form-data" onSubmit={confirmation}>
                        <div className="border rounded p-md-4 p-2 shadow-sm mt-2">
                            <h2 className="text-center fw-bold fs-md-4 fs-5 mb-4">Personal Data</h2>
                            {/*  personal info untuk tampilan laptop dan tablet */}
                            <div className="row mb-3">
                                <div className="form-floating col">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={talent.firstName + " " + talent.lastName}
                                        readOnly
                                        required
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
                                        required
                                    />
                                    <label htmlFor="email" className='mx-2 text-blue'>
                                        Email
                                    </label>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="form-floating col">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="nik"
                                        name="nik"
                                        required
                                        placeholder='NIK'
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="nik" className='text-blue mx-2'>Nomor Induk Kependudukan (NIK)</label>
                                    {err.nikErr != '' && (
                                        <div className="alert alert-warning d-flex align-items-center gap-3 my-2" role="alert" style={{ height: '1rem' }}>
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                            <div>
                                                {err.nikErr}
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>

                            <div className="row mb-3">
                                <div className="col form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="placeOfBirth"
                                        name="placeOfBirth"
                                        required
                                        placeholder='Place of Birth'
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="nik" className='mx-2 text-blue'>Place of Birth</label>
                                </div>
                                <div className="col form-floating">
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        required
                                        placeholder='Date of Birth'
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="dateOfBirth" className='mx-2 text-blue'>Date of Birth</label>
                                </div>
                            </div>
                            {err.placeOfBirthErr != '' && (
                                <div className="alert alert-warning d-flex align-items-center gap-3 my-2 " role="alert" style={{ height: '1rem' }}>
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <div>
                                        {err.placeOfBirthErr}
                                    </div>
                                </div>
                            )}
                            {err.dateOfBirthErr != '' && (
                                <div className="alert alert-warning d-flex align-items-center gap-3 my-2 " role="alert" style={{ height: '1rem' }}>
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <div>
                                        {err.dateOfBirthErr}
                                    </div>
                                </div>
                            )}
                            <div className="mb-3 form-floating">
                                <textarea
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    rows="5"
                                    required
                                    onChange={handleChange}
                                ></textarea>
                                <label htmlFor="address" className="text-blue">
                                    Address
                                </label>
                                {err.addressErr != '' && (
                                    <div className="alert alert-warning d-flex align-items-center gap-3 my-2 " role="alert" style={{ height: '1rem' }}>
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                        <div>
                                            {err.addressErr}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Pesonal data untuk tampilan HP */}
                        </div>


                        <div className="border rounded p-4 shadow-sm" style={{ marginTop: '20px' }}>
                            <h2 className="text-center fw-bold fs-md-4 fs-5 mt-3">Upload File</h2>
                            <div className="mb-3">
                                <label htmlFor="fileKTP" className="form-label text-blue">
                                    Upload your KTP :
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="fileKTP"
                                    name="ktp"
                                    accept=".pdf"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fileKK" className="form-label text-blue">
                                    Upload your KK :
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="fileKK"
                                    name="kk"
                                    accept=".pdf"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fileKK" className="form-label text-blue">
                                    Upload your educational transcript :
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="fileIjazah"
                                    name="ijazah"
                                    accept=".pdf"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fileCV" className="form-label text-blue">
                                    Upload your CV :
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="fileCV"
                                    name="cv"
                                    accept=".pdf"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fileSertifikat" className="form-label text-blue">
                                    Upload your certificate :
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="fileSertifikat"
                                    name="certificate"
                                    accept=".pdf"
                                    required
                                />
                            </div>
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            {buttonDisabled ? (
                                <button className="btn btn-primary" type="submit" disabled={true} style={{ cursor: 'not-allowed' }}>Submit</button>
                            ) : (
                                <button className="btn btn-primary" type="submit" disabled={false}>Submit</button>
                            )}
                        </div>
                    </form>


                </div>
            )}

            {loading && (
                <Loading />
            )}

        </>
    )
}

export default FormApply