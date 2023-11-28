import { useState } from 'react'
import api from '../../../apiConfig/apiConfig';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import Pagination from '../../pagination/Pagination';
import { useEffect } from 'react';
import { formatDateContract, formattedSalary } from '../../../main';
import Loading from '../../Loading';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [jobSearch, setJobSearch] = useState([]);
    const token = Cookies.get('token_metalab');
    const [fullTime, setFullTime] = useState(true);
    const [freelance, setFreelance] = useState(true);
    const [partTime, setPartTime] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [sorting, setSorting] = useState('desc');
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(25000);
    const [RangeError, setRangeError] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [totalPage, setTotalpage] = useState(1);
    const [pageInfo, setPageInfo] = useState([]);
    const [button, setButton] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setKeyword('');
        let filter = [];
        if (freelance) {
            filter.push('Freelance')
        }
        if (partTime) {
            filter.push('Part Time')
        }
        if (fullTime) {
            filter.push('Full Time')
        }


        const data = {
            page: page,
            perPage: limit,
            sort: sorting,
            filter: filter,
            min: min,
            max: max
        }
        const fetchData = async () => {
            try {
                const response = await api.post('/job-talent', data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setJobs(response.data.jobs);
                    setJobSearch(response.data.jobs);
                    setPageInfo(response.data.page)
                    setTotalpage(Math.ceil(response.data.page.jobCount / limit))
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [page, limit, button])

    const handleSalaryChange = (e) => {
        let name = e.target.name;
        if (name == 'lower') {
            setMin(e.target.value)
            if (e.target.value >= max) {
                setRangeError('The lower limit cannot be greater than the upper limit')
            } else {
                setRangeError('')
            }
        } else {
            setMax(e.target.value)
            if (e.target.value <= min) {
                setRangeError('The upper limit cannot be smaller than the lower limit')
            } else {
                setRangeError('')
            }
        }
    }

    // yahya: Membetulkan live search, tadinya kalo keyword pake kapital gak muncul hasil search
    useEffect(() => {
        const jobSearch = function (filter) {
            const lowerCaseFilter = filter.toLowerCase(); // Ubah filter menjadi huruf kecil
            const filteredJobs = jobs.filter((item) =>
                item.name.toLowerCase().includes(lowerCaseFilter)
            );

            setJobSearch(filteredJobs);
        };

        jobSearch(keyword);
    }, [keyword]);


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
        console.log(page);
    }


    return (
        <>
            <div className="container mt-lg-3 mg-2 col-md-10 col-11">
                <div className="row">
                    <div className="col-xl-3 p-3 d-flex align-items-center">
                        <img src="/images/metalab-logo.png" alt="" style={{ width: '10rem' }} className='d-none d-md-none d-lg-block' />
                    </div>
                    <div className="col d-flex align-items-center justify-content-end px-3 text-center mb-2">
                        <i className="fas fa-search p-2 d-flex justify-content-center align-items-center"></i>
                        <div className="input-group">
                            <input
                                type="search"
                                className="form-control"
                                placeholder="search by job name ..."
                                aria-label="Recipient's username"
                                aria-describedby="button-addon2"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-md-column flex-lg-row flex-column gap-lg-3">
                    <div className="col-md-12 col-lg-3">
                        <div className="card border-2">
                            <div className="card-body">
                                <h5 className="fw-semibold">Filter</h5>
                                <hr/>
                                <label className="form-label fw-semibold">Jobs Type</label>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="1"
                                        value={'Full Time'}
                                        checked={fullTime}
                                        onChange={() => setFullTime(!fullTime)}
                                    />
                                    <label className="form-check-label" htmlFor="1">
                                        Full Time
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="2"
                                        value={'Part Time'}
                                        checked={partTime}
                                        onChange={() => setPartTime(!partTime)}
                                    />
                                    <label className="form-check-label" htmlFor="2">
                                        Part Time
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="3"
                                        value={'Freelance'}
                                        checked={freelance}
                                        onChange={() => setFreelance(!freelance)}
                                    />
                                    <label className="form-check-label" htmlFor="3">
                                        Freelance
                                    </label>
                                </div>
                                <label htmlFor="" className='mt-3 fw-semibold'>Sort by</label>
                                <div className="filter-sort-container d-flex flex-row w-100 mt-2 mb-3">
                                    <h6 className={`left px-3 py-1 col-6 text-center shadow-none hover-op6 fw-normal ${sorting === 'desc' ? 'bg-blue text-light' : 'bg-secondary-admin text-dark'}`} style={{ borderRadius: '.5rem 0rem 0rem .5rem', boxShadow: '.1rem .1rem .2rem grey' }} onClick={() => setSorting("desc")}>
                                        Newest
                                    </h6>
                                    <h6 className={`left px-3 py-1 col-6 text-center shadow-none hover-op6 fw-normal ${sorting === 'asc' ? 'bg-blue text-light' : 'bg-secondary-admin text-dark'}`} style={{ borderRadius: '0rem .5rem .5rem 0rem', boxShadow: '.1rem .15rem .2rem grey' }} onClick={() => setSorting("asc")}>Oldest</h6>
                                </div>

                                <label className="form-label fw-semibold">Salary range</label>
                                <small> ( In 1000 Rupiah )</small>

                                <div className="salary-range d-flex flex-row gap-3 justify-content-center">
                                    <div className="box d-flex flex-row gap-2">
                                        <div className="input-group input-group-sm mb-3">
                                            <input type="number" name='lower' className="form-control" style={{ borderBottom: '3px solid #00A3E1' }} value={min} onChange={(e) => handleSalaryChange(e)} />
                                        </div>
                                    </div>
                                    <h6 className="d-flex align-items-center"> - </h6>
                                    <div className="box d-flex flex-row gap-2">
                                        <div className="input-group input-group-sm mb-3">
                                            <input type="number" name='upper' className="form-control" style={{ borderBottom: '3px solid #00A3E1' }} value={max} onChange={(e) => handleSalaryChange(e)} />
                                        </div>
                                    </div>
                                </div>
                                {RangeError != '' && (
                                    <>

                                        <div className="error text-danger">
                                            <span>{RangeError}</span>
                                        </div>

                                        <div className="button mt-3">
                                            <span className='btn btn-sm bg-blue text-light' style={{ opacity: '0.5', cursor: 'not-allowed' }}>Apply</span>
                                        </div>
                                    </>
                                )}
                                {RangeError == '' && (
                                    <div className="button mt-3">
                                        <span className='btn btn-sm bg-blue text-light hover-op6' onClick={() => setButton(button + 1)}>Apply</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-9">
                        <div className="bot-om d-flex flex-row w-100 justify-content-between bg-clear stciky-bottom ">
                            <div className="d-flex flex-md-row flex-column gap-3 justify-content-between">
                                <div className="mb-3">
                                    <small>
                                        Showing {pageInfo.lower} - {pageInfo.upper} From {pageInfo.jobCount} Jobs
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {jobSearch.length !== 0 &&
                                jobSearch.map((item) => (
                                    <div key={item.id} className="col">
                                        <Link to={`/jobs/detail/${item.id}`} style={{ textDecoration: 'none' }}>
                                            <div className="card w-auto shadow dng-card-job border-2 h-100"style={{ border:'none' }}>
                                                <img
                                                    className="card-img-top w-100 d-block text-decoration-none"
                                                    src={'http://127.0.0.1:8000/api/storage/thumbnails/' + item.thumbnail}
                                                    style={{ borderBottom: '5px solid  #702F8A', height: '10rem', objectFit: 'cover' }}
                                                />
                                                <div className="card-body d-flex flex-column justify-content-between">
                                                    <h5 className="card-title">{item.name}</h5>
                                                    <div>
                                                        <h6 className='text-secondary' style={{ fontSize:'.9rem' }}>{item.client.companyName}</h6>
                                                        <div className="d-block gap-3">
                                                            <h6 className={`badge  rounded-pill me-2 ${item.type === 'Full Time' ? 'bg-blue-t text-blue' : item.type === 'Freelance' ? 'bg-purple-t text-purple' : 'bg-orange-t text-orange'}`}>
                                                                {item.type}
                                                            </h6>
                                                            <h6 className={`badge rounded-pill ${item.status === 'Vacant' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>
                                                                {item.status}
                                                            </h6>
                                                        </div>
                                                        <div>
                                                            <h6 className='fs-8'>
                                                                <i className="fas fa-money-bill-wave"></i> Salary up to {formattedSalary(item.gajiUpper)}
                                                            </h6>
                                                            <h6 className='fs-8'>
                                                                <i className="far fa-calendar-alt"></i> {item.kontrakStart} s.d {item.kontrakEnd}
                                                            </h6>
                                                        </div>

                                                        <h6 className="text-success fs-8">Latest Apply Date : {formatDateContract(item.latestApplyDate)}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                        </div>


                        {keyword == '' && (
                            <div className="bottom-0 d-flex flex-row w-100 justify-content-between bg-clear mt-4 w-100">
                                <div className="pagination w-100">
                                    <Pagination totalPage={totalPage} page={page} limit={limit} siblings={1} onPageChange={onPageChange} setLimit={setLimit} setPage={setPage} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div >
            {loading && (
                <Loading />
            )}
        </>
    )
}

export default Jobs