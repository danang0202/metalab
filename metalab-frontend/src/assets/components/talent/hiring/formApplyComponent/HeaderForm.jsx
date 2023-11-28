import React from 'react'
import { apiURL } from '../../../../main';
import StepLine from '../../StepLine';
import { formatDateContract} from '../../../../main';

const HeaderForm = (props) => {
    const job = props.job;
    const hiring = {
        job: job,
        lastStage: props.lastStage
    }

    return (
        <>
            <div className="border rounded p-4 shadow-sm overflow-scroll">
                <div className="d-flex flex-row align-items-center gap-3">
                    <div className="col-md-2">
                        <img src={`${apiURL}/storage/client/${job.client.companyLogo}`} className="img-fluid rounded-start bg-blue d-none d-md-block d-leg-block" alt="" style={{ width: '10rem' }} />
                        <img src={`${apiURL}/storage/client/${job.client.companyLogo}`} className="img-fluid rounded-start bg-blue d-block d-md-none d-lg-none" alt="" style={{ width: '4rem' }} />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="">{job.name}</h5>
                            <h6 className="text-body-secondary">{job.client.companyName}</h6>
                            <div className="d-flex flex-row gap-5 justify-content-between">
                                <h6 className=""><small className={`badge  rounded-pill ${job.type == 'Full Time' ? 'bg-blue-t text-blue' : job.type == 'Freelance' ? 'bg-purple-t text-purple' : 'bg-orange-t text-orange'}`}>{job.type}</small></h6>
                                <h6 className="d-none d-md-block"><small className="text-body-secondary">Contract : {formatDateContract(job.kontrakStart)} until {formatDateContract(job.kontrakEnd)}</small></h6>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row align-items-center gap-3">
                    <div className="col-md-2 d-none d-md-block"></div>
                    <div className="inner-box d-flex flex-column col-8 d-none d-md-block">
                        <StepLine item={hiring} mobile={false} />
                    </div>
                </div>
                <div className="d-flex align-items-center d-block d-md-none container-fluid">
                    <div className="inner-box d-flex flex-column col-12">
                        <StepLine item={hiring} mobile={false} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeaderForm