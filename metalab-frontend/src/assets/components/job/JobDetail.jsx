import { useEffect, useState } from 'react';
import api from '../../../assets/apiConfig/apiConfig'
import { useParams, Link } from 'react-router-dom';

function TableJob() {
    const { idJob } = useParams(); // Menangkap params idJob dari routes
    const [job, setJob] = useState("");
    const [client, setClient] = useState("");


    useEffect(() => {
        // Melakukan permintan ke API mendapatkan data job by id
        api.get(`/job/${idJob}`, {

            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                setJob(response.data.jobs)
                const clientId = response.data.jobs.client_id;
                // Melakukan permintan ke API mendapatkan data client by id
                api.get(`/client/${clientId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then((response) => {
                        setClient(response.data.clients)
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            })
            .catch((error) => {
                console.error('Error:', error);
            })

    }, []);

    return (
        <>
            <div className="container d-flex justifyyy-content-center mt-5">
                <div className="container col-6 d-flex flex-column align-items-center" >
                    <div className="header">
                        <h3>{job.name}</h3>
                        <h6 className='text-center'>{client.name}</h6>
                    </div>
                    <div className="container-thumbnail my-5">
                        <img src={'http://127.0.0.1:8000/api/storage/thumbnails/' + job.thumbnail} className="card-img-top" alt="..." />
                    </div>
                    <div className="whyJoin my-3 container">
                        <h6>Yout must join <span className='text-danger'>{job.name}</span>, because</h6>

                        {job ? (job.whyJoin.split('•').map((line, index) => (
                            line !== '' && line !== ' ' ? (
                                <div key={index} className="d-flex flex-row gap-3">
                                    <p>•</p>
                                    <p>{line}</p>
                                </div>
                            ) : null)
                        )) : null}
                    </div>
                    <div className="whyJoin">
                        <p>{job.description}</p>
                    </div>

                    <div className="button-container">
                        <Link to={`/hiring/apply-form/${job.id}`}>
                            <p className='btn btn-primary rounded'>Apply</p>
                        </Link><div></div>
                    </div>
                </div>
            </div >

        </>
    );
}

export default TableJob;