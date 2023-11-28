import React from 'react'
import { Link } from 'react-router-dom'
import HiringEmpty from '../../talent/HiringEmpty';

const TableTalentHiring = (props) => {
    const filter = props.filter;
    const hiring = props.hiring;
    const currentDate = new Date();

    const remainingDays = (kontrakStartString, kontrakEndString) => {
        const kontrakStart = new Date(kontrakStartString);
        const kontrakEnd = new Date(kontrakEndString);
        if (currentDate < kontrakStart) {
            // Hari ini lebih awal dari kontrakStart
            return (Math.ceil((kontrakEnd - kontrakStart) / (1000 * 60 * 60 * 24)));
        } else if (currentDate >= kontrakStart && currentDate <= kontrakEnd) {
            // Hari ini di antara kontrakStart dan kontrakEnd
            return (Math.ceil((kontrakEnd - currentDate) / (1000 * 60 * 60 * 24)));
        } else {
            return (0);
        }
    }
    return (
        <>
            {hiring && hiring.length != 0 ? (
                <table className='table table-borderless' style={{ borderSpacing: '2rem' }}>
                    <thead className='sticky-top'>
                        <tr>
                            <th className='text-center bg-light text-black-50'>Job Name</th>
                            <th className='text-center bg-light text-black-50'>Client</th>
                            <th className='text-center bg-light text-black-50'>Type Job</th>
                            <th className='text-center bg-light text-black-50'>{filter == "On Progress" ? 'Stage' : filter == 'Hired' ? 'Remaining' : filter == "Completed" ? 'Kontrak Start' : 'Last Stage'}</th>
                            {filter == 'Completed' && (
                                <th className='text-center bg-light text-black-50'>Kontrak End</th>
                            )}
                            <th className='text-center bg-light text-black-50'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hiring.length !== 0 && hiring.map((item, index) => (
                            <tr key={index}>
                                <td className='text-center'><span><a href={`/admin/job/detail/1`} className='text-dark hover-blue text-decoration-none'>{item.job.name}</a></span></td>
                                <td className='text-center'><span><a href={`/admin/client/detail/1`} className='text-dark hover-blue text-decoration-none'>PT Meta Lab</a></span></td>
                                <td><span className={`badge  rounded-pill ${item.job.type == 'Full Time' ? 'bg-blue-t text-blue' : item.job.type == 'Freelance' ? 'bg-purple-t text-purple' : 'bg-orange-t text-orange'}`}>{item.job.type}</span></td>
                                <td className='fw-bold text-success text-center '>
                                    {filter === "On Progress"
                                        ? item.lastStage
                                        : filter === 'Hired'
                                            ? (remainingDays(item.job.kontrakStart, item.job.kontrakEnd)) + ' hari'
                                            : filter === "Completed"
                                                ? item.job.kontrakStart
                                                : item.lastStage}
                                </td>
                                {filter == "Completed" && (
                                    <td className='fw-bold text-success '>{item.job.kontrakEnd}</td>
                                )}
                                <td className='text-center'>
                                    <Link to={`/admin/hiring/detail/${item.id}`}>
                                        <span className='btn btn-sm bg-blue text-light hover-op6'>
                                            <i className="fa-solid fa-circle-info" style={{ marginRight: '.5rem' }}></i>Detail
                                        </span>
                                    </Link>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            ) : (
                <div className="w-100 text-center py-5">
                    <div className="d-flex flex-column align-items-center p-2">
                        <img src="/images/empty-icon.png" alt="" style={{ width: '8rem' }} />
                        <h5 className='text-secondary my-3'>Job Applications Not Found</h5>
                    </div>
                </div>
            )}

        </>
    )
}

export default TableTalentHiring