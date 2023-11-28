import { apiURL } from '../../../main';
import { useParams } from 'react-router-dom';

const FileChat = () => {
    const filename = useParams().filename;
    const extension = useParams().extension;
    return (
        <>
            <div className="box" style={{ width: '100vw', height: '100vh' }}>
                <iframe src={`${apiURL}/storage/chatFiles/${filename}.${extension}`} height="100%"  width="100%"></iframe>
            </div>
        </>
    )
}

export default FileChat