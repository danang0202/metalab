import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function TableJob() {
    const [jobs, setJobs] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKey, setSearchKey] = useState('');


    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/client', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
            .then((data) => setClients(data.clients))
            .catch((error) => {
                console.error('Error:', error);
            });

        // Melakukan permintan ke API
        fetch('http://127.0.0.1:8000/api/job', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())
            .then((data) => setJobs(data.jobs))
            .catch((error) => {
                console.error('Error:', error);
            });

        setLoading(false);
    }, []);

    if (loading) {
        return (
            <>
                <div className="container mx-5 mb-2">
                    <form className="d-flex col-5 mt-5 px-5" role="search" id="search-box">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search-input" value={searchKey} onChange={(e) => (setSearchKey(e.target.value))} />
                    </form>
                </div>
                <p className='text-center'>Loading OOOOO</p>
            </>
        )
    }
    return (
        <>
            <div className="container mx-5 mb-2">
                <form className="d-flex col-5 mt-5 px-5" role="search" id="search-box">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search-input" value={searchKey} onChange={(e)=>{setSearchKey(e.target.value)}} />
                </form>
            </div>
            <div className="container d-flex gap-5 mt-5">
                {jobs
                    .filter((job) => job.name.toLowerCase().includes(searchKey.toLowerCase()))
                    .map((job) => (
                        <div key={job.id} className="card" style={{ width: "18rem" }}>
                            <img
                                src={'http://127.0.0.1:8000/api/storage/thumbnails/' + job.thumbnail}
                                className="card-img-top"
                                alt="..."
                            />
                            <div className="card-body">
                                <h5 className="card-title">{job.name}</h5>
                                <h6 className="card-text">{getClientName(job.client_id)}</h6>
                                <p className="card-text">{job.description}</p>
                                <Link to={`/job-detail/${job.id}`}>
                                    <p className="btn btn-primary">Detail</p>
                                </Link>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );


    function getClientName(clientId) {
        const client = clients.find((c) => c.id === clientId);
        return client ? client.name : 'N/A';
    }
}

export default TableJob;