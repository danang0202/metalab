const Decision = (props) => {
    const status = props.status;
    return (
        <>
            <div className={`border rounded px-4 py-2 shadow-sm ${status == "Accepted" ? 'bg-green' : status == 'Rejected' ? 'bg-danger' : 'bg-orange'}`} style={{ marginTop: '20px' }}>
                <div className="keputusan-container d-flex gap-3 justify-content-center">
                    <h4 className={`fw-bold text-light`}><i className={`fa-solid ${status == 'Accepted' ? 'fa-circle-check' : status == 'Rejected' ? 'fa-circle-xmark' : 'fa-bars-progress'} me-2`}></i>{status}</h4>
                </div>
            </div>
        </>
    )
}

export default Decision