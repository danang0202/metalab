import { useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../../../apiConfig/apiConfig';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PaginationAdmin from '../../pagination/PaginationAdmin';
import { apiURL } from '../../../main';
import Loading from '../../Loading';
import Swal from 'sweetalert2';
import NotifFloatAdmin from '../NotifFloatAdmin';

const AdminHiringTable = () => {
    const userRole = Cookies.get('role_metalab');
    const token = Cookies.get('token_metalab');
    const [hirings, setHirings] = useState();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [totalPage, setTotalPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [keyword, setKeyword] = useState();
    const [goSearch, setGoSearch] = useState(1);
    const [pageInfo, setPageInfo] = useState([]);
    const [loading, setLoading] = useState();
    const [sucNotif, setSucNotif] = useState();
    const [failNotif, setFailNotif] = useState();

    useEffect(() => {
        const fetchDataHiring = async () => {
            setLoading(true);
            let filterData = [];
            if (filter == '') {
                filterData.push('On Progress')
                filterData.push('Hired')
                filterData.push('Completed')
                filterData.push('Rejected')
                filterData.push('Cancelled')
            } else {
                filterData.push(filter);
            }

            const data = {
                page: page,
                perPage: limit,
                filter: filterData,
                keyword: keyword
            }
            if (token) {
                try {
                    const response = await api.post(`/hiring/data-tabel-admin`, data, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setHirings(response.data.hirings);
                        setPageInfo(response.data.page)
                        setTotalPage(Math.ceil(response.data.page.hiringCount / limit))
                    }
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchDataHiring();

    }, [filter, goSearch, page, limit])

    useEffect(() => {
        setPage(1);
    }, [goSearch, filter, limit])

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

    const deleteHandle = async (idHiring) => {
        setLoading(true);
        try {
            const response = await api.delete(`/hiring/${idHiring}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setSucNotif('Success to delete hiring with Id ' + idHiring);
                const indexToRemove = hirings.findIndex(item => item.id === idHiring);
                if (indexToRemove !== -1) {
                    const updatedHiring = [...hirings];
                    updatedHiring.splice(indexToRemove, 1);
                    setHirings(updatedHiring);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setFailNotif('Fail to delete hiring with Id ' + idHiring);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSucNotif('');
                setFailNotif('');
            }, 3000);
        }
    }

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn bg-blue text-light hover-op6 ms-2",
            cancelButton: "btn bg-danger text-light hover-op6 me-2"
        },
        buttonsStyling: false
    });

    const confirmation = (id) => {
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, sure !",
            cancelButtonText: "No, cancel !",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                deleteHandle(id);
            }
        });
    }


    return (
        <>
            {sucNotif && (
                <NotifFloatAdmin status="success" text={sucNotif} />
            )}
            {failNotif && (
                <NotifFloatAdmin status="fail" text={failNotif} />
            )}
            <div className="p-2 w-100 h-100">
                <div className="w-100 h-100 bg-light" style={{ borderRadius: '2rem' }}>
                    <div className="d-flex py-2 justify-content-between w-auto gap-2 px-4 h-100">
                        <div className="w-100 h-100 d-flex flex-column gap-2">
                            <div className="px-2 mt-2 d-flex justify-content-between align-items-center sticky-lg-top"
                                style={{ zIndex: '10' }}>
                                <h5 className="m-0">Job Hiring List</h5>
                                <div className="d-flex gap-4">
                                    <div className="filter">
                                        <select className="form-select border-0" aria-label="Default select example"
                                            value={filter}
                                            onChange={(e) => {
                                                setFilter(e.target.value);
                                                setKeyword('')
                                            }} style={{ border: '2px solid #FA9370' }}>
                                            <option value=''>-- Select Filter --</option>
                                            <option value="On Progress">On Progress</option>
                                            <option value="Hired">Hired</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Cancelled">Cancelled</option>
                                            v
                                        </select>
                                    </div>
                                    <form onSubmit={searchSubmit}>
                                        <span className="input-group w-auto">
                                            <input
                                                type="text"
                                                className="form-control rounded-0 border-0 rounded-start-3 w-auto"
                                                placeholder="Search..."
                                                value={keyword} onChange={(e) => setKeyword(e.target.value)}
                                            />
                                            <button
                                                className="btn bg-orange rounded-0 rounded-end-3 d-flex align-content-center"
                                                type="submit">
                                                <i className="material-icons text-white">search</i>
                                            </button>
                                        </span>
                                    </form>
                                </div>
                            </div>
                            <div className="container-fluid" style={{ overflowY: 'scroll', height: '90%' }}>
                                <table className="table table-borderless"
                                    style={{ borderCollapse: 'separate', borderSpacing: '0px 6px' }}>
                                    <thead className='sticky-top bg-light'>
                                        <tr className='bg-light'>
                                            <th className='bg-light text-black-50 fw-semibold'>#</th>
                                            <th className='bg-light text-black-50'>Talent</th>
                                            <th className='bg-light text-black-50'>Job Name</th>
                                            <th className='bg-light text-black-50 text-center'>Job Type</th>
                                            <th className='bg-light text-black-50 text-center'>Status</th>
                                            <th className='bg-light text-black-50 text-center'>Last Stage</th>
                                            <th className='bg-light text-black-50 text-center'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="gap-2">
                                        {hirings && hirings.map((hiring) => (
                                            <tr key={hiring.id}>
                                                <td className="px-2 text-center fw-semibold"
                                                    style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}>{hiring.id}</td>
                                                <td>
                                                    <img
                                                        className="mx-2"
                                                        src={`${hiring.talent.avatar ? apiURL + '/storage/avatars/' + hiring.talent.avatar : '/images/avatar-default.png'}`}
                                                        alt="..."
                                                        style={{
                                                            width: '2rem',
                                                            height: '2rem',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />{hiring.talent.firstName} {hiring.talent.lastName}
                                                </td>
                                                <td>{hiring.job.name}</td>
                                                {/* bagian status */}
                                                <td><span
                                                    className={`badge  rounded-pill ${hiring.job.type == 'Full Time' ? 'bg-blue-t text-blue' : hiring.job.type == 'Freelance' ? 'bg-purple-t text-purple' : 'bg-orange-t text-orange'}`}>{hiring.job.type}</span>
                                                </td>
                                                <td className='text-center'><span
                                                    className={`badge rounded-pill ${hiring.status == 'On Progress' ? 'bg-blue-t text-blue' : hiring.status == 'Rejected' ? 'bg-danger-t text-danger' : hiring.status == 'Hired' ? 'bg-green-t text-green' : hiring.status == 'Completed' ? 'bg-purple-t text-purple ' : 'bg-orange-t text-orange'}`}>{hiring.status}</span>
                                                </td>

                                                <td className='text-center'><span>{hiring.lastStage}</span>
                                                </td>
                                                <td className="border-0 text-center" style={{ borderRadius: '0rem 0.5rem 0.5rem 0rem' }}>
                                                    <div className="dropdown">
                                                        <button className="btn p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i className="material-icons d-flex align-items-center">more_horiz</i>
                                                        </button>
                                                        <div className="dropdown-menu p-2 border-0 shadow-sm">
                                                            <Link to={`/admin/hiring/detail/${hiring.id}`} style={{ textDecoration: 'none' }}>
                                                                <button className="dropdown-item btn fw-semibold d-flex align-items-center rounded-2 p-1 bg-blue-t text-blue hover-bg-blue">
                                                                    <i className="fa-solid fa-circle-info mx-2 fs-6"></i>
                                                                    Detail
                                                                </button>
                                                            </Link>
                                                            <button onClick={() => confirmation(hiring.id)} className="dropdown-item btn fw-semibold mt-1 d-flex align-items-center rounded-2 p-1 bg-danger-t text-danger hover-bg-danger" href="#">
                                                                <i className="material-icons mx-2 fs-6">delete</i>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination w-100 d-flex justify-content-between">
                                <h6 className='px-4'>Showing {pageInfo.lower} - {pageInfo.upper} From {pageInfo.hiringCount} Data</h6>
                                <div className="pagination">
                                    <PaginationAdmin totalPage={totalPage} page={page} limit={limit} siblings={1}
                                        onPageChange={onPageChange} setLimit={setLimit} setPage={setPage} />
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

export default AdminHiringTable;
