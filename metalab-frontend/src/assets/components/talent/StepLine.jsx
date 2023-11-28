function StepLine(props) {
    const item = props.item;
    const mobile = props.mobile;
    return (
        <>
            {!mobile ? (
                <div className="stage-bar py-2">
                    <ul className={`step-wizard-list d-flex p-0 m-0 ${item.job.type}-list`}>
                        <li className={`step-wizard-item d-flex flex-column align-items-center px-2 container-fluid ${item.lastStage === 1 ? 'current-item' : ''} ${item.job.type}`}>
                            <span className="progess-count">1</span>
                            <span className="progress-label txet-center fs-8 d-none d-md-block">Administration</span>
                            <span className="progress-label txet-center fs-7 d-block d-md-none">Administration</span>
                        </li>
                        <li className={`step-wizard-item d-flex flex-column align-items-center px-2 container-fluid ${item.lastStage === 2 ? 'current-item' : ''} ${item.job.type}`}>
                            <span className="progess-count">2</span>
                            <span className="progress-label fs-8  d-none d-md-block">Competency</span>
                            <span className="progress-label fs-7 d-block d-md-none">Competency</span>
                        </li>
                        <li className={`step-wizard-item d-flex flex-column align-items-center px-2 container-fluid ${item.lastStage === 3 && item.status !== 'Hired' && item.status !== 'Completed' ? 'current-item' : ''} ${item.job.type}`}>
                            <span className="progess-count ">3</span>
                            <span className="progress-label fs-8 d-none d-md-block">Interview</span>
                            <span className="progress-label fs-7 d-block d-md-none">Interview</span>
                        </li>
                        {item.job.type === 'Freelance' && (
                            <li className={`step-wizard-item d-flex flex-column align-items-center px-2 container-fluid ${item.lastStage === 4 && item.status !== 'Hired' && item.status !== 'Completed' ? 'current-item' : ''} ${item.job.type}`}>
                                <span className="progess-count">4</span>
                                <span className="progress-label fs-8 d-none d-md-block">Matching</span>
                                <span className="progress-label fs-7 d-block d-md-none">Matching</span>
                            </li>
                        )}
                    </ul>
                </div>
            ) : (
                <div className="stage-bar py-2 ">
                    <ul className={`step-wizard-list d-flex p-0 m-0 ${item.job.type}-list`}>
                        <li className={`step-wizard-item d-flex flex-column align-items-center px-2 container-fluid ${item.lastStage === 1 ? 'current-item' : ''} ${item.job.type}`}>
                            <span className="progess-count ">1</span>
                            <span className="progress-label fs-7">Administration</span>
                        </li>
                        <li className={`step-wizard-item d-flex flex-column align-items-center px-2 container-fluid ${item.lastStage === 2 ? 'current-item' : ''} ${item.job.type}`}>
                            <span className="progess-count">2</span>
                            <span className="progress-label fs-7">Competency</span>
                        </li>
                        <li className={`step-wizard-item d-flex flex-column  align-items-center px-2 container-fluid ${item.lastStage === 3  && item.status !== 'Hired' && item.status !== 'Completed'? 'current-item' : ''} ${item.job.type}`}>
                            <span className="progess-count ">3</span>
                            <span className="progress-label fs-7">Interview</span>
                        </li>
                        {item.job.type === 'Freelance' && (
                            <li className={`step-wizard-item d-flex flex-column align-items-center px-2 container-fluid ${item.lastStage === 4 && item.status !== 'Hired'  && item.status !== 'Completed' ? 'current-item' : ''} ${item.job.type}`}>
                                <span className="progess-count ">4</span>
                                <span className="progress-label fs-7">Matching</span>
                            </li>
                        )}
                    </ul>
                </div >
            )}
        </>
    );
}

export default StepLine;
