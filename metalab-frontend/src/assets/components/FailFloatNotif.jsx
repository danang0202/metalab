const FailFloatNotif = (props) => {
    const message = props.message;
    return (
        <>
            <div className="position-fixed w-100 d-flex justify-content-center" style={{ top: '5rem', left: '0rem' }}>
                <div className="col-6">
                    <div className="smooth-transition alert alert-danger d-flex align-items-center gap-3 my-2 d-flex flex-row justify-content-center align-items-center" role="alert">
                        <i className="fa-solid fa-circle-check text-danger fs-5"></i>
                        <div>
                            {message}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FailFloatNotif