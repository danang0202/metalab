//eslint-disable-next-line
import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../assets/apiConfig/apiConfig'
import Cookies from 'js-cookie';

function FormJob() {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('0');
    const navigate = useNavigate();
    const [whyJoin, setWhyJoin] = useState("");

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/client', {
            headers: {
                'Authorization': `Bearer ${Cookies.get('token_metalab')}`
            }
        })
            .then((response) => response.json())
            .then((data) => setClients(data.clients))
            .catch((error) => {
                console.error('Error:', error);
            });
            console.log(clients)
    }, []);


    const handleTextareaChange = (e) => {
        const newText = e.target.value;
        const lines = newText.split('\n');


        // Menambahkan tanda bulatan hanya pada awal setiap baris yang belum memiliki tanda bulatan
        const bulletedText = lines.map((line, index) => {
            // Periksa apakah baris tidak kosong dan belum memiliki tanda bulatan
            if (line.trim() !== '' && !line.startsWith('• ')) {
                return `• ${line}`;
            } else if (line.trim() === '•' && lines[index - 1] && lines[index - 1].startsWith('• ') || line.trim() === '•' ) {
                // Hapus tanda bulatan jika baris kosong dan baris sebelumnya memiliki tanda bulatan
                return '';
            }
            return line;
        }).join('\n');

        // Memperbarui nilai textarea
        setWhyJoin(bulletedText);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mengambil token dari localStorage
        const token = Cookies.get('token_metalab');
        // Persiapkan data yang akan dikirimkan ke API
        const data = new FormData();
        data.append('name', e.target.name.value);
        data.append('description', e.target.description.value);
        data.append('whyJoin', e.target.whyJoin.value);
        data.append('requirements', e.target.requirements.value);
        data.append('offer', e.target.offer.value);
        data.append('kontrakStart', e.target.kontrakStart.value);
        data.append('kontrakEnd', e.target.kontrakEnd.value);
        data.append('gajiLowe', e.target.gajiLowe.value);
        data.append('gajiUpper', e.target.gajiUpper.value);
        data.append('client_id', e.target.client_id.value);
        data.append('thumbnail', e.target.thumbnail.files[0]);

        try {
            const response = await api.post('/job', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response)
            if (response.status === 201) {
                navigate('/job-show');
            } else {
                console.error("Fail API");
            }
        } catch (error) {
            console.error('Error:', error);
        }

    };

    return (
        <div className="container mx-5 mb-2 d-flex justify-content-center">
            <div className="col-7 my-5">
                <form onSubmit={handleSubmit} method="POST" encType='multipart/form-data' >
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nama Pekerjaan</label>
                        <input type="text" className="form-control" id="name" name="name" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Deskripsi</label>
                        <textarea className="form-control" id="description" name="description"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="whyJoin" className="form-label">Alasan Bergabung</label>
                        <textarea className="form-control" id="whyJoin" name="whyJoin" value={whyJoin} onChange={handleTextareaChange}></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="requirements" className="form-label">Persyaratan</label>
                        <textarea className="form-control" id="requirements" name="requirements"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="offer" className="form-label">Penawaran</label>
                        <textarea className="form-control" id="offer" name="offer"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="thumbnail" className="form-label">Thumbnail</label>
                        <input type="file" className="form-control" id="thumbnail" name="thumbnail" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="kontrakStart" className="form-label">Tanggal Kontrak Dimulai</label>
                        <input type="date" className="form-control" id="kontrakStart" name="kontrakStart" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="kontrakEnd" className="form-label">Tanggal Kontrak Berakhir</label>
                        <input type="date" className="form-control" id="kontrakEnd" name="kontrakEnd" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gajiLowe" className="form-label">Gaji Minimum</label>
                        <input type="number" className="form-control" id="gajiLowe" name="gajiLowe" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gajiUpper" className="form-label">Gaji Maksimum</label>
                        <input type="number" className="form-control" id="gajiUpper" name="gajiUpper" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="client_id" className="form-label">Klien</label>
                        <select className="form-select" id="client_id" name="client_id" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                            <option value="0">Pilih Klien</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>{client.companyName}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary">Simpan</button>
                </form>
            </div>
        </div>
    );
}

export default FormJob;
