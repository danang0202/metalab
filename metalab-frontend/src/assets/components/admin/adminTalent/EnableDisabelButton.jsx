const EnableDisabelButton = (props) => {

    const userStatus = props.userStatus;
    const handleChangeUserStatus = props.handleChangeUserStatus;

    return (
        <>
            {userStatus == 'Enable' ? (
                <>
                    <i className="fa-solid fa-circle-check fs-3 text-green" style={{ cursor: 'not-allowed' }}></i>
                    <i className="fa-solid fa-ban fs-3 text-danger hover-op6" onClick={() => handleChangeUserStatus('makeDisable')}></i>
                </>

            ) : (
                <>
                    <i className="fa-solid fa-circle-check fs-3 text-green hover-op6" onClick={() => handleChangeUserStatus('makeEnable')}></i>
                    <i className="fa-solid fa-ban fs-3 text-danger" style={{ cursor: 'not-allowed' }}></i>
                </>
            )}

        </>

    )
}

export default EnableDisabelButton