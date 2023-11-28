import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../apiConfig/apiConfig';
import Cookies from 'js-cookie';
import Loading from '../Loading';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

const Logout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    useEffect(() => {
        setLoading('true');
        if (Cookies.get('token_metalab')) {
            try {
                const response = api.post(`/logout`, {}, {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token_metalab')}`
                    }
                });
                if (response) {
                    Cookies.remove('token_metalab');
                    Cookies.remove('role_metalab');
                    Cookies.remove('email_metalab');
                    Cookies.remove('id_metalab');
                    navigate('/');
                }
                setLoading('false');
            } catch (error) {
                console.error('Error:', error);
                setLoading('true');
            }
        }
    }, [])
    return (
        <>
            {loading && (
                <Loading />

            )}
        </>
    )
}

export default Logout