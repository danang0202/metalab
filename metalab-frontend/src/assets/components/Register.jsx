import { useState } from "react";
import api from "../apiConfig/apiConfig";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import { useEffect } from "react";



function Register() {
    const [err, setErr] = useState({
        firstNameErr: '', lastNameErr: '', emailErr: '', passwordErr: '', phoneNumberErr: '', confirmPasswordErr: '', genderErr: ''
    })
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [failreg, setFailReg] = useState('');
    const [sucReg, setSucReg] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        if (name === 'firstName') {
            if (e.target.value === '') {
                setErr({
                    ...err, firstNameErr: 'First name is empty !'
                })
            } else if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
                setErr({
                    ...err, firstNameErr: 'Invalid first name !'
                })
            } else {
                setErr({
                    ...err, firstNameErr: ''
                })
            }
        } else if (name === 'lastName') {
            if (e.target.value === '') {
                setErr({
                    ...err, lastNameErr: 'Last name is empty !'
                })
            } else if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
                setErr({
                    ...err, lastNameErr: 'Invalid last name !'
                })
            } else {
                setErr({
                    ...err, lastNameErr: ''
                })
            }
        } else if (name === 'email') {
            if (e.target.value === '') {
                setErr({
                    ...err, emailErr: 'Email is empty !'
                })
            } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
                setErr({
                    ...err, emailErr: 'Invalid email name !'
                })
            } else {
                setErr({
                    ...err, emailErr: ''
                })
            }
        } else if (name === 'phoneNumber') {
            if (e.target.value === '') {
                setErr({
                    ...err, phoneNumberErr: 'Phone number is empty !'
                })
            } else if (!/^[0-9+]+$/.test(value)) {
                setErr({
                    ...err, phoneNumberErr: 'Invalid phone number !'
                })
            } else {
                setErr({
                    ...err, phoneNumberErr: ''
                })
            }
        } else if (name === 'password') {
            setPassword(value);
            if (value.length < 6) {
                setErr({
                    ...err, passwordErr: 'Password minimal 6 character !'
                })
            } else {
                setErr({
                    ...err, passwordErr: ''
                })
            }
        } else if (name === 'passwordConfirmation') {
            setPasswordConfirmation(value);
        } else if (name === 'gender') {
            if (value == 0) {
                setErr({
                    ...err, genderErr: 'Please select gender !'
                })
            } else {
                setErr({
                    ...err, genderErr: ''
                })
            }
        }
    };

    useEffect(() => {
        if (passwordConfirmation != password && passwordConfirmation) {
            setErr({
                ...err, confirmPasswordErr: 'Confirm password does not match !'
            })
        } else {
            setErr({
                ...err, confirmPasswordErr: ''
            })
        }
    }, [password, passwordConfirmation])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                firstName: e.target.firstName.value,
                lastName: e.target.lastName.value,
                email: e.target.email.value,
                phoneNumber: e.target.phoneNumber.value,
                password: e.target.password.value,
                gender: e.target.gender.value,
            };
            const response = await api.post('/register', data, {
            });
            if (response.status === 201) {
                setLoading(false)
                setSucReg('Registration is successful, please open your email for validation')
            } else if (response.status === 200) {
                setLoading(false)
                setFailReg(response.data.message);
                setTimeout(() => {
                    setFailReg('');
                }, 3000);
            }
        } catch (error) {
            setLoading(false)
            setFailReg('Registration Fail');
            setTimeout(() => {
                setFailReg('');
            }, 3000);
        }
    }
    return (
        <>
            <div className="container d-flex justify-content-center d-flex align-items-center" style={{ height: '100vh' }}>
                <div className='d-none d-md-none d-lg-block'>
                    <div className="container-fluid d-flex justify-content-center">
                        <div className='d-flex flex-row col-7 shadow-lg'>
                            <div className="form-container bg-clear col-8 p-5">
                                <div className="logo-container mb-2 d-flex align-items-center flex-column gap-4 text-blue">
                                    <img src="/images/metalab-logo.png" alt="Fail image ..." style={{ width: '10rem' }} />
                                    <p>Please register your account !</p>
                                </div>
                                {failreg !== '' && (
                                    <div className="alert alert-danger d-flex align-items-center gap-3 my-2" role="alert">
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                        <div>
                                            {failreg}
                                        </div>
                                    </div>
                                )}
                                {sucReg !== '' && (
                                    <div className="alert alert-success d-flex align-items-center gap-3 my-2" role="alert">
                                        <i className="fa-solid fa-circle-check"></i>
                                        <div>
                                            {sucReg}
                                        </div>
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="d-flex flex-row gap-4">
                                        <div className="mb-3">
                                            <input onChange={handleChange} type="text" name='firstName' className="form-control" aria-label='firstName' placeholder='First Name' />
                                        </div>
                                        <div className="mb-3">
                                            <input onChange={handleChange} type="text" name='lastName' className="form-control" aria-label='lastName' placeholder='Last Name' />
                                        </div>
                                    </div>
                                    {err.firstNameErr != '' && (
                                        <div className="alert alert-warning d-flex align-items-center gap-3 my-2" role="alert" style={{ height: '1rem' }}>
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                            <div>
                                                {err.firstNameErr}
                                            </div>
                                        </div>
                                    )}
                                    {err.lastNameErr != '' && (
                                        <div className="alert alert-warning d-flex align-items-center gap-3 my-2" role="alert" style={{ height: '1rem' }}>
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                            <div>
                                                {err.lastNameErr}
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <input onChange={handleChange} type="text" name='phoneNumber' className="form-control" aria-label='PhoneNumber' placeholder='Phone Number' />
                                    </div>
                                    {err.phoneNumberErr != '' && (
                                        <div className="alert alert-warning d-flex align-items-center gap-3 my-2" role="alert" style={{ height: '1rem' }}>
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                            <div>
                                                {err.phoneNumberErr}
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <input onChange={handleChange} type="email" name='email' className="form-control" aria-label='Email' placeholder='Email' />
                                    </div>
                                    {err.emailErr != '' && (
                                        <div className="alert alert-warning d-flex align-items-center gap-3 my-2" role="alert" style={{ height: '1rem' }}>
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                            <div>
                                                {err.emailErr}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <select className="form-select" id="gender" name="gender" onChange={handleChange}>
                                            <option value="0">Gender</option>
                                            <option key={1} value='Male'>Male</option>
                                            <option key={2} value='Female'>Female</option>
                                        </select>
                                    </div>

                                    {err.genderErr != '' && (
                                        <div className="alert alert-warning d-flex align-items-center gap-3 my-2" role="alert" style={{ height: '1rem' }}>
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                            <div>
                                                {err.genderErr}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <input onChange={handleChange} type="password" name='password' className="form-control" aria-label='password' placeholder='Password' />
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
                                        <input onChange={handleChange} type="password" name='passwordConfirmation' className="form-control" aria-label='konfirmasiPassword' placeholder='Confirm Password' />
                                    </div>
                                    {err.confirmPasswordErr != '' && (
                                        <div className="alert alert-warning d-flex align-items-center gap-3 my-2" role="alert" style={{ height: '1rem' }}>
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                            <div>
                                                {err.confirmPasswordErr}
                                            </div>
                                        </div>
                                    )}

                                    <button type="submit" className="btn btn-primary w-100 fw-bold mt-3 text-light">Sign Up</button>
                                </form>
                                <div className="box-container d-flex flex-row gap-5 align-items-center text-underline mt-4">
                                    <div className='d-flex'>
                                        <h5 className='fs-6 fw-normal text-orange'>Already have an account ?</h5>
                                    </div>
                                    <Link to={`/login`}>
                                        <p className='btn btn-outline-warning'>Login</p>
                                    </Link><div></div>

                                </div>
                            </div>
                            <div className="box-container bg-orange d-flex flex-column w-100 pt-5 gap-3">
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
            {loading &&
                <Loading />
            }

        </>
    )
}

export default Register;


