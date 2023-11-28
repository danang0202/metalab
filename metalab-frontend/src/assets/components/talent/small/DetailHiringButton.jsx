import { Link } from 'react-router-dom';

const DetailHiringButton = (props) => {

    const id = props.id;
    return (
        <Link to={`/hiring/detail/${id}`} style={{ textDecoration:'none' }}>
            <p className="btn-detail btn btn-outline-warning p-1 btn-sm d-flex flex-row align-items-center"><i className="fa-solid fa-circle-info text-orange me-1"></i>Detail</p>
        </Link>
    )
}

export default DetailHiringButton