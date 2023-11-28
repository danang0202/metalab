import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../apiConfig/apiConfig';
import { useParams } from 'react-router-dom';
import Loading from './Loading';

const ResetPasswordForm = () => {
    const email = useParams().email;
    const token = useParams().token;
    const [password, setPassword] = useState('');
    const [notif, setNotif] = useState('');
    const [fail, setFail] = useState('');
    const [err, setErr] = useState({
        passwordErr: '', confirmPasswordErr: ''
    })
    const [loading, setLoading] = useState(false);

    // const navigate = useNavigate();

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        if (name === 'password') {
            if (value.length < 6) {
                setErr({
                    ...err, passwordErr: 'Password minimal 6 character'
                })
            } else {
                setErr({
                    ...err, passwordErr: ''
                })
                setPassword(value);
            }
        }
    }

    const checkConfirmPassword = (e) => {
        if (e.target.value !== password) {
            setErr({
                ...err, confirmPasswordErr: 'Confirm password does not match'
            })
        } else {
            setErr({
                ...err, confirmPasswordErr: ''
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            setLoading(true);
            const data = new FormData();
            data.append('email', email);
            data.append('password', e.target.password.value);
            data.append('password_confirmation', e.target.passwordConfirm.value);
            data.append('token', token);
            const response = await api.post('/reset-password', data);
            if (response.status == 200) {
                setLoading(false);
                setNotif('Success to reset password, back to login and login with your new passowrd !');
                setTimeout(() => {
                    setNotif('');
                }, 5000);
            } else {
                setFail(`Fail to reset password !`)
                setLoading(false);
                setTimeout(() => {
                    setFail('');
                }, 5000);
            }
        } catch (error) {
            setFail(`Fail to reset password !`)
            console.log(error);
            setLoading(false);
            setTimeout(() => {
                setFail('');
            }, 5000);
        }
    }

    return (
        <>
            <div className="container d-flex justify-content-center d-flex align-items-center" style={{ height: '100vh' }}>
                <div className='d-none d-md-none d-lg-block'>
                    <div className="container-fluid d-flex justify-content-center">
                        <div className='d-flex flex-row col-7 shadow-lg'>
                            <div className="form-container bg-clear col-8 p-5">
                                <div className="logo-container mb-2 d-flex align-items-center flex-column gap-4 text-purple">
                                    <img src="/images/metalab-logo.png" alt="Fail image ..." style={{ width: '10rem' }} />
                                    <p className='fw-semibold'>Reset password account!</p>
                                </div>
                                {notif !== '' && (
                                    <div className="smooth-transition alert alert-success d-flex align-items-center gap-3" role="alert">
                                        <i className="text-green fa-solid fa-circle-check"></i>
                                        <div>
                                            {notif}
                                        </div>
                                    </div>
                                )}
                                {fail !== '' && (
                                    <div className="smooth-transition alert alert-danger d-flex align-items-center gap-3" role="alert">
                                        <i className="fa-solid fa-triangle-exclamation text-danger"></i>
                                        <div>
                                            {fail}
                                        </div>
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} >
                                    <div className="mb-3">
                                        <input onChange={handleChange} type="password" name='password' className="form-control" aria-label='password' placeholder='New Password' />
                                    </div>
                                    {err.passwordErr != '' && (
                                        <div className="alert alert-warning d-flex align-items-center gap-3 my-2" role="alert" style={{ height: '1rem' }}>
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                            <div>
                                                {err.passwordErr}
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <input onChange={checkConfirmPassword} type="password" name='passwordConfirm' className="form-control" aria-label='password' placeholder='New Password Confirmation' />
                                    </div>
                                    {err.confirmPasswordErr != '' && (
                                        <div className="alert alert-warning d-flex align-items-center gap-3 my-2" role="alert" style={{ height: '1rem' }}>
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                            <div>
                                                {err.confirmPasswordErr}
                                            </div>
                                        </div>
                                    )}
                                    <button type="submit" className="btn bg-orange hover-op6 w-100 fw-bold mt-3 text-light">Reset Password</button>
                                </form>
                                <div className="box-container d-flex flex-row gap-5 align-items-center text-underline">
                                    <div className='d-flex my-3'>
                                        <Link to={'/login'} className='text-decoration-none'>
                                            <h5 className='fs-6 fw-normal hover-op6 text-orange' >Back to login?</h5>
                                        </Link>
                                    </div>
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
            </div>
            {loading && (
                <Loading />
            )}
        </>
    )
}

export default ResetPasswordForm