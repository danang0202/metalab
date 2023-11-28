import TableTalent from './TableTalent'
import TalentDetailSideScreen from './TalentDetailSideScreen'
import api from '../../../apiConfig/apiConfig';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import PaginationAdmin from '../../pagination/PaginationAdmin';
import Loading from '../../Loading';

const LayoutAdminTalent = () => {
    const [talent, setTalent] = useState([]);
    const [loading, setLoading] = useState(false);
    const userRole = Cookies.get('role_metalab');
    const token = Cookies.get('token_metalab');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [totalPage, setTotalPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [selectedTalent, setSelectedTalent] = useState({});
    const [goSearch, setGoSearch] = useState(1);
    const [pageInfo, setPageInfo] = useState([]);

    useEffect(() => {
        const fetchDataTalent = async () => {

            const data = {
                page: page,
                perPage: limit,
                keyword: keyword
            }

            setLoading(true);
            if (token) {
                try {
                    const response = await api.post(`/get-all-talent`, data, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setTalent(response.data.talents);
                        setSelectedTalent(response.data.talents[0])
                        setPageInfo(response.data.page);
                    }
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    console.error('Error:', error);
                }
            }
        };
        fetchDataTalent();
    }, [goSearch, limit])

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

    useEffect(() => {
        if (talent && selectedTalent) {
            const updatedTalent = [...talent];
            const indexToUpdate = updatedTalent.findIndex(item => item.id === selectedTalent.id);
            updatedTalent[indexToUpdate] = selectedTalent;
            setTalent(updatedTalent);
        }
    }, [selectedTalent])

    const handleChangeUserStatus = async (command) => {
        setLoading(true);
        if (command == 'makeDisable') {
            const response = await api.get(`/make-disable/${selectedTalent.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setSelectedTalent(response.data.user);
            }
            setLoading(false);
        } else {
            const response = await api.get(`/make-enable/${selectedTalent.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setSelectedTalent(response.data.user);
            }
            setLoading(false);
        }
    }

    return (
        <>
            <div className="table-talent-container w-100 bg-light px-4 py-3"
                style={{ borderRadius: '2rem' }}>
                <div className="header d-flex flex-row justify-content-between align-items-center mb-4">
                    <h5 className='text-dark'>Talent List</h5>
                    <form onSubmit={searchSubmit}>
                        <span className="input-group mb-3 w-auto">
                            <input
                                type="text"
                                className="form-control rounded-0 border-0 rounded-start-3 w-auto"
                                placeholder="Search..."
                                value={keyword} onChange={(e) => setKeyword(e.target.value)}
                            />
                            <button
                                className="btn bg-orange rounded-0 border-0 rounded-end-3 d-flex align-content-center"
                                type="submit">
                                <i className="material-icons text-white">search</i>
                            </button>
                        </span>
                    </form>
                </div>
                <TableTalent talents={talent} setSelectedTalent={setSelectedTalent} />
                <div className="pagination d-flex justify-content-between w-100 mt-2">
                    <div className="box ps-2 w-100">
                        <h6>Show {(page - 1) * (limit) + 1} - {(page - 1) * (limit) + limit < talent.length ? (page - 1) * (limit) + limit : talent.length} from {talent.length} data</h6>
                    </div>
                    <div className="d-flex flex-end justify-content-end w-100">
                        <PaginationAdmin totalPage={totalPage} page={page} limit={limit} siblings={1}
                            onPageChange={onPageChange} setLimit={setLimit} setPage={setPage} />
                    </div>
                </div>
            </div>

            <div className="d-lg-block d-md-none" style={{ maxWidth: '250px', height: '90vh' }}>
                <TalentDetailSideScreen item={selectedTalent} setSelectedTalent={setSelectedTalent}
                    handleChangeUserStatus={handleChangeUserStatus} />
            </div>

            {loading &&
                <Loading />
            }
        </>
    )
}

export default LayoutAdminTalent