import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState } from 'react';
import api from '../../../../apiConfig/apiConfig';
import { formatDateTimeFunc } from '../../../../main';
import Loading from '../../../Loading';
import Decision from './Decision';
import HeaderStage from './HeaderStage';
import Swal from 'sweetalert2';

const ThirdStage = () => {
    const [job, setJob] = useState();
    const [loading, setLoading] = useState(false);
    const token = Cookies.get('token_metalab');
    const jobId = useParams().jobId;
    const idTahapTiga = useParams().id;
    const [tahapTiga, settahapTiga] = useState();
    const [isDateExpired, setIsDateExipired] = useState(false);
    const [selectedDate, setSelectedDate] = useState();
    const [hiring, setHiring] = useState()

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
                            lastStage: 3
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
                const response = await api.get('/hiring/second-stage/detail/' + idTahapTiga, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    settahapTiga(response.data.stage);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchData();
        fetchDataJob();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = new FormData();
            data.append('dateUser', e.target.dateUser.value);
            console.log(e.target.dateUser.value);
            const response = await api.post(`/second-stage/${idTahapTiga}/select-date-user`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setLoading(false);
                settahapTiga(response.data.stage);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const currentDate = new Date()
        const dateUser = new Date(e.target.value);
        setSelectedDate(e.target.value);

        if (currentDate > dateUser) {
            setIsDateExipired(true);
        } else {
            setIsDateExipired(false);
        }
    }


    return (
        <>
            <div className="container mx-7 mb-3 col-11 col-lg-6 mt-4 overflow-scroll">
                {job && hiring && (
                    <div className="hiring-detail-container">
                        <HeaderStage job={job} hiring={hiring} />
                    </div>
                )}
                <div className="border rounded p-2 p-lg-4 shadow-sm mt-4">
                    <h5 className="text-center fw-bold mt-md-0 mt-2">Interview Test</h5>
                    <div className="card bg-blue mt-4" style={{ marginBottom: '20px' }}>
                        <div className="card-header fw-semibold fs-5 text-light">Information</div>
                        <div className="card-body">
                            <blockquote className="blockquote mb-0">
                                <ol>
                                    <li className='fs-6 text-light'>Talent selects date for stage III (interview stage)</li>
                                    <li className='fs-6 text-light'>Talent appears for the stage III test according to the selected date via the video conference link that has been sent</li>
                                </ol>
                            </blockquote>
                        </div>
                    </div>
                    {tahapTiga ? (
                        <div className="container-fluid px-md-5 px-0">
                            {isDateExpired && (
                                <div className="alert alert-warning text-center" role="alert">
                                    Date expired to choose, please choose another date !
                                </div>
                            )}
                            <div className="d-flex align-items-center flex-column aling-items-center flex-md-row flex-wrap justify-content-md-start justify-content-center">
                                <div className="">
                                    <div className="text-md-start text-center" style={{ width: "15rem" }}>
                                        <div className="fw-semibold fs-6">{tahapTiga && tahapTiga.dateUser == null ? 'Please select a date' : 'Third stage schedule :'}</div>
                                    </div>
                                </div>
                                <div className="">
                                    {tahapTiga.dateUser == null ? (
                                        <div className="text-start">
                                            <form onSubmit={confirmation}>
                                                <div className="mb-2">
                                                    <input
                                                        type="radio"
                                                        className={`btn-check ${isDateExpired ? 'radio-danger' : 'radio-safe'}`}
                                                        name="dateUser"
                                                        id="vbtn-radio1"
                                                        autoComplete="off"
                                                        value={tahapTiga.dateAdminFirst}
                                                        onChange={(e) => { handleChange(e) }}
                                                    />
                                                    <label
                                                        className="btn btn-outline-success w-45 rounded-pill text-dark"
                                                        htmlFor="vbtn-radio1"
                                                    >
                                                        {formatDateTimeFunc(tahapTiga.dateAdminFirst)} WIB
                                                    </label>
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="radio"
                                                        className={`btn-check ${isDateExpired ? 'radio-danger' : 'radio-safe'}`}
                                                        name="dateUser"
                                                        id="vbtn-radio2"
                                                        autoComplete="off"
                                                        value={tahapTiga.dateAdminSecond}
                                                        onChange={(e) => { handleChange(e) }}
                                                    />
                                                    <label
                                                        className="btn btn-outline-success w-45 rounded-pill text-dark"
                                                        htmlFor="vbtn-radio2"
                                                    >
                                                        {formatDateTimeFunc(tahapTiga.dateAdminSecond)} WIB
                                                    </label>
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="radio"
                                                        className={`btn-check ${isDateExpired ? 'radio-danger' : 'radio-safe'}`}
                                                        name="dateUser"
                                                        id="vbtn-radio3"
                                                        autoComplete="off"
                                                        value={tahapTiga.dateAdminThird}
                                                        onChange={(e) => { handleChange(e) }}
                                                    />
                                                    <label
                                                        className="btn btn-outline-success w-45 rounded-pill text-dark"
                                                        htmlFor="vbtn-radio3"
                                                    >
                                                        {formatDateTimeFunc(tahapTiga.dateAdminThird)} WIB
                                                    </label>
                                                </div>
                                                <div className="text-end mt-3">
                                                    <button type="submit" className="btn btn-primary btn-sm" disabled={isDateExpired || !selectedDate}>
                                                        Submit
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="text-start " style={{ marginRight: '35%' }}>
                                            <div className="mb-2">
                                                <label className="btn w-45">
                                                    <span className="badge bg-green-t text-success rounded-pill fs-6 fw-semibold"><i className="fa-solid fa-calendar-days me-2"></i>{formatDateTimeFunc(tahapTiga.dateUser)} WIB</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {tahapTiga.dateUser != null && (
                                <div className="d-flex align-items-center flex-md-row flex-column flex-wrap justify-content-md-start justify-content-center mt-2" style={{ marginBottom: '10px' }}>
                                    <div>
                                        <div className="text-center text-md-start fs-6 fw-semibold mb-0" style={{ width: "15rem" }}>Link Video Conference: </div>
                                    </div>
                                    <div className="">
                                        <div className="ms-1 w-75 px-2 text-start py-2">
                                            <span className="badge bg-purple-t text-purple rounded-pill fs-6 mb-1"><i className="fa-solid fa-link me-2"></i><a href={`${tahapTiga.link ? tahapTiga.link : ''}`} className="text-purple">{tahapTiga.link ? 'Click Link' : 'Waiting...'}</a></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {tahapTiga.link != null && (
                                <div className="d-flex align-items-center flex-column flex-md-row flex-wrap justify-content-md-start justify-content-center mt-2" style={{ marginBottom: '10px' }}>
                                    <div className="">
                                        <div className="text-md-start text-center fs-6 fw-semibold mb-0" style={{ width: "15rem" }}>Score:</div>
                                    </div>
                                    <div className="">
                                        <div className="ms-1 text-start px-2">
                                            <span className="badge bg-blue-t text-blue rounded-pill fs-6 fw-semibold">{tahapTiga.score ? tahapTiga.score + ' points' : 'Waiting ...'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Decision status={"Pending"} />
                    )}
                </div>
                {tahapTiga && tahapTiga.status != 'Pending' && (
                    <Decision status={tahapTiga.status} />
                )}
            </div>
            {loading && (
                <Loading />
            )}
        </>
    );
};

export default ThirdStage;