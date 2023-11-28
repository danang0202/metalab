import React from 'react'
import { paginationUtils } from '../talent/hiring/paginationUtils'
import { set } from 'lodash'

const Pagination = (props) => {
    let array = paginationUtils(props.totalPage, props.page, props.limit, props.siblings)
    return (
        <>
            <div className="d-flex justify-content-between w-100">
            <div className="box mx-3 d-flex flex-row h-auto align-items-center">
                <label htmlFor="show-number">show:</label>
                <select id="show-number" className="form-select form-select-sm mx-1" value={props.limit} onChange={(e) => {props.setLimit(e.target.value); props.setPage(1)}}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select>
            </div>

            <ul className="pagination pagination-sm d-flex flex-row h-auto align-items-center m-0">
                <li className="page-item">
                    <a className="page-link" onClick={() => props.onPageChange('&laquo')} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li className="page-item"><a className="page-link" onClick={() => props.onPageChange('&lsaquo')} >&lsaquo;</a></li>
                {array
                    .map((value, index) => (
                        <li className="page-item" key={index}><a className={`page-link hover-bg-orange ${props.page == value ? 'bg-blue text-light' : ''}`} onClick={() => props.onPageChange(value)}>{value}</a></li>
                    ))}
                <li className="page-item"><a className="page-link" onClick={() => props.onPageChange('&rsaquo')}>&rsaquo;</a></li>
                <li className="page-item">
                    <a className="page-link" onClick={() => props.onPageChange('&raquo')} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
            </div>
        </>
    )
}

export default Pagination
