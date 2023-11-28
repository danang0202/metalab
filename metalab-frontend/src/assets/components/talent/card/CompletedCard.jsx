import JobInfoCard from '../small/JobInfoCard';
import { apiURL, formatDateContract } from "../../../main";

const CompletedCard = (props) => {
    const item = props.item;
    return (
        <>
            <div key={item.id} className="card-container shadow p-2 mt-3 rounded">
                <div className="stage-container d-flex flex-row gap-4 ps-1 pe-md-3 w-100">
                    <div className="progress-card-img d-flex flex-row gap-3 w-100">
                        <img src={`${apiURL}/storage/thumbnails/${item.job.thumbnail}`} className="rounded my-2" alt="" style={{ width: '8rem', height: '9rem', objectFit: 'cover' }} />
                        <div className="d-flex flex-column w-100">
                            <JobInfoCard item={item} />
                            <div className="box-stampel position-absolute">
                                <img src="/images/completed-stampel.png" alt="..." style={{ width: '8rem', zIndex: '-1' }} />
                            </div>

                            <div className="stepline-large d-none d-md-block">
                                <div className="box d-flex flex-row justify-content-between align-items-center mt-4">
                                    <h6 className='fw-normal fs-8'>{formatDateContract(item.job.kontrakStart)} - {formatDateContract(item.job.kontrakEnd)} </h6>
                                    <h6 className='text-success '><span className='badge bg-green-t text-green rounded-pill'>Remaining 0 days</span></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-block d-md-none">
                    <div className="box d-flex flex-row justify-content-between align-items-center">
                        <h6 className='fw-normal fs-8'>{formatDateContract(item.job.kontrakStart)} - {formatDateContract(item.job.kontrakEnd)} </h6>
                        <h6 className='text-success '><span className='badge bg-green-t text-green rounded-pill'>Remaining 0 days</span></h6>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompletedCard