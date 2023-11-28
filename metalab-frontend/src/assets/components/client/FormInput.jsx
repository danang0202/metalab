//eslint-disable-next-line
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function FormInput() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');


  useEffect(() => {
    if (role === 'talent') {
      navigate('/');
    }
  }, []);

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
      const response = await fetch('http://127.0.0.1:8000/api/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Menambahkan token ke header permintaan
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.status == 201) {
        navigate('/client-show');
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
            <input type="text" className="form-control" id="name" name="name" />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Email
            </label>
            <input type="email" className="form-control" id="email" name="email" />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Address
            </label>
            <input type="text" className="form-control" id="address" name="address" />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Nomor Telepon
            </label>
            <input type="text" className="form-control" id="noTelp" name="noTelp" />
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
