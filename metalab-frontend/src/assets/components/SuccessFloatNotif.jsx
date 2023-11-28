import React from 'react'

const SuccessFloatNotif = (props) => {
    const message = props.message;
    return (
        <>
            <div className="position-fixed w-100 d-flex justify-content-center" style={{ top: '5rem', left: '0rem' }}>
                <div className="col-6">
                    <div className="smooth-transition alert alert-success d-flex align-items-center gap-3 my-2 d-flex flex-row justify-content-center align-items-center" role="alert">
                        <i className="fa-solid fa-circle-check text-green fs-5"></i>
                        <div>
                            {message}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SuccessFloatNotif