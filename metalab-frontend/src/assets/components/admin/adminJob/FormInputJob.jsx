import { useState } from 'react';
import Cookies from 'js-cookie';
import api from '../../../apiConfig/apiConfig';
import { isFutureDatetime, validateStartAndEndDate } from '../../../main';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const FormInputJob = () => {
    const navigate = useNavigate();
    const [willDoJob, setWillDoJob] = useState("");
    const [whyJoin, setWhyJoin] = useState("");
    const [requirements, setRequirements] = useState("");
    const [offer, setOffer] = useState("");
    const [clients, setClients] = useState([]);
    const token = Cookies.get('token_metalab');
    const [clientSelect, setClientSelect] = useState('select')
    const [jobType, setJobType] = useState('select')
    const [errCal, setErrCal] = useState('');
    const [errSalaryUpper, setErrSalaryUpper] = useState();
    const [errSalarylower, setErrSalaryLower] = useState();
    const [salaryUpper, setSalaryUpper] = useState(0);
    const [salaryLower, setSalaryLower] = useState(0);
    const [contractStart, setContractStart] = useState();
    const [contractEnd, setContractEnd] = useState();
    const [contractStartErr, setContractStartErr] = useState();
    const [contractEndErr, setContractEndErr] = useState();
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [typeJobErr, setTypeJobErr] = useState();
    const [clientErr, setClientErr] = useState();
    const [kuotaErr, setKuotaErr] = useState();
    const [notif, setNotif] = useState('');
    const [thumbnail, setThumbnail] = useState();

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
    }, []);

    const handleSelectChange = (e) => {
        if (e.target.name == 'client') {
            setClientSelect(e.target.value);
        } else {
            setJobType(e.target.value)
        }

    }
    useEffect(() => {
        if (jobType == 'Part Time' || jobType == 'Full Time') {
            setClientSelect(1)
        }
    }, [jobType, clientSelect])

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
        try {
            const response = await api.post('/job', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                sessionStorage.setItem('add-job-status', 'success')
                navigate('/admin/job');
            } else {
                setNotif('fail');
                setTimeout(() => {
                    setNotif('');
                }, 5000);
                console.error("Fail API");
            }
        } catch (error) {
            console.error('Error:', error);
            setNotif('fail');
            setTimeout(() => {
                setNotif('');
            }, 5000);
        }

    };

    const validate = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        if (name == 'latestApplyDate') {
            if (!isFutureDatetime(value)) {
                setErrCal('Invalid latest apply date');
                setBtnDisabled(true);

            } else {
                setErrCal('');
                setBtnDisabled(false);
            }
        } else if (name == 'kuota') {
            if (value <= 0) {
                setBtnDisabled(true);
                setKuotaErr('Invalid Kuota !')
            } else {
                setKuotaErr('');
                setBtnDisabled(false);
            }
        }
    }

    useEffect(() => {
        setBtnDisabled(true);
        if (contractStart && !isFutureDatetime(contractStart)) {
            setContractStartErr('Invalid Contract Start')
        } else if (contractStart && contractEnd && !validateStartAndEndDate(contractStart, contractEnd)) {
            setContractStartErr('Contract start must be earlier than contract end')
            setContractEndErr('Contract end must be paster than contract start')
        }
        else {
            setContractStartErr('')
            setBtnDisabled(false);
        }
    }, [contractStart])

    useEffect(() => {
        setBtnDisabled(true);
        if (contractEnd && !isFutureDatetime(contractEnd)) {
            setContractEndErr('Invalid Contract Start')
        } else if (contractStart && contractEnd && !validateStartAndEndDate(contractStart, contractEnd)) {
            setContractStartErr('Contract start must be earlier than contract end')
            setContractEndErr('Contract end must be paster than contract start')
        }
        else {
            setContractEndErr('')
            setBtnDisabled(false);
        }
    }, [contractEnd])

    useEffect(() => {
        setBtnDisabled(true);
        if (parseFloat(salaryLower) > parseFloat(salaryUpper)) {
            setErrSalaryLower("Salary lower must be lower than salary upper");
            setErrSalaryUpper('Salary upper must be higher than salary lower');

        } else {
            setErrSalaryLower('');
            setErrSalaryUpper('');
            setBtnDisabled(false);
        }
    }, [salaryLower, salaryUpper])

    useEffect(() => {
        if (clientSelect == 'select') {
            setClientErr("Please choose client");
        } else {
            setClientErr('')
        }
    }, [clientSelect])

    useEffect(() => {
        if (jobType == 'select') {
            setTypeJobErr("Please choose type job");
        } else {
            setTypeJobErr('')
        }
    }, [jobType])

    return (
        <>
            <div className="container-fluid w-100 d-flex align-items-center mx-4" style={{ borderRadius: '0rem', height: '98%' }}>
                <div className="container px-5 w-100 py-3 px-lg-5 px-md-3 bg-clear" style={{ overflowY: 'scroll', height: '95%', borderRadius: '1rem' }}>
                    {notif != '' && notif == 'fail' && (
                        <div className="d-flex justify-content-center w-100">
                            <div className="alert alert-danger col-4 text-center" role="alert">
                                <i className="text-danger fa-solid fa-circle-xmark me-2"></i>Failed to add new job !
                            </div>
                        </div>
                    )}
                    <div className="d-flex justify-content-center">
                        <h4><span className="badge bg-orange rounded-pill">Form Input Job</span></h4>
                    </div>
                    <hr />
                    <div className="col-12 mb-4">
                        {thumbnail && (
                            <img src={`${thumbnail ? thumbnail : ''}`} alt="Thumbnail will appear here !" style={{
                                width: '100%',
                                height: '20rem',
                                objectFit: 'cover',
                                borderBottom: '10px solid  #702F8A'
                            }} />
                        )}

                    </div>
                    <div className="form-container">
                        <form onSubmit={handleSubmit}>
                            <div className="d-flex flex-row justify-content-center gap-lg-5 gap-md-2">
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label fw-semibold">Job Name</label>
                                        <input type="text" className="form-control" id="name" aria-describedby="emailHelp" name='name' required />
                                        {/* <div id="err" className="form-text text-danger">We'll never share your email with anyone else.</div> */}
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="thumbnail" className="form-label fw-semibold">Thumbnail</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="thumbnail"
                                            name="thumbnail"
                                            accept=".jpg, .png, .jpeg"
                                            onChange={handleFileChange}
                                            required
                                        />
                                        {/* <div id="err" className="form-text text-danger">We'll never share your email with anyone else.</div> */}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-row justify-content-center gap-lg-5 gap-md-2">
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="kontrakStart" className="form-label fw-semibold">Contract Start Date</label>
                                        <input required type="Date" className="form-control" id="konrakStart" aria-describedby="contract start" name='kontrakStart' value={contractStart} onChange={(e) => setContractStart(e.target.value)} />
                                        {contractStartErr && (
                                            <div id="err" className="form-text text-danger">{contractStartErr}</div>
                                        )}

                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="kontrakEnd" className="form-label fw-semibold">Contract End Date</label>
                                        <input required type="Date" className="form-control" id="kontrakEnd" aria-describedby="contract end" name='kontrakEnd' value={contractEnd} onChange={(e) => setContractEnd(e.target.value)} />
                                        {contractEndErr && (
                                            <div id="err" className="form-text text-danger">{contractEndErr}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-row justify-content-center gap-lg-5 gap-md-2">
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="gajiLower" className="form-label fw-semibold">Salary Lower</label>
                                        <input required type="number" className="form-control" id="gajiLower" aria-describedby="gajiLower" name='gajiLower' value={salaryLower} onChange={(e) => {
                                            setSalaryLower(e.target.value)
                                        }} />
                                        {errSalarylower && (
                                            <div id="err" className="form-text text-danger"><i className="fa-solid fa-triangle-exclamation me-2"></i>{errSalarylower}</div>
                                        )}

                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="gajiUpper" className="form-label fw-semibold">Salary Upper</label>
                                        <input required type="number" className="form-control" id="gajiUpper" aria-describedby="gajiUpper" name='gajiUpper' value={salaryUpper} onChange={(e) => {
                                            setSalaryUpper(e.target.value)
                                        }} />
                                        {errSalaryUpper && (
                                            <div id="err" className="form-text text-danger"><i className="fa-solid fa-triangle-exclamation me-2"></i>{errSalaryUpper}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-row justify-content-center gap-lg-5 gap-md-2">
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="kuota" className="form-label fw-semibold">Kuota</label>
                                        <input required type="number" className="form-control" id="kuota" aria-describedby="kuota" name='kuota' onChange={(e) => validate(e)} />
                                        {kuotaErr && (
                                            <div id="err" className=" text-danger"><i className="fa-solid fa-triangle-exclamation me-2"></i>{kuotaErr}</div>
                                        )}

                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="latestApplyDate" className="form-label fw-semibold">Latest Apply Date</label>
                                        <input required type="Date" className="form-control" id="latestApplyDate" aria-describedby="latestApplyDate" name='latestApplyDate' onChange={(e) => validate(e)} />
                                        {errCal && (
                                            <div id="err" className=" text-danger"><i className="fa-solid fa-triangle-exclamation me-2"></i>{errCal} !</div>
                                        )}

                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-row justify-content-center gap-lg-5 gap-md-2">
                                <div className="col-lg-4 col-md-6">
                                    <label htmlFor="name" className="form-label fw-semibold">Job Type</label>
                                    <select className="form-select" aria-label="Default select example" name='type' value={jobType} onChange={handleSelectChange}>
                                        <option value='select'>-- select --</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Full Time">Full Time</option>
                                    </select>
                                    {typeJobErr && (
                                        <div id="err" className="form-text text-danger my-2"><i className="fa-solid fa-triangle-exclamation me-2"></i>{typeJobErr}</div>
                                    )}
                                </div>

                                <div className="col-lg-4 col-md-6">
                                    <label htmlFor="client" className="form-label fw-semibold">Client</label>
                                    <select className="form-select" id='client' aria-label="Default select example" name='client' value={clientSelect} onChange={handleSelectChange}>
                                        <option value='select'>-- select --</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>{client.companyName} -- {client.picName}</option>
                                        ))}
                                    </select>
                                    {clientErr && (
                                        <div id="err" className="form-text text-danger my-2"><i className="fa-solid fa-triangle-exclamation me-2"></i>{clientErr}</div>
                                    )}
                                </div>
                            </div>

                            <div className=" container-fluid w-100 d-flex justify-content-center mt-3">
                                <div className="col-9">

                                    <div className="mb-3">
                                        <label htmlFor="description" className='form-label fw-semibold'>Description</label>
                                        <textarea required className="form-control" placeholder="Type here..." id="description" rows={5} name='description'></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="whyJoin" className='form-label fw-semibold'>Why Join ?</label>
                                        <textarea required className="form-control" placeholder="Type here..." id="whyJoin" rows={5} value={whyJoin} onChange={handleTextareaChange} name='whyJoin'></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="willDo" className='form-label fw-semibold'>Will Do ?</label>
                                        <textarea required className="form-control" placeholder="Type here..." id="willDo" rows={10} value={willDoJob} onChange={handleTextareaChange} name='willDo'></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="requirements" className='form-label fw-semibold'>Requirements ?</label>
                                        <textarea required className="form-control" placeholder="Type here..." id="requirements" rows={10} value={requirements} onChange={handleTextareaChange} name='requirements'></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="offer" className='form-label fw-semibold'>Offers ?</label>
                                        <textarea required className="form-control" placeholder="Type here..." id="offer" rows={5} value={offer} onChange={handleTextareaChange} name='offer'></textarea>
                                    </div>

                                    <button type="submit" className="btn fw-semibold btn-primary bg-blue border-0" disabled={btnDisabled}>Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FormInputJob