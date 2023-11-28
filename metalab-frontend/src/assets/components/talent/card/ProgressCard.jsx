import StepLine from "../StepLine";
import JobInfoCard from "../small/JobInfoCard";
import { apiURL } from "../../../main";

// import React from 'react'

function ProgressCard(props) {
    const item = props.item;
    return (
        <>
            <div key={item.id} className="card-container shadow p-2 mt-3 rounded">
                <div className="stage-container d-flex flex-row gap-4 ps-1 pe-md-3 w-100">
                    <div className="progress-card-img d-flex flex-row gap-3 w-100">
                        <img src={`${apiURL}/storage/thumbnails/${item.job.thumbnail}`} className="rounded my-2" alt="" style={{ width: '8rem', height: '9rem', objectFit: 'cover' }} />
                        <div className="d-flex flex-column w-100">
                            <JobInfoCard item={item} />
                            <div className="stepline-large d-none d-md-block">
                                <StepLine item={item} mobile={false} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-block d-md-none">
                    <StepLine item={item} mobile={false} />
                </div>
            </div>
        </>
    )
}

export default ProgressCard