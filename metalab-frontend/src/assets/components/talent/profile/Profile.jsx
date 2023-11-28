import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../../../apiConfig/apiConfig';
import { apiURL } from '../../../main';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import Loading from '../../Loading';
import SuccessFloatNotif from '../../SuccessFloatNotif';
import FailFloatNotif from '../../FailFloatNotif';

const ProfilePage = () => {
    const [err, setErr] = useState({
        firstNameErr: '', lastNameErr: '', emailErr: '', passwordErr: '', phoneNumberErr: '', confirmPasswordErr: '', genderErr: ''
    })
    const token = Cookies.get('token_metalab');
    const [user, setUser] = useState();
    const [failUpdate, setFailUpdate] = useState('');
    const [sucUpdate, setSucUpdate] = useState('');
    const [failPass, setFailPass] = useState('');
    const [sucPass, setSucPass] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [avatar, setAvatar] = useState();
    const [gender, setGender] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState();

    useEffect(() => {
        if (user && user.avatar) {
            setAvatar(`${apiURL}/storage/avatars/${user.avatar}`);
        }
    }, [user]);

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn bg-blue text-light hover-op6 ms-2",
            cancelButton: "btn bg-danger text-light hover-op6 me-2"
        },
        buttonsStyling: false
    });

    const confirmation = (e, code) => {
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "Your profile will be edited !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, sure !",
            cancelButtonText: "No, cancel !",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                if (code == 1) {
                    handleSubmitInformation(e);
                } else {
                    handleSubmitSecurity(e);
                }

            }
        });
    }

    useEffect(() => {
        const fetchDataTalent = async () => {
            // setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/profil`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.status === 200) {
                        if (response.data.user.status == "Disable") {
                            navigate('/logout');
                        }
                        setUser(response.data.user);
                        setGender(response.data.user.gender);
                    }
                    // setLoading(false);
                } catch (error) {
                    // setLoading(false);
                    console.error('Error:', error);
                }
            }
        };
        fetchDataTalent();
    }, []);

    const handleInputChangeNormal = (e) => {
        const { name, value } = e.target;
        if (name === 'firstName') {
            if (e.target.value === '') {
                setErr({
                    ...err, firstNameErr: 'First name is empty'
                });
                setBtnDisabled(true);
            } else if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
                setErr({
                    ...err, firstNameErr: 'Invalid first name'
                });
                setBtnDisabled(true);
            } else {
                setErr({
                    ...err, firstNameErr: ''
                });
                setBtnDisabled(false);
            }
        } else if (name === 'lastName') {
            if (e.target.value === '') {
                setErr({
                    ...err, lastNameErr: 'Last name is empty'
                });
                setBtnDisabled(true);
            } else if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
                setErr({
                    ...err, lastNameErr: 'Invalid last name'
                });
                setBtnDisabled(true);
            } else {
                setErr({
                    ...err, lastNameErr: ''
                });
                setBtnDisabled(false);
            }
        } else if (name === 'email') {
            if (e.target.value === '') {
                setErr({
                    ...err, emailErr: 'Email is empty'
                });
                setBtnDisabled(true);
            } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
                setErr({
                    ...err, emailErr: 'Invalid email'
                })
                setBtnDisabled(true);
            } else {
                setErr({
                    ...err, emailErr: ''
                });
                setBtnDisabled(false);
            }
        } else if (name === 'phoneNumber') {
            if (e.target.value === '') {
                setErr({
                    ...err, phoneNumberErr: 'Phone number is empty'
                });
                setBtnDisabled(true);
            } else if (!/^[0-9+]+$/.test(value)) {
                setErr({
                    ...err, phoneNumberErr: 'Invalid phone number'
                });
                setBtnDisabled(true);
            } else {
                setErr({
                    ...err, phoneNumberErr: ''
                });
                setBtnDisabled(false);
            }
        } else if (name === 'password') {
            setPassword(value);
            if (value.length < 6) {
                setErr({
                    ...err, passwordErr: 'Password must at least 6 character'
                });
                setBtnDisabled(true);
            } else {
                setErr({
                    ...err, passwordErr: ''
                });
                setBtnDisabled(false);
            }
        } else if (name === 'gender') {
            if (value == 0) {
                setErr({
                    ...err, genderErr: 'Please select gender'
                });
                setBtnDisabled(true);
            } else {
                setErr({
                    ...err, genderErr: ''
                });
                setGender(value);
                setBtnDisabled(false);
            }
        }

        setUser({
            ...user,
            [name]: value,
        });
    };

    useEffect(() => {
        if (passwordConfirmation != password && passwordConfirmation) {
            setErr({
                ...err, confirmPasswordErr: 'Confirm password does not match !'
            })
            setBtnDisabled(true);
        } else {
            setErr({
                ...err, confirmPasswordErr: ''
            })
            setBtnDisabled(false);
        }
    }, [password, passwordConfirmation])

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatar(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitInformation = async (data) => {
        try {
            setLoading(true);
            const response = await api.post(`/profil/edit/${user.id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setLoading(false);
                setSucUpdate('Your profile have been updated !')
            } else {
                setLoading(false);
                setFailUpdate(response.data.message);
            }
            setTimeout(() => {
                setSucUpdate('');
                setFailUpdate('')
            }, 3000);
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
        }
    }

    const handleSubmitSecurity = async (data) => {
        setLoading(true);
        try {
            const response = await api.post(`/profil/edit-password/${user.id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response) {
                if (response.status === 200) {
                    setSucPass('Password was successfully changed.');
                } else {
                    setFailPass(response.data.message);
                }
                setLoading(false);
                setTimeout(() => {
                    setSucPass('');
                    setFailPass('');
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            setFailPass('Failed to edit password !')
            setTimeout(() => {
                setFailPass('');
            }, 3000);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('firstName', e.target.firstName.value);
        data.append('lastName', e.target.lastName.value);
        data.append('email', e.target.email.value);
        data.append('gender', e.target.gender.value);
        data.append('phoneNumber', e.target.phoneNumber.value);
        data.append('avatar', e.target.avatar.files[0]);
        data.append('password', user.password);
        confirmation(data, 1);
    };

    const handleFormSecuritySubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('password', user.password);
        confirmation(data, 2);
    };

    return (
        <>
            {user && (
                <div className="container d-flex flex-column align-items-center mt-4 gap-4">
                    <div className="col-lg-7 col-md-12 rounded shadow p-4">
                        <form onSubmit={(e) => handleFormSubmit(e)}>
                            <div className="d-flex flex-column gap-3">
                                <div className="row mb-3">
                                    <div className="profile-pic">
                                        {/*yahya: benerin z-index biar tidak menimpa navbar*/}
                                        <label className="label z-2" htmlFor="file">
                                            <span className="glyphicon glyphicon-camera" />
                                            <span>Change Photo</span>
                                        </label>
                                        <input id="file" type="file" name="avatar" onChange={handleFileChange} />
                                        <img src={`${avatar ? avatar : '/images/avatar-default.png'}`} id="avatar" width={200} alt="avatar" />
                                    </div>
                                    <div className="col d-flex justify-content-center text-center w-100 my-4">
                                        <h3 className="name text-center rounded-5 px-3 py-1">{user.firstName + " " + user.lastName}</h3>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <h3 className="subheading h3 mb-4">Information</h3>
                                        <hr />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <h6 className="h6">First Name</h6>
                                        <input type="text" className="text-input w-100 p-2 border-0 rounded-3"
                                            id="firstName" aria-describedby="firstName" name='firstName'
                                            value={user.firstName} onChange={handleInputChangeNormal} />
                                        {err.firstNameErr != '' && (
                                            <div className="alert alert-warning d-flex align-items-center gap-3 my-2 w-100" role="alert" style={{ height: '1rem' }}>
                                                <i className="fa-solid fa-triangle-exclamation"></i>
                                                <div>
                                                    {err.firstNameErr}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <h6 className="h6">Last Name</h6>
                                        <input type="text" className="text-input w-75 p-2 border-0 rounded-3"
                                            id="lastName" aria-describedby="lastName" name='lastName'
                                            value={user.lastName} onChange={handleInputChangeNormal} />
                                        {err.lastNameErr != '' && (
                                            <div className="alert alert-warning d-flex align-items-center gap-3 my-2 w-100" role="alert" style={{ height: '1rem' }}>
                                                <i className="fa-solid fa-triangle-exclamation"></i>
                                                <div>
                                                    {err.lastNameErr}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <h6 className="h6">Gender</h6>
                                        <select className="form-select border-0 w-100" id="gender" name="gender" value={gender}
                                            onChange={(e) => setGender(e.target.value)}>
                                            <option value="">Gender</option>
                                            <option key={1} value='Male'>Male</option>
                                            <option key={2} value='Female'>Female</option>
                                        </select>
                                        {err.genderErr != '' && (
                                            <div className="alert alert-warning d-flex align-items-center gap-3 my-2 w-100" role="alert" style={{ height: '1rem' }}>
                                                <i className="fa-solid fa-triangle-exclamation"></i>
                                                <div>
                                                    {err.genderErr}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <h6 className="h6">Email</h6>
                                        <input type="email" className="text-input w-75 p-2 border-0 rounded-3"
                                            value={user.email}
                                            id="email" aria-describedby="email" name='email'
                                            onChange={handleInputChangeNormal} />
                                        {err.emailErr != '' && (
                                            <div className="alert alert-warning d-flex align-items-center gap-3 my-2 w-100" role="alert" style={{ height: '1rem' }}>
                                                <i className="fa-solid fa-triangle-exclamation"></i>
                                                <div>
                                                    {err.emailErr}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <h6 className="h6">Phone Number</h6>
                                        <input type="text" className="text-input w-75 p-2 border-0 rounded-3"
                                            id="phoneNumber" aria-describedby="phoneNumber" name='phoneNumber'
                                            value={user.phoneNumber} onChange={handleInputChangeNormal} />
                                        {err.phoneNumberErr != '' && (
                                            <div className="alert alert-warning d-flex align-items-center gap-3 my-2 w-100" role="alert" style={{ height: '1rem' }}>
                                                <i className="fa-solid fa-triangle-exclamation"></i>
                                                <div>
                                                    {err.phoneNumberErr}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {failUpdate !== '' && (
                                    <FailFloatNotif message={failUpdate} />
                                )}
                                {sucUpdate !== '' && (
                                    <SuccessFloatNotif message={sucUpdate} />
                                )}
                                <div className="row">
                                    <div className="d-flex justify-content-between">
                                        <input className="btn bg-blue text-light hover-op6" type="submit" disabled={btnDisabled} value="Save" />
                                        <button className='btn bg-orange text-light hover-op6' type='button' onClick={() => setShowEditPassword(!showEditPassword)}>{!showEditPassword ? 'Show Edit Password' : 'Hidden Edit Password'}</button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                    {showEditPassword && (
                        <div className="smooth-transition col-lg-7 col-12 rounded shadow p-4">
                            <form onSubmit={(e) => handleFormSecuritySubmit(e)} method="post">
                                <div className="d-flex flex-column gap-3">
                                    <div className="row">
                                        <div className="col">
                                            <h3 className="subheading h3 mb-4">Security</h3>
                                            <hr />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <h6 className="h6">Password</h6>
                                            <input
                                                type="password"
                                                className="text-input w-75 p-2 border-0 rounded-3"
                                                id="password" aria-describedby="password" name='password' placeholder="Enter new password"
                                                onChange={handleInputChangeNormal}
                                                required
                                            />
                                            {err.passwordErr != '' && (
                                                <div className="alert alert-warning d-flex align-items-center gap-3 my-2 w-75" role="alert" style={{ height: '1rem' }}>
                                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                                    <div>
                                                        {err.passwordErr}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <h6 className="h6">Repeat Password</h6>
                                            <input
                                                type="password"
                                                className="text-input w-75 p-2 border-0 rounded-3"
                                                id="confirmPassword" aria-describedby="confirmPassword" name='confirmPassword' placeholder="Re-enter password"
                                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                required
                                            />
                                            {err.confirmPasswordErr != '' && (
                                                <div className="alert alert-warning d-flex align-items-center gap-3 my-2 w-75" role="alert" style={{ height: '1rem' }}>
                                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                                    <div>
                                                        {err.confirmPasswordErr}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {failPass !== '' && (
                                        <FailFloatNotif message={failPass} />
                                    )}
                                    {sucPass !== '' && (
                                        <SuccessFloatNotif message ={sucPass}/>
                                    )}
                                    <div className="row">
                                        <div className="col">
                                            <input className="btn bg-blue text-light hover-op6" type="submit" disabled={btnDisabled} value="Change Password" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
            {loading && (
                <Loading />
            )}
        </>
    )
}

export default ProfilePage;