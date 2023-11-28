import { Link } from 'react-router-dom';

const FullHiredWarning = (props) => {
    const job = props.job;
    return (
        <>
            <div className="box-warning alert alert-danger w-100 d-flex flex-column align-items-center">
                <i className="fa-solid fa-triangle-exclamation me-2 text-danger fs-1"></i>
                <h6 className='text-center mt-4'>Full Hired !</h6>
                <div className="text-center mt-3">
                    <Link to={`/admin/job/detail/${job.id}`}>
                        <span className="btn bg-blue text-light hover-op6 btn-sm">Click for details <i className="ms-2 fa-solid fa-circle-info"></i></span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default FullHiredWarning