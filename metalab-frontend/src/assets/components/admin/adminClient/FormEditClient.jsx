import React from 'react'
import Cookies from 'js-cookie';
import api from '../../../apiConfig/apiConfig';
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {apiURL} from '../../../main';

const FormEditClient = () => {

    const token = Cookies.get('token_metalab');
    const navigate = useNavigate();
    const [notif, setNotif] = useState('');
    const idClient = useParams().id;
    const [client, setClient] = useState();
    const [companyLogo, setCompanyLogo] = useState();

    useEffect(() => {
        if (client && client.companyLogo) {
            setCompanyLogo(`${apiURL}/storage/client/${client.companyLogo}`);
        }
    }, [client]);

    useEffect(() => {
        const fetchDataclient = async () => {
            // setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/client/${idClient}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setClient(response.data.clients);
                    }
                    // setLoading(false);
                } catch (error) {
                    // setLoading(false);
                    console.error('Error:', error);
                }
            }
        };
        fetchDataclient();
    }, [])

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setClient({
            ...client,
            [name]: value,
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCompanyLogo(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('companyName', e.target.companyName.value);
        data.append('companyEmail', e.target.companyEmail.value);
        data.append('picName', e.target.picName.value);
        data.append('picEmail', e.target.picEmail.value);
        data.append('picPhoneNumber', e.target.picPhoneNumber.value);
        data.append('companyLogo', e.target.companyLogo.files[0]);
        try {
            const response = await api.post(`/client/${idClient}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            if (response.status === 200) {
                sessionStorage.setItem('edit-client-status', 'success');
                navigate(`/admin/client`)
            } else {
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
    }
    return (
        <>
            <div className="p-4 w-100">
                <div className="p-4 bg-clear d-flex justify-content-center w-100" style={{borderRadius: '1rem'}}>
                    <div className="w-100">
                        <div className="d-flex justify-content-center">
                            <h4><span className="badge bg-orange rounded-pill">Form Edit Client</span></h4>
                        </div>
                        <hr/>
                        {notif != '' && notif == 'fail' && (
                            <div className="alert alert-danger" role="alert">
                                Fail to edit data client !
                            </div>
                        )}
                        <div className="d-flex flex-row justify-content-center gap-4 align-items-center">
                            {client &&
                                <img className='rounded-3' id="companyLogo"
                                     src={`${companyLogo ? companyLogo : '/images/avatar-default.png'}`}
                                     alt="Logo..." style={{width: '20rem', height: '20rem', objectFit: 'cover'}}/>
                            }
                            {client && (
                                <form id="myForm" className="p-2 mt-2" encType="multipart/form-data"
                                      onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <label htmlFor="companyName" className="form-label fw-semibold">
                                                Company's Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="companyName"
                                                name='companyName'
                                                placeholder="Enter Company's Name"
                                                value={client.companyName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="companyEmail" className="form-label fw-semibold">
                                                Company email
                                            </label>
                                            <input
                                                type="email"
                                                name='companyEmail'
                                                className="form-control"
                                                id="companyEmail"
                                                placeholder="Enter Company's Email"
                                                value={client.companyEmail}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <label htmlFor="picName" className="form-label fw-semibold">
                                                PIC Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='picName'
                                                id="picName"
                                                placeholder="Enter PIC Name"
                                                value={client.picName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="picEmail" className="form-label fw-semibold">
                                                PIC Email
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name='picEmail'
                                                id="picEmail"
                                                placeholder="Enter PIC Email"
                                                value={client.picEmail}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <label htmlFor="picPhoneNumber" className="form-label fw-semibold">
                                                PIC Phone Number
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name='picPhoneNumber'
                                                id="picPhoneNumber"
                                                placeholder="Enter PIC Phone Number"
                                                value={client.picPhoneNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="companyLogo" className="form-label fw-semibold">
                                                Company's Logo
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="companyLogo"
                                                name='companyLogo'
                                                accept=".jpg, .png, .jpeg"
                                                onChange={handleFileChange}
                                            />
                                            <div id="emailHelp" className="form-text fst-italic text-blue">Leave blank
                                                if you do not want to change the company's logo !
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn fw-semibold btn-primary bg-blue border-0">
                                            Save Edit
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FormEditClient