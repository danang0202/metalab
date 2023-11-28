import Swal from 'sweetalert2';

const DecisionButton = (props) => {
    const decisionSubmit = props.decisionSubmit;
    const jobStatus = props.jobStatus;

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn bg-blue text-light hover-op6 ms-2",
            cancelButton: "btn bg-danger text-light hover-op6 me-2"
        },
        buttonsStyling: false
    });

    const dicisionConfirmationAccept = () => {
        swalWithBootstrapButtons.fire({
            title: "Are you sure to accept?",
            text: "You won't be able to revert this !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, sure !",
            cancelButtonText: "No, cancel !",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                decisionSubmit('Accepted');

            }
        });
    }

    const dicisionConfirmationReject = () => {
        swalWithBootstrapButtons.fire({
            title: "Are you sure to reject?",
            text: "You won't be able to revert this !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, sure !",
            cancelButtonText: "No, cancel !",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                decisionSubmit('Rejected');
            }
        });
    }

    return (
        <>
            <div className="body d-flex flex-row gap-5 py-3 justify-content-center">
                <div className="">
                    <div className="text-center">
                        <button className="btn bg-danger shadow fw-semibold text-white hover-op6" style={{ width: '100%' }} onClick={() => dicisionConfirmationReject()} ><i className="fa-regular fa-circle-xmark me-2"></i>Reject</button>
                    </div>
                </div>
                <div className="">
                    {jobStatus == 'Full Hired' ? (
                        <div className="text-center" style={{ cursor: 'not-allowed' }}>
                            <button className="btn bg-green text-white btn-sm fw-semibold hover-op6" style={{ width: '100%' }} type='button' disabled='true'>Accepted</button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <button className="btn bg-green text-white shadow fw-semibold hover-op6" style={{ width: '100%' }} onClick={() => dicisionConfirmationAccept()} ><i className="fa-regular fa-circle-check me-2"></i>Accept</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default DecisionButton