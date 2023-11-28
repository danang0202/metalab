import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
function TableClient() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { keyword } = useParams();

    useEffect(() => {
        if (keyword) {
            setSearchQuery(keyword);
        }
        // Melakukan permintan ke API
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

    }, []);

    const deleteClient = async (clientId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://127.0.0.1:8000/api/client/${clientId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status == 200) {
                const updatedClients = clients.filter((client) => client.id !== clientId);
                setClients(updatedClients);

                // Navigasi kembali ke halaman /client-show
                navigate('/client-show');
            } else {
                console.error('Failed to delete client.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <div className="container mx-5 my-3">
                <div className="container mx-5 mb-2 col-4">
                    <form className="d-flex" role="search" id="search-box">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </form>
                </div>
            </div>

            <div className="container">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>No Telepon</th>
                            <th colSpan="2">Action</th>
                        </tr>
                    </thead>
                    <tbody id="search-results">
                        {clients
                            .filter((client) =>
                                client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                client.noTelp.includes(searchQuery)
                            )
                            .map((client) => (
                                <tr key={client.id}>
                                    <td>{client.id}</td>
                                    <td>{client.name}</td>
                                    <td>{client.email}</td>
                                    <td>{client.noTelp}</td>
                                    <td>{client.address}</td>
                                    <td>
                                        <Link to={`/client-edit/${client.id}/${searchQuery}`}>
                                            <i className="fas fa-pen text-success"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link onClick={() => deleteClient(client.id)}>
                                            <i className="fas fa-trash text-danger"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default TableClient;
