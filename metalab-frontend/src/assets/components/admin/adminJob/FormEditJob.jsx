import { useState } from 'react';
import Cookies from 'js-cookie';
import api from '../../../apiConfig/apiConfig';
import { useParams } from 'react-router-dom';
import { apiURL, isFutureDatetime, validateStartAndEndDate } from '../../../main';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import NotifFloatAdmin from '../NotifFloatAdmin';

const FormEditJob = () => {
    const [willDoJob, setWillDoJob] = useState("");
    const [whyJoin, setWhyJoin] = useState("");
    const [requirements, setRequirements] = useState("");
    const [offer, setOffer] = useState("");
    const [clients, setClients] = useState([]);
    const token = Cookies.get('token_metalab');
    const [clientSelect, setClientSelect] = useState('select')
    const [jobType, setJobType] = useState('select')
    const idJob = useParams().idJob
    const [job, setJob] = useState();
    const navigate = useNavigate();
    const [notif, setNotif] = useState('');
    const [thumbnail, setThumbnail] = useState();
    const [err, setErr] = useState({
        nameErr: '', typeErr: '', contractStartErr: '', contractEndErr: '', salaryUpperErr: '', salaryLowerErr: '', kuotaErr: '', latestApplyDateErr: '', clientErr: ''
    })
    const [btnDisable, setBtnDisabled] = useState();

    useEffect(() => {
        if (job && job.thumbnail) {
            setThumbnail(`${apiURL}/storage/thumbnails/${job.thumbnail}`);
        }
    }, [job]);

    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    const response = await api.get('/client-id-name', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.status === 200) {
                        setClients(response.data.clients);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            };
            fetchData();
        }

        const fetchJob = async () => {
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
        fetchJob();
    }, []);

    useEffect(() => {
        if (job) {
            setJobType(job.type)
            setClientSelect(job.clientId)
            setWhyJoin(job.whyJoin)
            setWillDoJob(job.willDo)
            setRequirements(job.requirements)
            setOffer(job.offer)
        }
    }, [job])

    const handleSelectChange = (e) => {
        if (e.target.name == 'client') {
            setClientSelect(e.target.value);
        } else {
            setJobType(e.target.value)
        }

    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnail(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (jobType == 'Part Time' || jobType == 'Full Time') {
            setClientSelect(1)
        }
    }, [jobType, clientSelect])

    const handleTextareaChange = (e) => {
        let name = e.target.name;
        const newText = e.target.value;
        const lines = newText.split('\n');

        // Menambahkan tanda bulatan hanya pada awal setiap baris yang belum memiliki tanda bulatan
        const bulletedText = lines.map((line, index) => {
            // Periksa apakah baris tidak kosong dan belum memiliki tanda bulatan
            if (line.trim() !== '' && !line.startsWith('• ')) {
                return `• ${line}`;
            } else if (line.trim() === '•' && lines[index - 1] && lines[index - 1].startsWith('• ') || line.trim() === '•') {
                // Hapus tanda bulatan jika baris kosong dan baris sebelumnya memiliki tanda bulatan
                return '';
            }
            return line;
        }).join('\n');

        // Memperbarui nilai textarea
        if (name == 'willDo') {
            setWillDoJob(bulletedText)
        } else if (name == 'whyJoin') {
            setWhyJoin(bulletedText)
        } else if (name == 'requirements') {
            setRequirements(bulletedText)
        } else if (name == 'offer') {
            setOffer(bulletedText)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Persiapkan data yang akan dikirimkan ke API
        const data = new FormData();
        data.append('name', e.target.name.value);
        data.append('type', e.target.type.value);
        data.append('kontrakStart', e.target.kontrakStart.value);
        data.append('kontrakEnd', e.target.kontrakEnd.value);
        data.append('gajiLower', e.target.gajiLower.value);
        data.append('gajiUpper', e.target.gajiUpper.value);
        data.append('kuota', e.target.kuota.value);
        data.append('latestApplyDate', e.target.latestApplyDate.value);
        data.append('thumbnail', e.target.thumbnail.files[0]);
        data.append('clientId', e.target.client.value)
        data.append('description', e.target.description.value);
        data.append('whyJoin', e.target.whyJoin.value);
        data.append('willDo', e.target.willDo.value);
        data.append('requirements', e.target.requirements.value);
        data.append('offer', e.target.offer.value);
        console.log(e.target.client.value);
        try {
            const response = await api.post(`/job/${idJob}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                sessionStorage.setItem('edit-job-status', 'success');
                navigate('/admin/job');
            } else {
                console.error("Fail API");
                setNotif('fail');
                setTimeout(() => {
                    setNotif('');
                }, 5000);

            }
        } catch (error) {
            console.error('Error:', error);
            setNotif('fail');
            setTimeout(() => {
                setNotif('');
            }, 5000);
        }

    };

    const handleInputChangeNormal = (e) => {
        const { name, value } = e.target;
        setJob({
            ...job,
            [name]: value,
        });
    };

    useEffect(() => {
        const validate = () => {
            if (!validateStartAndEndDate(job.kontrakStart, job.kontrakEnd)) {
                setErr(prevErr => ({
                    ...prevErr,
                    contractStartErr: `Contract start must be earlier than contract end!`,
                    contractEndErr: `Contract end must be paster than contract start!`
                }));
            } else {
                setErr(prevErr => ({
                    ...prevErr,
                    contractStartErr: ``,
                    contractEndErr: ``
                }));
            }

            if (parseFloat(job.gajiLower) > parseFloat(job.gajiUpper)) {
                setErr(prevErr => ({
                    ...prevErr,
                    salaryLowerErr: `Salary lower must be lower than salary upper!`,
                    salaryUpperErr: `Salary upper must be higher than salary lower!`
                }));
            } else {
                setErr(prevErr => ({
                    ...prevErr,
                    salaryLowerErr: ``,
                    salaryUpperErr: ``
                }));
            }

            if (job.kuota <= 0) {
                setErr(prevErr => ({
                    ...prevErr,
                    kuotaErr: `Invalid kuota number`
                }));
            } else {
                setErr(prevErr => ({
                    ...prevErr,
                    kuotaErr: ``
                }));
            }
        }
        if (job) {
            validate();
        }
    }, [job])


    return (
        <>
            {job && (

                <div className="p-4 w-100">
                    <div className="w-100 bg-clear p-4"
                        style={{ overflowY: 'scroll', height: '95%', borderRadius: '1rem' }}>
                        <div className="col-12">
                            <img src={`${thumbnail ? thumbnail : ''}`} alt="" style={{
                                width: '100%',
                                height: '20rem',
                                objectFit: 'cover',
                                borderBottom: '10px solid  #702F8A'
                            }} />
                        </div>
                        <div className="mt-5 form-container w-100 px-4">
                            <form onSubmit={handleSubmit}>
                                <div className="d-flex flex-row">

                                    <img src={`${apiURL}/storage/client/${job.client.companyLogo}`} alt=""
                                        className='rounded mt-5'
                                        style={{ width: '20rem', height: "20rem", objectFit: 'cover' }} />

                                    <div className="box w-100">
                                        {notif != '' && notif == 'fail' && (
                                            <NotifFloatAdmin status="fail" text={'Failed to edit Job'} />
                                        )}
                                        <div className="d-flex flex-row justify-content-center gap-4">
                                            <div className="col-5">
                                                <div className="mb-3">
                                                    <label htmlFor="name" className="form-label fw-semibold">Job
                                                        Name</label>
                                                    <input type="text" className="form-control" id="name"
                                                        aria-describedby="emailHelp" name='name' value={job.name}
                                                        onChange={handleInputChangeNormal} />
                                                    {/* <div id="err" className="form-text text-danger">We'll never share your email with anyone else.</div> */}
                                                </div>
                                            </div>
                                            <div className="col-5">
                                                <label htmlFor="name" className="form-label fw-semibold">Job
                                                    Type</label>
                                                <select className="form-select" aria-label="Default select example"
                                                    name='type' value={jobType} onChange={handleSelectChange}>
                                                    <option value='select'>-- select --</option>
                                                    <option value="Freelance">Freelance</option>
                                                    <option value="Part Time">Part Time</option>
                                                    <option value="Full Time">Full Time</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row justify-content-center gap-4">
                                            <div className="col-5">
                                                <div className="mb-3">
                                                    <label htmlFor="kontrakStart" className="form-label fw-semibold">Contract
                                                        Start Date</label>
                                                    <input type="Date" className="form-control" id="konrakStart"
                                                        aria-describedby="contract start" name='kontrakStart'
                                                        value={job.kontrakStart} onChange={handleInputChangeNormal} />
                                                    {err.contractStartErr && (
                                                        <div id="err" className=" text-danger"><i className="fa-solid fa-triangle-exclamation me-2"></i>{err.contractStartErr} !</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-5">
                                                <div className="mb-3">
                                                    <label htmlFor="kontrakEnd" className="form-label fw-semibold">Contract
                                                        End Date</label>
                                                    <input type="Date" className="form-control" id="kontrakEnd"
                                                        aria-describedby="contract end" name='kontrakEnd'
                                                        value={job.kontrakEnd} onChange={handleInputChangeNormal} />
                                                    {err.contractEndErr && (
                                                        <div id="err" className=" text-danger"><i className="fa-solid fa-triangle-exclamation me-2"></i>{err.contractEndErr} !</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row justify-content-center gap-4">
                                            <div className="col-5">
                                                <div className="mb-3">
                                                    <label htmlFor="gajiLower" className="form-label fw-semibold">Salary
                                                        Lower</label>
                                                    <input type="number" className="form-control" id="gajiLower"
                                                        aria-describedby="gajiLower" name='gajiLower'
                                                        value={job.gajiLower} onChange={handleInputChangeNormal} />
                                                    {err.salaryLowerErr && (
                                                        <div id="err" className=" text-danger"><i className="fa-solid fa-triangle-exclamation me-2"></i>{err.salaryLowerErr} !</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-5">
                                                <div className="mb-3">
                                                    <label htmlFor="gajiUpper" className="form-label fw-semibold">Salary
                                                        Upper</label>
                                                    <input type="number" className="form-control"
                                                        id="gajiUppergajiUpper" aria-describedby="gajiUpper"
                                                        name='gajiUpper' value={job.gajiUpper}
                                                        onChange={handleInputChangeNormal} />
                                                    {err.salaryUpperErr && (
                                                        <div id="err" className=" text-danger"><i className="fa-solid fa-triangle-exclamation me-2"></i>{err.salaryUpperErr} !</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row justify-content-center gap-4">
                                            <div className="col-5">
                                                <div className="mb-3">
                                                    <label htmlFor="kuota"
                                                        className="form-label fw-semibold">Kuota</label>
                                                    <input type="number" className="form-control" id="kuota"
                                                        aria-describedby="kuota" name='kuota' value={job.kuota}
                                                        onChange={handleInputChangeNormal} />
                                                    {err.kuotaErr && (
                                                        <div id="err" className=" text-danger"><i className="fa-solid fa-triangle-exclamation me-2"></i>{err.kuotaErr} !</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-5">
                                                <div className="mb-3">
                                                    <label htmlFor="latestApplyDate" className="form-label fw-semibold">Latest
                                                        Apply Date</label>
                                                    <input type="Date" className="form-control" id="latestApplyDate"
                                                        aria-describedby="latestApplyDate" name='latestApplyDate'
                                                        value={job.latestApplyDate}
                                                        onChange={handleInputChangeNormal} />
                                                    {err.latestApplyDateErr && (
                                                        <div id="err" className=" text-danger"><i className="fa-solid fa-triangle-exclamation me-2"></i>{err.latestApplyDateErr} !</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row justify-content-center gap-4">
                                            <div className="col-5">
                                                <div className="mb-3">
                                                    <label htmlFor="thumbnail"
                                                        className="form-label fw-semibold">Thumbnail</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        id="thumbnail"
                                                        name="thumbnail"
                                                        accept=".jpg, .png, .jpeg"
                                                        onChange={handleFileChange}
                                                    />
                                                    <div id="emailHelp" className="form-text fst-italic text-blue">Leave
                                                        blank
                                                        if you do not want to change the job's thumbnail !
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-5">
                                                <label htmlFor="client"
                                                    className="form-label fw-semibold">Client</label>
                                                <select className="form-select" id='client'
                                                    aria-label="Default select example" name='client'
                                                    value={clientSelect} onChange={handleSelectChange}>
                                                    <option value='select'>-- select --</option>
                                                    {clients.map((client) => (
                                                        <option key={client.id}
                                                            value={client.id}>{client.companyName} -- {client.picName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                    </div>
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="description" className='form-label fw-semibold'>Description</label>
                                    <textarea className="form-control" placeholder="Type here..." id="description"
                                        rows={5} name='description' value={job.description}
                                        onChange={handleInputChangeNormal}></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="whyJoin" className='form-label fw-semibold'>Why Join ?</label>
                                    <textarea className="form-control" placeholder="Type here..." id="whyJoin" rows={5}
                                        value={whyJoin} onChange={handleTextareaChange} name='whyJoin'></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="willDo" className='form-label fw-semibold'>Will Do ?</label>
                                    <textarea className="form-control" placeholder="Type here..." id="willDo" rows={10}
                                        value={willDoJob} onChange={handleTextareaChange}
                                        name='willDo'></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="requirements" className='form-label fw-semibold'>Requirements
                                        ?</label>
                                    <textarea className="form-control" placeholder="Type here..." id="requirements"
                                        rows={10} value={requirements} onChange={handleTextareaChange}
                                        name='requirements'></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="offer" className='form-label fw-semibold'>Offers ?</label>
                                    <textarea className="form-control" placeholder="Type here..." id="offer" rows={5}
                                        value={offer} onChange={handleTextareaChange} name='offer'></textarea>
                                </div>
                                <div className="d-flex justify-content-start">
                                    <button type="submit" className="btn fw-semibold btn-primary bg-blue border-0" disabled={btnDisable}>Save Edit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default FormEditJob