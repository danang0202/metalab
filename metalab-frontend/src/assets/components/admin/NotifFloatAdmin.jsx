const NotifFloatAdmin = (props) => {
    const status = props.status;
    const text = props.text;
    return (
        <>
            {status == 'fail' ? (
                <div className="from-right notif position-absolute" style={{ top: '.5rem', right: '1rem', zIndex: '1000' }}>
                    <div className="box d-flex flex-row gap-4 bg-danger-notif px-3 py-3 align-items-center" style={{ borderLeft: '5px solid rgba(242, 5, 5)' }}>
                        <i className="fa-solid fa-circle-xmark fs-4 text-danger"></i>
                        <h6 className='m-0'>{text} !</h6>
                        <div className="box ps-3" style={{ borderLeft:'1px solid grey' }}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="from-right notif position-absolute" style={{ top: '.5rem', right: '1rem', zIndex: '1000' }}>
                    <div className="box d-flex flex-row gap-4 bg-green-notif px-3 py-3 align-items-center" style={{ borderLeft: '5px solid rgba(26, 192, 115)' }}>
                        <i className="fa-solid fa-circle-check fs-4 text-green"></i>
                        <h6 className='m-0'>{text} !</h6>
                        <div className="box ps-3" style={{ borderLeft:'1px solid grey' }}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default NotifFloatAdmin