// eslint-disable-next-line
import React, { useState } from 'react';
import api from '../apiConfig/apiConfig';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'


// eslint-disable-next-line
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notif, setNotif] = useState('');
    const [resetPassStatus, setResetPassStatus] = useState(false);
    const [fail, setFail] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetPasswordEmailForm, setResetPasswordEmailForm] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setNotif(sessionStorage.getItem('verificationEmail'))
        setTimeout(() => {
            sessionStorage.removeItem('verificationEmail');
            setNotif('');
        }, 8000);
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Persiapkan data yang akan dikirimkan ke API
        const data = {
            email,
            password,
        };

        try {
            const response = await api.post('/login', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
            if (response.status == 200 && response.data.message === 'success') {
                const responseData = await response.data;
                Cookies.set('token_metalab', responseData.token, { expires: 7 });
                Cookies.set('role_metalab', responseData.user.role, { expires: 7 });
                Cookies.set('email_metalab', responseData.user.email, { expires: 7 });
                Cookies.set('id_metalab', responseData.user.id, { expires: 7 });
                setLoading(false);
                navigate('/')
            } else if (response.status == 204) {
                setFail('Email not registered!')
            }
            else if (response.status == 205) {
                setFail('Email has not been verified, open your email!')
            }
            else if (response.status == 206) {
                setFail('Your account has been disabled !')
            }
            setLoading(false);
            setTimeout(() => {
                setFail('');
            }, 5000);
        } catch (error) {
            setFail('Username and password does not match !')
            setLoading(false);
            setTimeout(() => {
                setFail('');
            }, 5000);
        }
    };

    const handleSubmitEmailResetPassword = async (e) => {
        e.preventDefault();
        try {
            setResetPasswordEmailForm(false);
            setLoading(true);
            const data = new FormData();
            data.append('email', e.target.email.value);
            const response = await api.post('/send-reset-link', data, {
            });
            if (response.status == 200) {
                setResetPassStatus(true);
                setLoading(false);
                setTimeout(() => {
                    setFail('');
                }, 5000);
            } else {
                setFail(`Can't send a link to your email`)
                setLoading(false);
                setTimeout(() => {
                    setFail('');
                }, 5000);
            }
        } catch (error) {
            setFail(`Can't send a link to your email`)
            setLoading(false);
            setTimeout(() => {
                setFail('');
            }, 5000);
        }

    }


    return (
        <>
            <div className="container d-flex justify-content-center d-flex align-items-center" style={{ height: '100vh' }}>
                <div className='d-lg-block'>
                    <div className="container-fluid d-flex justify-content-center">
                        <div className='d-flex flex-row col-7 shadow-lg'>
                            <div className="form-container bg-clear col-8 p-5">
                                <div className="logo-container mb-2 d-flex align-items-center flex-column gap-4 text-purple">
                                    <img src="/images/metalab-logo.png" alt="Fail image ..." style={{ width: '10rem' }} />
                                    <p>Please log in with your account!</p>
                                </div>
                                {notif == 'success' && (
                                    <div className="smooth-transition alert alert-success d-flex align-items-center gap-3 my-2" role="alert">
                                        <i className="fa-solid fa-circle-check"></i>
                                        <div>
                                            Email activation successful, please log in!
                                        </div>
                                    </div>
                                )}
                                {resetPassStatus != '' && (
                                    <div className=" smooth-transition alert alert-success d-flex align-items-center gap-3 my-2" role="alert">
                                        <i className="fa-solid fa-circle-check"></i>
                                        <div>
                                            A link to reset password has been sent to your email, please check your email
                                        </div>
                                    </div>
                                )}
                                {fail !== '' && (
                                    <div className="smooth-transition alert alert-warning d-flex align-items-center gap-3" role="alert">
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                        <div>
                                            {fail}
                                        </div>
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <input type="email" name='email' className="form-control" onChange={e => setEmail(e.target.value)} aria-label='Email' placeholder='Email' />
                                    </div>
                                    <div className="mb-3">
                                        <input type="password" name='password' className="form-control" onChange={e => setPassword(e.target.value)} aria-label='password' placeholder='Password' />
                                    </div>
                                    <button type="submit" className="btn btn-warning w-100 fw-bold mt-3 text-light">Login</button>
                                </form>
                                <p className='text-center my-3 hover-op6'><a onClick={() => setResetPasswordEmailForm(true)} className=' link-underline-primary'>Forgot Password ?</a></p>
                                <div className="box-container d-flex flex-row gap-5 align-items-center text-underline">
                                    <div className='d-flex'>
                                        <h5 className='fs-6 fw-normal'>Don&apos;t have an account?</h5>
                                    </div>
                                    <Link to={'/register'}>
                                        <p className='btn btn-outline-warning'>Register</p>
                                    </Link>
                                </div>
                            </div>
                            <div className="box-container bg-blue d-flex flex-column w-100 pt-5 gap-3">
                                <div className="img-container d-flex flex-row gap-4 justify-content-center px-4">
                                    <img src="/images/metalab-logo-clear.png" className='' alt="..." style={{ width: '10rem' }} />
                                </div>
                                <div className='d-flex flex-column align-items-center text-light h-100 w-100'>
                                    <img src="/images/login-component.png" alt="" style={{ width: '100%', height: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 
            <div className='d-none d-md-block d-lg-none'>
                <div className="container-fluid d-flex justify-content-center">
                    <div className='d-flex flex-row col-12 shadow-lg'>
                        <div className="form-container bg-clear col-7 p-5">
                            <div className="logo-container mb-2 d-flex align-items-center flex-column gap-4 text-purple">
                                <img src="/images/metalab-logo.png" alt="Fail image ..." style={{ width: '10rem' }} />
                                <p>Silahkan login dengan akun Anda !</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input type="email" name='email' className="form-control" onChange={e => setEmail(e.target.value)} aria-label='Email' placeholder='Email' />
                                </div>
                                <div className="mb-3">
                                    <input type="password" name='password' className="form-control" onChange={e => setPassword(e.target.value)} aria-label='password' placeholder='Password' />
                                </div>
                                <button type="submit" className="btn bg-orange w-100 fw-bold mt-3">Login</button>
                            </form>
                            <p className='text-center my-3'><a href="" className=' link-underline-primary'>Lupa Password ?</a></p>
                            <div className="box-container d-flex flex-row gap-5 align-items-center text-underline">
                                <div className='d-flex'>
                                    <h5 className='fs-6 fw-normal'>Belum punya akun ?</h5>
                                </div>
                                <a className='btn btn-outline-warning'>Registrasi</a>
                            </div>
                        </div>
                        <div className="box-container bg-blue d-flex flex-column w-100 pt-5 gap-3">
                            <div className="img-container d-flex flex-row gap-3 align-items-center px-5 justify-content-between">
                                <img src="/images/metalab-logo-only.png" className='bg-clear p-2 rounded' alt="..." style={{ width: '4rem' }} />
                                <h4 className='text-light'>Log In</h4>
                            </div>
                            <div className='d-flex flex-column align-items-center text-light h-100 w-100'>
                                <img src="/images/login-component.png" alt="" style={{ width: '100%', height: '100%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='d-block d-md-none d-lg-none'>
                <div className="container-fluid d-flex justify-content-center">
                    <div className='d-flex flex-row col-12 shadow-lg'>
                        <div className="form-container bg-clear col-12 p-5">
                            <div className="logo-container mb-2 d-flex align-items-center flex-column gap-4 text-purple">
                                <img src="/images/metalab-logo.png" alt="Fail image ..." style={{ width: '10rem' }} />
                                <p>Silahkan login dengan akun Anda !</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input type="email" name='email' className="form-control" onChange={e => setEmail(e.target.value)} aria-label='Email' placeholder='Email' />
                                </div>
                                <div className="mb-3">
                                    <input type="password" name='password' className="form-control" onChange={e => setPassword(e.target.value)} aria-label='password' placeholder='Password' />
                                </div>
                                <button type="submit" className="btn bg-orange w-100 fw-bold mt-3">Login</button>
                            </form>
                            <p className='text-center my-3'><a href="" className=' link-underline-primary'>Lupa Password ?</a></p>
                            <div className="box-container d-flex flex-row gap-5 align-items-center text-underline">
                                <div className='d-flex'>
                                    <h5 className='fs-6 fw-normal'>Belum punya akun ?</h5>
                                </div>
                                <a className='btn btn-outline-warning'>Registrasi</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            </div>
            {resetPasswordEmailForm && (
                <>
                    <div className="smooth-transition contaienr-form position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-semi-transparent" style={{ top: '0rem', left: '0rem' }}>
                        <div className="box bg-clear p-4 px-5 shadow col-5  border">
                            <form onSubmit={handleSubmitEmailResetPassword}>
                                <div className="mb-3">
                                    <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label fw-semibold">Input your email : </label>
                                        <i className="fa-solid fa-xmark bg-danger-t text-danger rounded-pill py-1 px-2" style={{ cursor: 'pointer', translate: '1rem -1rem' }} onClick={() => setResetPasswordEmailForm(false)}></i>
                                    </div>
                                    <input type="email" className="form-control" name='email' id="exampleFormControlInput1" placeholder="name@example.com" />
                                </div>
                                <button type='submit' className='btn bg-orange text-light hover-op6'>Submit</button>
                            </form>
                        </div>

                    </div>
                </>
            )}
            {loading && (
                <Loading />
            )}
        </>
    );
}

export default Login;