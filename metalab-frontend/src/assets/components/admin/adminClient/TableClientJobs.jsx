import React from 'react'
import {Link} from 'react-router-dom';

const TableClientJobs = (props) => {
    const filter = props.filter;
    const jobs = props.jobs;
    const currentDate = new Date();
    return (
        <>
            <table className='table table-borderless table-hover' style={{ borderCollapse: 'separate', borderSpacing: '0px 7px' }}>
                <thead className='sticky-top'>
                    <tr>
                        <th className='bg-light text-black-50'>Job Name</th>
                        <th className='text-center bg-light text-black-50'>Type Job</th>
                        <th className='text-center bg-light text-black-50'>Kuota</th>
                        <th className='text-center bg-light text-black-50'>Hired</th>
                        <th className='text-center bg-light text-black-50'>Status</th>
                        <th className='text-center bg-light text-black-50'>Contract Start</th>
                        <th className='text-center bg-light text-black-50'>Contract End</th>
                        <th className='text-center bg-light text-black-50'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.length !== 0 && jobs.map((item, index) => (
                        <tr key={index} >
                            <td className='ps-3' style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}><span><a href={`/admin/job/detail/1`} className='text-dark hover-blue text-decoration-none'>{item.name}</a></span></td>
                            <td className='text-center'><span className={`badge  rounded-pill ${item.type == 'Full Time' ? 'bg-blue-t text-blue' : item.type == 'Freelance' ? 'bg-purple-t text-purple' : 'bg-orange-t text-orange'}`}>{item.type}</span></td>
                            <td className='text-center'>{item.kuota}</td>
                            <td className='text-center'>{item.hired}</td>
                            <td className='text-center'><span className={`badge rounded-pill ${item.status == 'Vacant' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{item.status}</span></td>
                            <td className='text-center'>{item.kontrakStart}</td>
                            <td className='text-center '>{item.kontrakEnd}</td>
                            <td className='text-center' style={{ borderRadius: '0rem 0.5rem 0.5rem 0rem' }}>
                                <Link to={`/admin/job/detail/${item.id}`}>
                                    <span className='btn btn-sm bg-blue text-light hover-op6'>
                                        <i className="fa-solid fa-circle-info" style={{ marginRight: '.5rem' }}></i>Detail
                                    </span>
                                </Link>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </>
    )
}

export default TableClientJobs