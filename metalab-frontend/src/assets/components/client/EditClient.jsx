import { useEffect, useState } from 'react';
//eslint-disable-next-line
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function FormInput() {
    const { id, searchQuery } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState([]);

    useEffect(() => {

        // Melakukan permintan ke API
        fetch('http://127.0.0.1:8000/api/client/' + id, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
            .then((data) => setClient(data.clients))
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClient({
            ...client,
            [name]: value,
        });
    };
    const handleSubmit = async (e) => {



        e.preventDefault();

        // Mengambil token dari localStorage
        const token = localStorage.getItem('token');

        // Persiapkan data yang akan dikirimkan ke API
        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            address: e.target.address.value,
            noTelp: e.target.noTelp.value,
        };


        try {
            const response = await fetch('http://127.0.0.1:8000/api/client/' + id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Menambahkan token ke header permintaan
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            console.log(data)
            console.log('separator')
            console.log(response.client)
            if (response.status == 200) {
                if (searchQuery) navigate('/client-show/' + searchQuery);
                else navigate('/client-show/');
            } else {
                console.error('Gagal mengirim data ke API');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="col-6">
                <h3 className="my-2 text-center">Formulir Input Client</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">
                            Nama
                        </label>
                        <input type="text" className="form-control" id="name" name="name" value={client.name} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">
                            Email
                        </label>
                        <input type="email" className="form-control" id="email" name="email" value={client.email} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">
                            Address
                        </label>
                        <input type="text" className="form-control" id="address" name="address" value={client.address} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">
                            Nomor Telepon
                        </label>
                        <input type="text" className="form-control" id="noTelp" name="noTelp" value={client.noTelp} onChange={handleInputChange} />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormInput;
