import { apiURL } from '../../../../main';
import StepLine from '../../StepLine';

const HeaderStage = (props) => {
    const job = props.job;
    const hiring = props.hiring;
    return (
        <>
            <div className="border rounded p-md-4 p-2 py-3 shadow-sm">
                <div className="d-flex flex-lg-row flex-md-row flex-row gap-md-4 gap-3 align-items-start">
                    <div className="company-logo">
                        <img src={`${apiURL}/storage/client/${job.client.companyLogo}`} className="rounded " alt="" style={{ width: '9rem', height: '9rem', objectFit: 'cover' }} />
                    </div>
                    <div className="d-flex flex-column w-100">
                        <div className="hiring-detail-container d-flex flex-row justify-content-between w-100">
                            <div className="description mt-2 d-flex flex-column justify-content-between">
                                <h5 className="job-name">{job.name}</h5>
                                <h6 className="fw-normal text-secondary company-name" style={{ fontSize: '0.9rem' }}>{job.client.companyName}</h6>
                                <div className="d-flex flex-row gap-3">
                                    <h6><span className={`badge rounded-pill ${job.type === 'Full Time' ? 'bg-blue-t text-blue' : job.type === 'Freelance' ? 'bg-purple-t text-purple' : 'bg-orange-t text-orange'}`}>{job.type}</span></h6>
                                    <h6><span className={`badge rounded-pill ${job.status === 'Vacant' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{job.status}</span></h6>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex d-none d-lg-block">
                            <div className="inner-box d-flex flex-column col-12">
                                <StepLine item={hiring} mobile={false} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex d-block d-md-block d-lg-none p-0" >
                    <div className="inner-box d-flex flex-column col-12">
                        <StepLine item={hiring} mobile={true} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeaderStage