import HashLoader from "react-spinners/HashLoader";
function Loading() {
    return (
        <>
            <div className="smooth-transition position-fixed" style={{ top: '0',left:'0', width: '100vw', height: '100vh', zIndex: '1000' }}>
                <div className="d-flex flex-column justify-content-center align-items-center gap-2 w-100 h-100 bg-transparent">
                    <div className="smooth-transitionsmooth-transition d-flex flex-column justify-content-center align-items-center gap-2 bg-clear shadow p-5 rounded-3">
                        <HashLoader
                            color="#00A3E1"
                            size={40}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                        <h5 className="text-dark">Please wait...</h5>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Loading;