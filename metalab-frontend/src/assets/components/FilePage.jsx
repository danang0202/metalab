import { useParams } from 'react-router-dom'
import { apiURL } from '../main';

const FilePage = () => {
    const filename = useParams().filename;
    const extension = useParams().extension;
    return (
        <>
            <div className="box" style={{ width:'100vw', height:'100vh' }}>
                <iframe src={`${apiURL}/storage/hiring/${filename}.${extension}`} width="100%" height="100%"></iframe>
            </div>
        </>
    )
}

export default FilePage