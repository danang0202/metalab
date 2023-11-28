import DetailHiringButton from './DetailHiringButton';
import { apiURL } from '../../../main';

const JobInfoCard = (props) => {
    const item = props.item;
    return (
        <>
            <div className="d-flex flex-row justify-content-between w-100">
                <div className="description mt-2 d-flex flex-column justify-content-between">
                    <h5 className="job-name">{item.job.name}</h5>
                    <h6 className="fw-normal text-secondary company-name" style={{ fontSize: '.9rem' }}>{item.clientCompanyName}</h6>
                    <h6><span className={`badge rounded-pill ${item.job.type === 'Full Time' ? 'bg-blue-t text-blue' : item.job.type === 'Freelance' ? 'bg-purple-t text-purple' : 'bg-orange-t text-orange'}`}>{item.job.type}</span></h6>
                </div>
                <div className="inner-box d-flex flex-column">
                    <div className="d-flex flex-row justify-content-between h-100">
                        <div className="box d-flex flex-column align-items-end">
                            <p className={`mt-2 fw-bold badge rounded-pill ${item.status === 'On Progress' ? 'bg-blue' : item.status === 'Completed' ? 'bg-purple' : item.status === 'Rejected' ? 'bg-danger' : item.status == 'Hired' ? 'bg-green' : 'bg-orange'}`}>{item.status}</p>
                            <DetailHiringButton id={item.id} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default JobInfoCard