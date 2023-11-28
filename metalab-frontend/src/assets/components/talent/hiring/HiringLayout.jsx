import HiringEmpty from '../HiringEmpty'
import HiringCard from '../HiringCard'
import { useState } from 'react'
import api from '../../../apiConfig/apiConfig'
import { useEffect } from 'react'
import Loading from '../../Loading'
import Pagination from '../../pagination/Pagination'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'

const HiringLayout = () => {
    const [loading, setLoading] = useState(false);
    const [baseHiring, setbaseHiring] = useState([]);
    const [hiring, setHiring] = useState([]);
    const token = Cookies.get('token_metalab');
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [hiringLimit, setHiringLimit] = useState([]);
    const [totalPage, setTotalPage] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('email_metalab') == null) {
            navigate('/login');
        }
    }, [])

    useEffect(() => {

        const fetchHiringUserProgress = async () => {

            // tambahkan cek apakha user disable atau tidak

            setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/hiring/data-user-hiring`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setHiring(response.data.hiring)
                        setbaseHiring(response.data.hiring)
                    } else if (response.status === 204) {
                        setHiring(null);
                    }
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    console.error('Error:', error);
                }
            }
        }
        fetchHiringUserProgress();
    }, []);

    useEffect(() => {
        const hiringFilter = function (filter) {
            let array = [];
            if (filter == 'Other') {
                array = baseHiring.filter((item) => item.status === 'Rejected' || item.status === 'Cancelled');
            } else {
                array = baseHiring.filter((item) => item.status.includes(filter));
            }
            if (array != null && array.length !== 0) {
                setHiring(array)
            } else {
                setHiring([]);
            }

        }
        hiringFilter(filter);
        setPage(1);
    }, [baseHiring, filter])

    useEffect(() => {
        const getHiringLimits = function (pages, limits) {
            if (hiring != null && hiring.length !== 0) {
                let array = [];
                for (let i = (pages - 1) * limits; i < (pages * limits) && i < hiring.length; i++) {
                    array.push(hiring[[i]])

                }
                setHiringLimit(array);
                setTotalPage(Math.ceil(hiring.length / limit));
            } else {
                {
                    [
                        setHiringLimit([])
                    ]
                }
            }
        }
        getHiringLimits(page, limit)
    }, [hiring, limit, page])

    const onPageChange = (value) => {
        if (value === '&laquo' || value === '... ') {
            setPage(1);
        } else if (value === '&lsaquo') {
            if (page !== 1) {
                setPage(page - 1);
            }
        } else if (value === '&rsaquo') {
            if (page !== totalPage) {
                setPage(page + 1);
            }
        } else if (value === '&raquo' || value === ' ...') {
            setPage(totalPage);
        } else {
            setPage(value);
        }
    }

    return (
        <>
            <div className="mt-1">
                <div className="d-flex py-1 justify-content-center gap-lg-4 gap-md-4 gap-2 bg-coba align-items-center py-3 filter-navigation">
                    <div className="box">
                        <h6 className={`btn btn-sm hover-op6 ${filter === '' ? 'bg-blue text-light' : 'btn-secondary'}`} onClick={() => setFilter('')}><i className="fa-solid fa-database me-2"></i>All Data</h6>
                    </div>
                    <div className="box">
                        <h6 className={`btn btn-sm hover-op6 ${filter === 'On Progress' ? 'bg-blue text-light' : 'btn-secondary'}`} onClick={() => setFilter('On Progress')}><i className="fa-solid fa-spinner me-2"></i>On Progress</h6>
                    </div>
                    <div className="box">
                        <h6 className={`btn btn-sm hover-op6 ${filter === 'Hired' ? 'bg-blue text-light' : 'btn-secondary'}`} onClick={() => setFilter('Hired')}><i className="fa-solid fa-briefcase me-2"></i>Hired</h6>
                    </div>
                    <div className="box">
                        <h6 className={`btn btn-sm hover-op6 ${filter === 'Completed' ? 'bg-blue text-light' : 'btn-secondary'}`} onClick={() => setFilter('Completed')}><i className="fa-solid fa-receipt me-2"></i>Completed</h6>
                    </div>
                    <div className="box">
                        <h6 className={`btn btn-sm hover-op6 ${filter === 'Other' ? 'bg-blue text-light' : 'btn-secondary'}`} onClick={() => setFilter('Other')}><i className="fa-solid fa-circle-xmark me-2"></i>Other</h6>
                    </div>
                </div>
                <div className="container d-flex flex-column align-items-center">
                    <div className="d-flex flex-column col-lg-7 col-md-11 col-12 ">
                        {!loading && hiringLimit == null || hiringLimit.length === 0 ? (
                            <HiringEmpty />
                        ) : (
                            hiringLimit
                                .map((item) => (
                                    <HiringCard item={item} key={item.id} />
                                ))
                        )
                        }
                    </div>
                    <div className="d-flex py-5 col-lg-7">
                        <Pagination totalPage={totalPage} page={page} limit={limit} siblings={1} onPageChange={onPageChange} setLimit={setLimit} setPage={setPage} />
                    </div>
                </div>

            </div>
            {loading && (
                <Loading />
            )}
        </>
    )


}

export default HiringLayout