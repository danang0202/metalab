import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom'
import api from '../../../apiConfig/apiConfig';
import Cookies from 'js-cookie';
import {apiURL} from '../../../main';
import TableClientJobs from './TableClientJobs';
import PaginationAdmin from '../../pagination/PaginationAdmin';

const ClientDetail = () => {
    const idClient = useParams().id;
    const token = Cookies.get('token_metalab');
    const [client, setclient] = useState();
    const [baseclientJobs, setBaseclientJobs] = useState([]);
    const [clientJobs, setclientJobs] = useState([]);
    const [clientJobsLimit, setclientJobsLimit] = useState([]);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [totalPage, setTotalPage] = useState(1);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const fetchDataclient = async () => {
            // setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/client-with-jobs/${idClient}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log(response);
                    if (response.status === 200) {
                        setclient(response.data.client);
                        setBaseclientJobs(response.data.client.jobs);
                        setclientJobs(response.data.client.jobs);
                    }
                    // setLoading(false);
                } catch (error) {
                    // setLoading(false);
                    console.error('Error:', error);
                }
            }
        };
        fetchDataclient();
    }, [])

    useEffect(() => {
        const filterClientJobs = baseclientJobs.filter((job) =>
            job.name.toLowerCase().includes(keyword.toLowerCase())
        );
        setPage(1);
        setTotalPage(Math.ceil(filterClientJobs.length / limit));
        setclientJobs(filterClientJobs);
    }, [keyword, baseclientJobs]);

    useEffect(() => {
        const getclientLimits = function (pages, limits) {
            if (clientJobs != null && clientJobs.length !== 0) {
                let array = [];
                for (let i = (pages - 1) * limits; i < (pages * limits) && i < clientJobs.length; i++) {
                    array.push(clientJobs[[i]])

                }
                setclientJobsLimit(array);
                setTotalPage(Math.ceil(clientJobs.length / limit));
            } else {
                {
                    [
                        setclientJobsLimit([])
                    ]
                }
            }
        }
        getclientLimits(page, limit);
    }, [clientJobs, page, limit])

    const onPageChange = (value) => {
        if (value == '&laquo' || value == '... ') {
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

    return (
        <>
            <div className="w-100 py-2 px-3">
                <div className="bg-light w-100" style={{ borderRadius: '2rem', minHeight: '87vh' }}>
                    <div className="container h-100 px-4 py-3" >
                        <div className="d-flex flex-column h-100">
                            <div className="header d-flex justify-content-between w-100">
                                <h5 className='ms-3 px-1'>Client Detail <Link to={client != null ? `/admin/client/edit/${client.id}` : 'test'}><i className="fa-solid fa-pen-to-square text-orange hover-op6 ms-4"></i></Link></h5>
                                <Link to={'/admin/client'}>
                                    <i className="fa fa-arrow-left fs-4 text-danger bg-white rounded-5 p-1 hover-op6"></i>
                                </Link>
                            </div>
                            <div className="detail-container d-flex flex-column flex-md-column px-3 rounded align-items-md-center align-items-lg-start ">
                                <div className="d-flex flex-row my-2 gap-4 align-items-center w-100 bg-clear rounded-3 px-5 py-3">
                                    <div className="avatar-container d-flex flex-column gap-2 align-items-center">
                                        <img className='rounded-3' src={`${client != null ? apiURL + '/storage/client/' + client.companyLogo : '/images/avatar-default.png'}`} alt="Logo..." style={{ width: '10rem' }} />
                                        {client != null && (
                                            <h6><span className="badge bg-green-t text-green">{client.companyName}</span></h6>
                                        )}
                                    </div>
                                    <div className="info-profil pt-2 w-100 ">
                                        <h6 className='m-0'>Client Info</h6>
                                        <hr className='mb-0 mt-2'/>
                                        {client != null && (
                                            <table className='tabel-info-client' style={{ borderCollapse: 'separate', borderSpacing: '0px 1rem' }}>
                                                <tbody>
                                                    <div className="box d-flex flex-row" style={{gap:"60px"}}>
                                                        <div className="box">
                                                            <tr>
                                                                <td className='fw-semibold'>Company Name</td>
                                                                <td className='px-2 fw-semibold text-black-50'>{client.companyName}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='fw-semibold'>Company Email</td>
                                                                <td className='px-2 fw-semibold text-black-50'>{client.companyEmail}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='fw-semibold'>Number of Jobs</td>
                                                                <td className='px-2 fw-semibold text-black-50'><span className='badge bg-blue-t text-blue me-2'>{client.jobs.length} </span> jobs</td>
                                                            </tr>
                                                        </div>
                                                        <div className="box">
                                                            <tr>
                                                                <td className='fw-semibold'>PIC Name</td>
                                                                <td className='px-2 fw-semibold text-black-50'>{client.picName}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='fw-semibold'>PIC Email</td>
                                                                <td className='px-2 fw-semibold text-black-50'>{client.picEmail}</td>

                                                            </tr>
                                                            <tr>
                                                                <td className='fw-semibold'>PIC Phone Number</td>
                                                                <td className='px-2 fw-semibold text-black-50'>{client.picPhoneNumber}</td>
                                                            </tr>
                                                        </div>
                                                    </div>
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                                <div className="w-100 mt-3 d-flex flex-column align-items-end justify-content-between">
                                    <form>
                                        <span className="input-group mb-3 w-auto">
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
                                    <div className="w-100">
                                        <TableClientJobs filter={filter} jobs={clientJobsLimit} />
                                    </div>
                                    <div className="pagination d-flex justify-content-between w-100 mt-2">
                                        <div className="box ps-2">
                                            <h6>Show {(page - 1) * (limit) + 1} - {(page - 1) * (limit) + limit < clientJobs.length ? (page - 1) * (limit) + limit : clientJobs.length} from {clientJobs.length} data</h6>
                                        </div>
                                        <div className="box d-flex flex-row">
                                            <PaginationAdmin totalPage={totalPage} page={page} limit={limit} siblings={1} onPageChange={onPageChange} setLimit={setLimit} setPage={setPage} />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}
export default ClientDetail