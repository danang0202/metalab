import React from 'react'
import { paginationUtils } from '../talent/hiring/paginationUtils'
import { set } from 'lodash'

const PaginationAdmin = (props) => {
    let array = paginationUtils(props.totalPage, props.page, props.limit, props.siblings)
    return (
        <>
            <div className="box mx-3">
                <select className="form-select form-select-sm" value={props.limit} onChange={(e) => {props.setLimit(e.target.value); props.setPage(1)}}>
                    <option value="5">5</option>
                    <option value="8">8</option>
                    <option value="15">15</option>
                </select>
            </div>
            <ul className="pagination pagination-sm">
                <li className="page-item">
                    <a className="page-link" onClick={() => props.onPageChange('&laquo')} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li className="page-item"><a className="page-link" onClick={() => props.onPageChange('&lsaquo')} >&lsaquo;</a></li>
                {array
                    .map((value, index) => (
                        <li className="page-item" key={index}><a className={`page-link ${props.page == value ? 'bg-blue text-light' : ''}`} onClick={() => props.onPageChange(value)}>{value}</a></li>
                    ))}
                <li className="page-item"><a className="page-link" onClick={() => props.onPageChange('&rsaquo')}>&rsaquo;</a></li>
                <li className="page-item">
                    <a className="page-link" onClick={() => props.onPageChange('&raquo')} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </>
    )
}

export default PaginationAdmin