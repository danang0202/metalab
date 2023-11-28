import { useEffect } from 'react';
import { useState } from 'react';
import api from '../../../apiConfig/apiConfig';
import { Link } from 'react-router-dom';
import PaginationAdmin from '../../pagination/PaginationAdmin';
import { apiURL } from '../../../main';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Loading from './../../Loading';
import NotifFloatAdmin from '../NotifFloatAdmin';

const LayoutAdminJob = () => {
    const [loading, setLoading] = useState();
    const [jobs, setJobs] = useState();
    const token = Cookies.get('token_metalab');
    const [notif, setNotif] = useState('');
    const [editNotif, setEditNotif] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [totalPage, setTotalPage] = useState(1);
    const [keyword, setKeyword] = useState();
    const [goSearch, setGoSearch] = useState(1);
    const [pageInfo, setPageInfo] = useState([]);
    const [filter, setFilter] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sorting, setSorting] = useState('desc');
    const [relatedHiring, setRelatedHiring] = useState();
    const [floatingNotif, setFloatingNotif] = useState();

    useEffect(() => {
        if (sessionStorage.getItem('add-job-status')) {
            setNotif(sessionStorage.getItem('add-job-status'))
            setTimeout(() => {
                sessionStorage.removeItem('add-job-status');
                setNotif('');
            }, 5000);
        } else if (sessionStorage.getItem('edit-job-status')) {
            setEditNotif(sessionStorage.getItem('edit-job-status'))
            setTimeout(() => {
                sessionStorage.removeItem('edit-job-status');
                setEditNotif('');
            }, 5000);
        }
    }, [])

    useEffect(() => {
        const fetchDataJob = async () => {
            setLoading(true);
            let filterStatusData = [];
            if (filterStatus == '') {
                filterStatusData.push('Vacant')
                filterStatusData.push('Full Hired')
                filterStatusData.push('Closed')
                filterStatusData.push('Disable')
            } else {
                filterStatusData.push(filterStatus)
            }
            let filterType = [];
            if (filter == '') {
                filterType.push('Full Time')
                filterType.push('Freelance')
                filterType.push('Part Time')
            } else {
                filterType.push(filter)
            }
            if (token) {
                try {
                    const data = {
                        page: page,
                        perPage: limit,
                        keyword: keyword,
                        sort: sorting,
                        filter: filterType,
                        filterStatus: filterStatusData,
                    }
                    const response = await api.post(`/job-admin`, data, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setJobs(response.data.jobs);
                        setPageInfo(response.data.page)
                        setTotalPage(Math.ceil(response.data.page.jobsCount / limit))
                    }
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    console.error('Error:', error);
                }
            }
        };
        fetchDataJob();
    }, [goSearch, page, limit, filter, filterStatus])


    useEffect(() => {
        setKeyword('');
    }, [filter, filterStatus])

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

    const disableJobSubmitCheck = async (id) => {
        setLoading(true);
        try {
            const response = await api.get(`/hiring/check-disable-job/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setRelatedHiring(response.data.hiring);
            } else if (response.status == 204) {
                disableJobSubmit(id);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
        }
    }

    const disableJobSubmit = async (id) => {
        setRelatedHiring(null);
        setLoading(true);
        try {
            const response = await api.get(`/job/make-disable/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
            if (response.status === 200) {
                const updatedJobs = [...jobs];
                const indexToUpdate = updatedJobs.findIndex(item => item.id === response.data.job.id);
                updatedJobs[indexToUpdate].status = response.data.job.status;
                setFloatingNotif('disable-success');
                setJobs(updatedJobs);
            }
            setLoading(false);
            setTimeout(() => {
                setFloatingNotif(null);
            }, 3000);
        } catch (error) {
            setLoading(false);
            setFloatingNotif('disable-fail');
            setTimeout(() => {
                setFloatingNotif(null);
            }, 3000);
            console.error('Error:', error);
        }
    }



    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn bg-blue text-light hover-op6 ms-2",
            cancelButton: "btn bg-danger text-light hover-op6 me-2"
        },
        buttonsStyling: false
    });

    const disableConfirmation = (id) => {
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, make it disable !",
            cancelButtonText: "No, cancel !",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                disableJobSubmitCheck(id);

            }
        });
    }

    return (
        <>
            <div className="p-2 w-100 h-100">
                {/* Floating Notification */}
                {floatingNotif == 'disable-success' ? (
                    <NotifFloatAdmin status={'success'} text={'Succes to disable job'} />
                ) : floatingNotif == 'disable-fail' && (
                    <NotifFloatAdmin status={'fail'} text={'Fail to disable job'} />
                )}
                {notif != '' && notif == 'success' && (
                    <NotifFloatAdmin status={'success'} text={'Job added successfully'} />
                )}
                {editNotif !== '' && editNotif == 'success' && (
                    <NotifFloatAdmin status={'success'} text={'Job edited successfully'} />
                )}
                {/* Floating notification end */}

                {/* Related Hiring digunakan untuk menampilkan data hiring yang berangkutan jika suatu job akan di disabled */}
                {relatedHiring && (
                    <div className="smooth-transition container position-absolute h-75 bg-semi-transparent d-flex align-items-center justify-content-center" style={{ zIndex: '1000', borderRadius: '2rem' }}>
                        <div className="container p-4">
                            <div className="alert alert-light shadow">
                                <div className="title d-flex flex-column w-100 align-items-center gap-2">
                                    <i className="fa-solid fa-triangle-exclamation fs-3 text-danger"></i>
                                    <h5 className='text-danger'>Please read this warning !</h5>
                                </div>
                                <div className="content d-flex flex-column align-items-center mt-3">
                                    <h6>The following talents are currently registered for this job, deleting the job will change their hiring status to <span className="text-danger">Cancelled</span> </h6>
                                    <div className="container w-75">
                                        <table className='table table-borderless'>
                                            <thead>
                                            <tr>
                                                <td className='fw-semibold'>Talent Name</td>
                                                <td className='fw-semibold'>Status Hiring</td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {relatedHiring.map((hiring) => (
                                                <tr key={hiring.id}>
                                                    <td><img className='mx-2' src={`${hiring.talent.avatar ? apiURL + '/storage/avatars/' + hiring.talent.avatar : '/images/avatar-default.png'}`} alt="..." style={{ width: '2rem', height: '2rem', borderRadius: '50%', objectFit: 'cover' }} /> {hiring.talent.firstName} {hiring.talent.lastName}</td>
                                                    <td><span className={`badge rounded-pill ${hiring.status == 'On Progress' ? 'bg-blue-t text-blue' : hiring.status == 'Rejected' ? 'bg-danger-t text-danger' : hiring.status == 'Hired' ? 'bg-green-t text-green' : 'bg-purple-t text-purple '}`}>{hiring.status}</span></td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <h6 className='text-danger'>Are you sure to disable this job ? </h6>
                                </div>
                                <div className="button-footer d-flex justify-content-end px-5">
                                    <div className="button d-flex gap-3">
                                        <button className='btn btn-sm bg-danger text-light hover-op6' onClick={() => setRelatedHiring(null)}>Cancel</button>
                                        <button className='btn btn-sm bg-blue text-light hover-op6' onClick={() => disableJobSubmit(relatedHiring[0].jobId)}>Yes, force to disable !</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="ms-sm-auto m-0 p-0 w-100 h-100 bg-light" style={{ borderRadius: '2rem' }}>
                    <div className="d-flex py-2 justify-content-between w-auto gap-2 px-4 h-100">
                        <div className="w-100 h-100 d-flex flex-column gap-2">
                            {/* Isi konten utama di sini */}
                            <div className="px-2 mt-2 d-flex justify-content-between sticky-lg-top" style={{ zIndex: '10' }}>
                                <div className="d-flex justify-content-between align-items-center gap-5">
                                    <h5 className="m-0">Job List</h5>
                                    <Link to={'/admin/job/input-form'}>
                                        <a className="btn btn-sm text-light fw-semibold hover-op6 bg-blue"><i className="fa-solid fa-plus me-2"></i>Add Job</a>
                                    </Link>
                                </div>

                                <div className="box d-flex flex-row gap-4">
                                    <div className="filter">
                                        <select className="form-select border-0" aria-label="Default select example" value={filter} onChange={(e) => { setFilter(e.target.value); setKeyword('') }} style={{ border: '2px solid #FA9370' }}>
                                            <option value=''>-- Filter Type --</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Part Time">Part Time</option>
                                            <option value="Full Time">Full Time</option>
                                        </select>
                                    </div>

                                    <div className="filter">
                                        <select className="form-select border-0" aria-label="Default select example" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setKeyword('') }} style={{ border: '2px solid #FA9370' }}>
                                            <option value=''>-- Filter Status --</option>
                                            <option value="Vacant">Vacant</option>
                                            <option value="Full Hired">Full Hired</option>
                                            <option value="Closed">Closed</option>
                                            <option value="Disable">Disable</option>
                                        </select>
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
                                            <button className="btn bg-orange rounded-0 rounded-end-3 d-flex align-content-center" type="submit">
                                                <i className="material-icons text-white">search</i>
                                            </button>
                                        </span>
                                    </form>
                                </div>
                            </div>
                            <div className="container-fluid p-2" style={{ overflowY: 'scroll', height: '90%' }}>
                                <table className="table table-borderless" style={{ borderCollapse: 'separate', borderSpacing: '0px 6px' }}>
                                    <thead className='sticky-top bg-light' style={{ zIndex: '1' }}>
                                    <tr className="bg-light">
                                        <th className='bg-light text-black-50'>#</th>
                                        <th className='bg-light text-black-50'>Job Name</th>
                                        <th className='bg-light text-black-50 text-center'>Job Type</th>
                                        <th className='bg-light text-black-50'>Company Name</th>
                                        <th className='bg-light text-black-50'>PIC Name</th>
                                        <th className='bg-light text-black-50 text-center'>Kuota</th>
                                        <th className='bg-light text-black-50 text-center'>Hired</th>
                                        <th className='bg-light text-black-50 text-center'>Status</th>
                                        <th className='bg-light text-black-50 text-center'>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {jobs &&
                                        jobs.map((job) => (
                                            <tr key={job.id}>
                                                <td className='px-2 text-center' style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}>{job.id}</td>
                                                <td ><img className='me-2 rounded-1' src={`${apiURL}/storage/thumbnails/${job.thumbnail}`} alt="..." style={{ width: '2rem', height: '2rem', objectFit: 'cover' }} /> {job.name}</td>
                                                <td className='text-center'><span className={`badge  rounded-pill ${job.type == 'Full Time' ? 'bg-blue-t text-blue' : job.type == 'Freelance' ? 'bg-purple-t text-purple' : 'bg-orange-t text-orange'}`}>{job.type}</span></td>
                                                <td><img className='me-2 rounded-1' src={`${apiURL}/storage/client/${job.client.companyLogo}`} alt="..." style={{ width: '2rem', height: '2rem', objectFit: 'cover' }} />{job.client.companyName}</td>
                                                <td>{job.client.picName}</td>
                                                <td className='text-center'><span className="badge bg-purple-t text-purple  rounded-pill fs-6">{job.kuota}</span></td>
                                                <td className='text-center'><span className="badge bg-green-t text-green  rounded-pill fs-6">{job.hired}</span></td>
                                                <td className='text-center'><span className={`badge rounded-pill ${job.status === 'Vacant' ? 'bg-green-t text-green' : job.status == 'Disable' ? 'bg-danger-t text-danger' : 'bg-orange-t text-orange'}`}>{job.status}</span></td>
                                                <td className="border-0 text-center" style={{ borderRadius: '0rem 0.5rem 0.5rem 0rem' }}>
                                                    <div className="dropdown">
                                                        <button className="btn p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i className="material-icons d-flex align-items-center">more_horiz</i>
                                                        </button>
                                                        <div className="dropdown-menu p-2 border-0 shadow-sm">
                                                            <Link to={`/admin/job/detail/${job.id}`} style={{ textDecoration: 'none' }}>
                                                                <button className="dropdown-item btn fw-semibold d-flex align-items-center rounded-2 p-1 bg-blue-t text-blue hover-bg-blue">
                                                                    <i className="fa-solid fa-circle-info mx-2 fs-6"></i>
                                                                    Detail
                                                                </button>
                                                            </Link>
                                                            <Link to={`/admin/job/edit/${job.id}`} style={{ textDecoration: 'none' }}>
                                                                <button className="dropdown-item btn fw-semibold mt-1 d-flex align-items-center rounded-2 p-1 bg-orange-t text-orange hover-bg-orange">
                                                                    <i className="material-icons mx-2 fs-6">edit</i>
                                                                    Edit
                                                                </button>
                                                            </Link>
                                                            {/* kalau status dari job sudah disable,  tombol disable tidak bisa digunakan lagi */}
                                                            {job.status != 'Disable' ? (
                                                                <Link onClick={() => disableConfirmation(job.id)} style={{ textDecoration: 'none' }}>
                                                                    <button className="dropdown-item btn fw-semibold p-1 d-flex align-items-center mt-1 rounded-2 bg-danger-t text-danger hover-bg-danger" href="#">
                                                                        <i className="fa-solid fa-lock mx-2 fs-6"></i>
                                                                        Disabled
                                                                    </button>
                                                                </Link>
                                                            ) : (
                                                                <button className="dropdown-item btn fw-semibold p-1 d-flex align-items-center mt-1 rounded-2 bg-danger-t text-danger" style={{ cursor: 'not-allowed' }}>
                                                                    <i className="fa-solid fa-lock mx-2 fs-6"></i>
                                                                    Disabled
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination w-100 d-flex justify-content-between">
                                <h6 className='px-4'>Showing {pageInfo.lower} - {pageInfo.upper} From {pageInfo.jobsCount} Data</h6>
                                <div className="pagination">
                                    <PaginationAdmin totalPage={totalPage} page={page} limit={limit} siblings={1} onPageChange={onPageChange} setLimit={setLimit} setPage={setPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {loading && (
                <Loading />
            )
            }
        </>
    )
}

export default LayoutAdminJob