import React from 'react'
import { Link } from 'react-router-dom'

const HiringEmpty = () => {
    return (
        <>
            <div className="d-flex flex-column align-items-center p-2">
                <img src="/images/empty-icon.png" alt="" style={{ width: '8rem' }} />
                <h5 className='text-secondary my-3'>Job Applications Not Found</h5>
                <Link to={'/job'}>
                    <p className='btn btn-warning fw-sm-bold text-light my-3'>Apply Now</p>
                </Link>
            </div>
        </>
    )
}

export default HiringEmpty