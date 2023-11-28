import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import api from '../apiConfig/apiConfig'
import { useState } from 'react';
import Loading from './Loading';


function VerificationEmail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const data = {
            id,
        };
        setLoading(true);
        api.post('/email-verification', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    navigate('/login');
                    sessionStorage.setItem('verificationEmail', 'success');
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error:', error);
            });
    });

    return (
        <>
            <div>Verification Email Fail</div>
            {loading && (
                <Loading />
            )}
        </>
    )
}

export default VerificationEmail