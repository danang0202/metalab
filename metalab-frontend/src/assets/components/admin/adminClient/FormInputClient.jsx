import Cookies from 'js-cookie';
import api from '../../../apiConfig/apiConfig';
import {useNavigate} from 'react-router-dom';
import React, {useState} from 'react';

const FormInputClient = () => {
    const token = Cookies.get('token_metalab');
    const navigate = useNavigate();
    const [notif, setNotif] = useState('');
    const [companyLogo, setCompanyLogo] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('companyName', e.target.companyName.value);
        data.append('companyEmail', e.target.companyEmail.value);
        data.append('picName', e.target.picName.value);
        data.append('picEmail', e.target.picEmail.value);
        data.append('picPhoneNumber', e.target.picPhoneNumber.value);
        data.append('companyLogo', e.target.companyLogo.files[0]);
        console.log(data);
        try {
            const response = await api.post('/client', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                sessionStorage.setItem('add-client-status', 'success');
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

    return (
        <>
            <div className="p-4 w-100">
                <div className="p-4 bg-clear d-flex justify-content-center" style={{borderRadius: '1rem'}}>
                    <div className="col-8">
                        <div className="d-flex justify-content-center">
                            <h4><span className="badge bg-orange rounded-pill">Form Input Client</span></h4>
                        </div>
                        <hr/>
                        {notif != '' && notif == 'fail' && (
                            <div className="smooth-transition alert alert-danger" role="alert">
                                Client data failed to add !
                            </div>
                        )}
                        <div className="d-flex flex-column justify-content-center gap-4 align-items-center">
                            <img className='rounded-3' id="companyLogo"
                                 src={`${companyLogo ? companyLogo : '/images/avatar-default.png'}`}
                                 alt="Logo..." style={{width: '10rem', height: '10rem', objectFit: 'cover'}}/>
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
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn fw-semibold btn-primary bg-blue border-0">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default FormInputClient;
