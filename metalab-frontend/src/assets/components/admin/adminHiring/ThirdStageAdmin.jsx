import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../../apiConfig/apiConfig';
import Cookies from 'js-cookie';
import {
    dateCheckFromHiring,
    formatDateContract,
    isFutureDatetime,
    takeHoursAndMinute,
    validateDateWeekdaysAndTime
} from '../../../main';
import FullHiredWarning from './FullHiredWarning';
import Decision from './Decision';
import DecisionButton from "./DecisionButton.jsx";
import Swal from 'sweetalert2';
import NotifFloatAdmin from '../NotifFloatAdmin.jsx';
import { FadeLoader } from 'react-spinners';
import Loading from '../../Loading.jsx';

const ThirdStageAdmin = (props) => {
    const hiring = props.hiring;
    const job = props.job;
    const setLastStage = props.setLastStage;
    const tahapTiga = props.tahapTiga;
    const setTahapTIga = props.setTahapTiga;
    const token = Cookies.get('token_metalab');
    const [hiringCheck, setHiringCheck] = useState();
    const [dateChecking, setDateChecking] = useState();
    const [err, setErr] = useState({
        first: '', second: '', third: ''
    })
    const [btnDisable, setBtnDisabled] = useState(false);
    const [loading, setLoading] = useState();
    const [successNotif, setSuccessNotif] = useState();
    const [failNotif, setFailNotif] = useState();


    useEffect(() => {
        if (hiring.thirdtageId == null) {
            setTahapTIga(null)
        } else {
            const fetchData = async () => {
                try {
                    const response = await api.get('/hiring/second-stage/detail/' + hiring.thirdtageId, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setTahapTIga(response.data.stage);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            };
            fetchData();
        }

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('dateAdminFirst', e.target.first.value);
            data.append('dateAdminSecond', e.target.second.value);
            data.append('dateAdminThird', e.target.third.value);
            data.append('stage', 3);
            data.append('idHiring', hiring.id)
            const response = await api.post('/hiring/second-stage', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status == 201) {
                setTahapTIga(response.data.stage);
                setSuccessNotif('Succces to submit date !')
            }
        } catch (error) {
            console.log(error);
            setFailNotif('Fail to submit date !')
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSuccessNotif('');
                setFailNotif('');
            }, 3000);
        }
    }

    const linkSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('link', e.target.link.value);
            data.append('stage', 3);
            data.append('idHiring', hiring.id)
            const response = await api.post(`/second-stage/${tahapTiga.id}/input-link-admin`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status == 200) {
                setTahapTIga(response.data.stage);
                setSuccessNotif('Succces to submit link interview test!')
            }
        } catch (error) {
            console.log(error);
            setFailNotif('Fail to submit link interview test !')
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSuccessNotif('');
                setFailNotif('');
            }, 3000);
        }
    }

    const scoreSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('score', e.target.score.value);
            const response = await api.post(`/second-stage/${tahapTiga.id}/input-score-admin`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status == 200) {
                setTahapTIga(response.data.stage);
                setSuccessNotif('Succces to submit score test!')
            }
        } catch (error) {
            console.log(error);
            setFailNotif('Fail to submit score test!')
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSuccessNotif('');
                setFailNotif('');
            }, 3000);
        }
    }

    const decisionSubmit = async (status) => {
        try {
            setLoading(true);
            const data = new FormData();
            data.append('status', status);
            data.append('idHiring', hiring.id);
            data.append('stage', '3');
            const response = await api.post(`/second-stage/${tahapTiga.id}/input-decision-admin`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status == 200) {
                setTahapTIga(response.data.stage);
                if (job.type != "Freelance" && response.data.stage.status == "Accepted") {
                    setLastStage('Hired');
                    hiring.status = 'Hired';
                } else {
                    if (response.data.stage.status == 'Accepted') {
                        setLastStage(4);
                    }
                }
            }
        } catch (error) {
            console.log(error);
            setFailNotif('Fail to submit decision !')
        } finally {
            setLoading(false);
            setTimeout(() => {
                setFailNotif('');
            }, 3000);
        }
    }

    const handleChange = async (e) => {
        try {
            let name = e.target.name;
            if (!isFutureDatetime(e.target.value)) {
                setErr((prevErr) => ({
                    ...prevErr,
                    [name]: 'Sorry, Invalid Date !',
                }));
                setBtnDisabled(true);
            } else if (!validateDateWeekdaysAndTime(e.target.value)) {
                setErr((prevErr) => ({
                    ...prevErr,
                    [name]: 'Please select weekdays and hours between 6 am - 18 pm !',
                }));
                setBtnDisabled(true);
            } else {
                setErr((prevErr) => ({
                    ...prevErr,
                    [name]: '',
                }));
                setBtnDisabled(false);
            }

            const data = new FormData();
            data.append('date', e.target.value);
            const response = await api.post(`/check-date-tahap-tengah-admin`, data, {});
            if (response.status == 200) {
                setHiringCheck(response.data.hiringOnProgress);
            } else if (response.status == 204) {
                setHiringCheck(null);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn bg-blue text-light hover-op6 ms-2",
            cancelButton: "btn bg-danger text-light hover-op6 me-2"
        },
        buttonsStyling: false
    });

    const confirmation = (e, code) => {
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
                if (code == 1) {
                    handleSubmit(e);
                } else if (code == 2) {
                    linkSubmit(e);
                } else if (code == 3) {
                    scoreSubmit(e);
                }
            }
        });
    }


    return (
        <>
            {/* <h5 className="text-center fw-bold rounded-3 p-2 text-white bg-orange my-3 py-2">Competency Test</h5> */}
            {job && (hiring.status == 'On Progress' && job.status == 'Full Hired') && (
                <FullHiredWarning job={job} />
            )}

            {successNotif && (
                <NotifFloatAdmin status="success" text={successNotif} />
            )}
            {failNotif && (
                <NotifFloatAdmin status="fail" text={failNotif} />
            )}
            <div className="border bg-clear rounded p-4 shadow-sm" style={{ marginTop: '20px' }}>
                {hiringCheck && (
                    <div className="box-warning alert alert-warning w-100">
                        <div className="d-flex align-items-center gap-5">
                            <h5><i className="fa-solid fa-triangle-exclamation me-2 text-warning fs-5"></i>Warning</h5>
                            <h6>Pay attention to the schedule {formatDateContract(dateChecking)} below:</h6>
                        </div>
                        <div key={hiring.id} className="box">
                            <div className="d-flex flex-row">
                                <table className='table table-borderless'>
                                    <thead>
                                        <tr>
                                            <th className='bg-transparent'>Time</th>
                                            <th className='bg-transparent'>Talent</th>
                                            <th className='bg-transparent'>Job</th>
                                            <th className='bg-transparent'>Schedule Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hiringCheck.map((hiring) => (
                                            <tr key={hiring.id}>
                                                <td className='bg-transparent fw-semibold'>{takeHoursAndMinute(dateCheckFromHiring(dateChecking, hiring))}</td>
                                                <td className='bg-transparent'>{`${hiring.talent.firstName} ${hiring.talent.lastName}`}</td>
                                                <td className='bg-transparent'>{hiring.job.name}</td>
                                                {hiring.second_stage ? (
                                                    <td className='bg-transparent'>{!hiring.second_stage.dateUser ? 'Admin offers' : 'User choice'}</td>
                                                ) : (
                                                    <td className='bg-transparent'>{!hiring.third_stage.dateUser ? 'Admin offers' : 'User choice'}</td>
                                                )}

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {tahapTiga == null && (
                    <div className="row my-3">
                        <div className="col-md-6 col-sm-12 d-flex flex-row align-items-center">
                            {/* Konten untuk kolom pertama */}
                            <div className="d-flex flex-row align-items-center">
                                <span className="bg-orange badge rounded-pill fs-6">1</span>
                                <span
                                    className=" text-center px-2 fw-semibold">Submit a schedule for stage 2 tests</span>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12 form-container d-flex justify-content-center">
                            <form onSubmit={(e) => confirmation(e, 1)} className='d-flex flex-column gap-2 col-7'>
                                <div className="col form-floating">
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="first"
                                        name="first"
                                        required
                                        onChange={(e) => {
                                            handleChange(e);
                                            setDateChecking(e.target.value)
                                        }}
                                    />
                                    <label htmlFor="first" className='fw-semibold text-blue'>First Schedule</label>
                                    <div className="error">
                                        {err.first &&
                                            <p className='mb-0 text-danger'><i
                                                className="fa-solid fa-triangle-exclamation me-2"></i>{err.first}</p>
                                        }
                                    </div>
                                </div>
                                <div className="col form-floating">
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="second"
                                        name="second"
                                        required
                                        onChange={(e) => {
                                            handleChange(e);
                                            setDateChecking(e.target.value)
                                        }}
                                    />
                                    <label htmlFor="second" className='fw-semibold text-blue'>Second Schedule</label>
                                    <div className="error">
                                        {err.second &&
                                            <p className='mb-0 text-danger'><i
                                                className="fa-solid fa-triangle-exclamation me-2"></i>{err.second}</p>
                                        }
                                    </div>
                                </div>
                                <div className="col form-floating">
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="third"
                                        name="third"
                                        required
                                        onChange={(e) => {
                                            handleChange(e);
                                            setDateChecking(e.target.value)
                                        }}
                                    />
                                    <label htmlFor="third" className='fw-semibold text-blue'>Third Schedule</label>
                                    <div className="error">
                                        {err.third &&
                                            <p className='mb-0 text-danger'><i
                                                className="fa-solid fa-triangle-exclamation me-2"></i>{err.third}</p>
                                        }
                                    </div>
                                </div>
                                <button className='btn btn-sm bg-blue fw-semibold text-light mt-2 hover-op6'
                                    type='submit'
                                    disabled={btnDisable}>Submit
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {tahapTiga != null && tahapTiga.dateAdminThird != null && (
                    <>
                        <div className="row my-3">
                            <div className="col-md-6 col-sm-12 d-flex flex-row align-items-center">
                                {/* Konten untuk kolom pertama */}
                                <div className="slv-step-wizard-item d-flex flex-row align-items-center">
                                    <span className="bg-orange badge rounded-pill fs-6">1</span>
                                    <span
                                        className="text-center px-2 fw-semibold">Submitted Schedule for Stage III Test</span>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12 form-container d-flex justify-content-center">
                                <div className="d-flex flex-column gap-2 col-7">
                                    <div className="col form-floating">
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            id="first"
                                            name="first"
                                            value={tahapTiga.dateAdminFirst}
                                            readOnly
                                        />
                                        <label htmlFor="first" className='fw-semibold text-blue'>First Schedule</label>
                                    </div>
                                    <div className="col form-floating">
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            id="second"
                                            name="second"
                                            value={tahapTiga.dateAdminSecond}
                                            readOnly
                                        />
                                        <label htmlFor="second" className='fw-semibold text-blue'>Second
                                            Schedule</label>
                                    </div>
                                    <div className="col form-floating">
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            id="third"
                                            name="third"
                                            value={tahapTiga.dateAdminThird}
                                            readOnly
                                        />
                                        <label htmlFor="third" className='fw-semibold text-blue'>Third Schedule</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row my-3">
                            <div className="col-md-6 col-sm-12 d-flex flex-row align-items-center">
                                {/* Konten untuk kolom pertama */}
                                <div className="d-flex flex-row align-items-center">
                                    <span className="bg-orange badge rounded-pill fs-6">2</span>
                                    <span className="text-center px-2 fw-semibold">Schedule Selected by Talent</span>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12 form-container d-flex justify-content-center">
                                <div className="d-flex flex-column gap-2 col-7">
                                    {tahapTiga.dateUser == null ? (
                                        <span className="slv-progress-label text-center px-2 fw-semibold text-orange">Waiting ...</span>
                                    ) : (
                                        <div className="col form-floating">
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                id="third"
                                                name="third"
                                                value={tahapTiga.dateUser}
                                                readOnly
                                            />
                                            <label htmlFor="third" className='fw-semibold text-blue'>Selected
                                                Schedule</label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </>
                )}

                {tahapTiga && tahapTiga.dateUser != null && (
                    <div className="row my-3">
                        <div className="col-md-6 col-sm-12 d-flex flex-row align-items-center">
                            {/* Konten untuk kolom pertama */}
                            <div className="d-flex flex-row align-items-center">
                                <span className="bg-orange badge rounded-pill fs-6">3</span>
                                <span className="text-center px-2 fw-semibold">Video Conference Link</span>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12 form-container d-flex justify-content-center">
                            <div className="d-flex flex-column gap-2 col-7">
                                {tahapTiga.link == null ? (
                                    <form onSubmit={(e) => confirmation(e, 2)}>
                                        <div className="d-flex flex-row">
                                            <input type="text" className="form-control" id="link" name='link'
                                                aria-describedby="emailHelp" placeholder='Input link here ...' />
                                            <button type="submit"
                                                className="btn btn-sm fw-semibold px-2 border-0 btn-primary">Submit
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <form>
                                        <div className="d-flex flex-row gap-4">
                                            <input type="email" value={tahapTiga.link} readOnly
                                                className='form-control' />
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {tahapTiga && tahapTiga.link != null && (
                    <div className="row my-3">
                        <div className="col-md-6 col-sm-12 d-flex flex-row align-items-center">
                            {/* Konten untuk kolom pertama */}
                            <div className=" d-flex flex-row align-items-center">
                                <span className="bg-orange badge rounded-pill fs-6">4</span>
                                <span className=" text-center px-2 fw-semibold">Score</span>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12 form-container d-flex justify-content-center">
                            <div className="d-flex flex-column gap-2 col-7">
                                {tahapTiga.score == null ? (
                                    <form onSubmit={(e) => confirmation(e, 3)}>
                                        <div className="d-flex flex-row">
                                            <input type="number" className="form-control" id="score" name='score'
                                                placeholder='Input score here ...' />
                                            <button type="submit"
                                                className="btn btn-sm fw-semibold px-2 border-0 btn-primary">Submit
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <form>
                                        <div className="d-flex flex-row gap-4">
                                            <input type="number" value={tahapTiga.score} readOnly
                                                className='form-control' />
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* masukan sini */}

            </div>
            {tahapTiga && tahapTiga.status != 'Pending' && (
                <Decision status={tahapTiga.status} />
            )}

            {tahapTiga && tahapTiga.score && tahapTiga.status == "Pending" && job && (
                <>
                    <hr className="my-3 px-3" />
                    <h5 className="text-center fw-bold p-1">Interview Stage Result</h5>
                    <DecisionButton decisionSubmit={decisionSubmit} jobStatus={job.status} />
                </>
            )
            }

            {loading &&
                < Loading />
            }

        </>
    )
}

export default ThirdStageAdmin;