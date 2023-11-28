import React from 'react'
import { Link } from 'react-router-dom'
function DetailHiringIcon(props) {
    const id = props.id;
    return (
        <Link to={`/hiring/detail/${id}`}>
            <p className="btn btn-outline-warning fs-6"><i className="fa-solid fa-circle-info text-orange"></i></p>
        </Link>
    )
}

export default DetailHiringIcon