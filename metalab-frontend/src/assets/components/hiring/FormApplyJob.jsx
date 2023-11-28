import { useState } from 'react';
import { useParams } from 'react-router-dom';

function FormApplyJob() {
    const { idJob } = useParams();
    const [formData, setFormData] = useState({
        nik: '',
        placeOfBirth: '',
        dateOfBirth: '',
        address: '',
        fileKTP: '',
        fileKK: '',
        fileCV: '',
        fileSertifikat: '',
        status: '',
        nikError: false,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
            nikError: name === 'nik' && value === ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lakukan pengiriman data formulir ke server di sini
        console.log(formData);
    };

    return (
        <div className="container">
            <h1>Formulir Data Pribadi</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label htmlFor="nik" className="form-label">
                        NIK:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="nik"
                        name="nik"
                        value={formData.nik}
                        onChange={handleChange}
                        required
                    />
                    {formData.nikError ? (
                        <div className="error">Hai error</div>
                    ) : null}

                </div>
                <div className="mb-3">
                    <label htmlFor="placeOfBirth" className="form-label">
                        Place of Birth:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="placeOfBirth"
                        name="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="dateOfBirth" className="form-label">
                        Date of Birth:
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        Address:
                    </label>
                    <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="fileKTP" className="form-label">
                        Unggah File KTP:
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        id="fileKTP"
                        name="fileKTP"
                        onChange={handleChange}
                        accept=".pdf, .jpg, .png"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="fileKK" className="form-label">
                        Unggah File KK:
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        id="fileKK"
                        name="fileKK"
                        onChange={handleChange}
                        accept=".pdf, .jpg, .png"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="fileCV" className="form-label">
                        Unggah File CV:
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        id="fileCV"
                        name="fileCV"
                        onChange={handleChange}
                        accept=".pdf, .doc, .docx"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="fileSertifikat" className="form-label">
                        Unggah File Sertifikat:
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        id="fileSertifikat"
                        name="fileSertifikat"
                        onChange={handleChange}
                        accept=".pdf, .jpg, .png"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                        Status:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default FormApplyJob;