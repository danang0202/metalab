import { useNavigate } from 'react-router-dom';
import { apiURL } from '../../../main';

const TableTalent = (props) => {
    const talents = props.talents;
    const setSelectedTalent = props.setSelectedTalent;
    const navigate = useNavigate();

    const navigateTalentDetail = (id) => {
        navigate(`/admin/talent/detail/${id}`)
    }
    return (
        <>
            <div className="bg-light p-1">
                <div className="table overflow-y-scroll rounded table-talent-container" style={{ height: '30rem' }}>
                    <table className='table table-hover table-borderless' style={{ borderCollapse: 'separate', borderSpacing: '0px 6px' }}>
                        <thead className='sticky-top'>
                            <tr>
                                <th className='bg-light text-black-50'>Name</th>
                                <th className='bg-light text-black-50'>Email</th>
                                <th className='bg-light text-black-50'>Phone Number</th>
                                <th className='bg-light text-black-50'>Gender</th>
                                <th className='bg-light text-black-50'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                talents && talents
                                    .map((item) => (
                                        <tr key={item.id} onClick={() => setSelectedTalent(item)} >
                                            <td style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}> <img className='mx-2' src={`${item.avatar ? apiURL + '/storage/avatars/' + item.avatar : '/images/avatar-default.png'}`} alt="..." style={{ width: '2rem', height: '2rem', borderRadius: '50%', objectFit: 'cover' }} />{item.firstName} {item.lastName}</td>
                                            <td>{item.email}</td>
                                            <td>{item.phoneNumber}</td>
                                            <td><span className={`badge rounded-pill ${item.gender == 'Male' ? 'bg-blue-t text-blue' : 'bg-orange-t text-orange'}`}>{item.gender}</span></td>
                                            <td style={{ borderRadius: '0rem 0.5rem 0.5rem 0rem' }}><span className={`badge rounded-pill ${item.status == 'Enable' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{item.status}</span></td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default TableTalent