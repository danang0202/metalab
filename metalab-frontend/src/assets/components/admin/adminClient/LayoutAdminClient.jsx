import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../../../apiConfig/apiConfig';
import PaginationAdmin from '../../pagination/PaginationAdmin';
import { apiURL } from '../../../main';
import Loading from '../../Loading';

const LayoutAdminClient = () => {
    const [loading, setLoading] = useState();
    const [clients, setClients] = useState();
    const token = Cookies.get('token_metalab');
    const [notif, setNotif] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [totalPage, setTotalPage] = useState(1);
    const [keyword, setKeyword] = useState();
    const [goSearch, setGoSearch] = useState(1);
    const [pageInfo, setPageInfo] = useState([]);

    useEffect(() => {
        if (sessionStorage.getItem('add-client-status')) {
            setNotif(sessionStorage.getItem('add-client-status'))
            setTimeout(() => {
                sessionStorage.removeItem('add-client-status');
                setNotif('');
            }, 5000);
        }
    }, [])

    useEffect(() => {
        const fetchDataClient = async () => {
            setLoading(true);
            if (token) {
                try {
                    const data = {
                        page: page,
                        perPage: limit,
                        keyword: keyword
                    }

                    const response = await api.post(`/get-client`, data, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setClients(response.data.clients);
                        setPageInfo(response.data.page)
                        setTotalPage(Math.ceil(response.data.page.clientsCount / limit))
                    }
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    console.error('Error:', error);
                }
            }
        };
        fetchDataClient();
    }, [goSearch, page, limit])


    useEffect(() => {
        setPage(1);
    }, [goSearch, limit])

    const onPageChange = (value) => {
        if (value === '&laquo' || value == '... ') {
            setPage(1);
        } else if (value == '&lsaquo') {
            if (page != 1) {
                setPage(page - 1);
            }
        } else if (value == '&rsaquo') {
            if (page != totalPage) {
                setPage(page + 1);
            }
        } else if (value == '&raquo' || value == ' ...') {
            setPage(totalPage);
        } else {
            setPage(value);
        }
    }


    const searchSubmit = (e) => {
        e.preventDefault();
        setGoSearch(goSearch + 1);
    }


    return (
        <>
            <div className="p-2 w-100 h-100">
                <div className="ms-sm-auto m-0 p-0 w-100 h-100 bg-light" style={{ borderRadius: '2rem' }}>
                    {notif !== '' && notif == 'success' && (
                        <div className="smooth-transition alert alert-success position-absolute" role="alert" style={{ translate: '30rem 1rem' }}>
                            CLient added successfully !
                        </div>
                    )}
                    <div className="d-flex justify-content-between  w-auto gap-2 px-4 py-2 h-100">
                        <div className="w-100 h-100 d-flex flex-column gap-2">
                            {/* Isi konten utama di sini */}
                            <div className="px-2 my-2 d-flex justify-content-between align-items-center sticky-lg-top">
                                <div className="d-flex justify-content-between align-items-center gap-5">
                                    <h5 className="m-0 text-dark">Client List</h5>
                                    <Link to={'/admin/client/input-form'}>
                                        <a className="btn btn-sm text-light fw-semibold hover-op6 bg-blue"><i className="fa-solid fa-plus me-2"></i>Add Client</a>
                                    </Link>
                                </div>
                                {/* Input Pencarian */}
                                <form onSubmit={searchSubmit}>
                                    <span className="input-group w-auto">
                                        <input
                                            type="text"
                                            className="form-control rounded-0 border-0 rounded-start-3 w-auto"
                                            placeholder="Search..."
                                            value={keyword} onChange={(e) => setKeyword(e.target.value)}
                                        />
                                        <button className="btn bg-orange border-0 rounded-0 rounded-end-3 d-flex align-content-center" type="submit">
                                            <i className="material-icons text-white">search</i>
                                        </button>
                                    </span>
                                </form>
                            </div>
                            <div className="container-fluid p-2" style={{ overflowY: 'scroll', height: '90%' }}>
                                <table className="table table-borderless" style={{ borderCollapse: 'separate', borderSpacing: '0px 7px' }}>
                                    <thead className='sticky-top'>
                                        <tr>
                                            <th className='bg-light text-black-50'>#</th>
                                            <th className='bg-light text-black-50'>Company Name</th>
                                            <th className='bg-light text-black-50'>Company Email</th>
                                            <th className='bg-light text-black-50'>PIC Name</th>
                                            <th className='bg-light text-black-50'>PIC Email</th>
                                            <th className='bg-light text-black-50'>PIC Phone</th>
                                            <th className='bg-light text-black-50 text-center'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients &&
                                            clients.map((client) => (
                                                <tr key={client.id}>
                                                    <td className='px-2 text-center' style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}>{client.id}</td>
                                                    <td><img className='me-2' src={`${apiURL}/storage/client/${client.companyLogo}`} alt="..." style={{ width: '2rem', height: '2rem', objectFit: 'cover' }} /> {client.companyName}</td>
                                                    <td><span className="badge bg-green-t text-success fw-normal rounded-pill fs-6">{client.companyEmail}</span></td>
                                                    <td>{client.picName}</td>
                                                    <td>{client.picEmail}</td>
                                                    <td><span className="badge bg-purple-t text-purple fw-normal rounded-pill fs-6">{client.picPhoneNumber}</span></td>
                                                    <td className="border-0 text-center" style={{ borderRadius: '0rem 0.5rem 0.5rem 0rem' }}>
                                                        <div className="dropdown">
                                                            <button className="btn p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i className="material-icons d-flex align-items-center">more_horiz</i>
                                                            </button>
                                                            <div className="dropdown-menu p-2 border-0 shadow-sm">
                                                                <Link to={`/admin/client/detail/${client.id}`} style={{ textDecoration: 'none' }}>
                                                                    <button className="dropdown-item btn fw-semibold d-flex align-items-center rounded-2 p-1 bg-blue-t text-blue hover-bg-blue">
                                                                        <i className="fa-solid fa-circle-info mx-2 fs-6"></i>
                                                                        Detail
                                                                    </button>
                                                                </Link>
                                                                <Link to={`/admin/client/edit/${client.id}`} style={{ textDecoration: 'none' }}>
                                                                    <button className="dropdown-item btn fw-semibold mt-1 d-flex align-items-center rounded-2 p-1 bg-orange-t text-orange hover-bg-orange">
                                                                        <i className="material-icons mx-2 fs-6">edit</i>
                                                                        Edit
                                                                    </button>
                                                                </Link>
                                                                <Link to={'tes'} style={{ textDecoration: 'none' }}>
                                                                    <button className="dropdown-item btn fw-semibold mt-1 d-flex align-items-center rounded-2 p-1 bg-danger-t text-danger hover-bg-danger" href="#">
                                                                        <i className="material-icons mx-2 fs-6">delete</i>
                                                                        Delete
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination w-100 d-flex justify-content-between">
                                <h6 className='px-4'>Showing {pageInfo.lower} - {pageInfo.upper} From {pageInfo.clientsCount} Data</h6>
                                <div className="pagination">
                                    <PaginationAdmin totalPage={totalPage} page={page} limit={limit} siblings={1} onPageChange={onPageChange} setLimit={setLimit} setPage={setPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading &&
                <Loading />
            }
        </>
    );
};

export default LayoutAdminClient
