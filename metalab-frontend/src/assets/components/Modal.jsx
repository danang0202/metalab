const Modal = (props) => {
    // const modalTitle = props.modalTitle;
    const modalBody = props.modalBody;
    const modalBtnText = props.modalBtnText;
    const modelBtnType = props.modelBtnType;

    return (
        <>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="smooth-transition modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 custom-modal-background">
                            <h1 className="modal-title fs-5" id="exampleModalLabel"><img src="/public/images/logo-transparan.png" alt="" style={{ width:'10rem' }} /></h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                        <i className="fa-solid fs-1  mt-2 mb-4 fa-triangle-exclamation me-2 text-warning"></i>
                            <p className="">{modalBody}</p> 
                        </div>
                        <div className="modal-footer border-0">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {modalBtnText && (
                                <button type={modelBtnType} className="btn bg-blue text-light hover-op6" data-bs-dismiss="modal">{modalBtnText}</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal