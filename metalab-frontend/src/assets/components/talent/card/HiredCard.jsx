import { useEffect } from 'react';
import { useState } from 'react';
import JobInfoCard from '../small/JobInfoCard';
import { apiURL, formatDateContract } from '../../../main';
import DetailHiringButton from '../small/DetailHiringButton';

const HiredCard = (props) => {
    const item = props.item;
    const currentDate = new Date(); // Tanggal hari ini
    const kontrakStart = new Date(item.job.kontrakStart);
    const kontrakEnd = new Date(item.job.kontrakEnd);
    const [differenceInDays, setDifferenceInDays] = useState(0);
    useEffect(() => {
        // Menghitung selisih hari
        if (currentDate < kontrakStart) {
            // Hari ini lebih awal dari kontrakStart
            setDifferenceInDays(Math.ceil((kontrakEnd - kontrakStart) / (1000 * 60 * 60 * 24)));
        } else if (currentDate >= kontrakStart && currentDate <= kontrakEnd) {
            // Hari ini di antara kontrakStart dan kontrakEnd
            setDifferenceInDays(Math.ceil((kontrakEnd - currentDate) / (1000 * 60 * 60 * 24)));
        } else {
            console.log('ts 3')
            setDifferenceInDays(0);
        }
    }, [currentDate, kontrakEnd, kontrakStart]);


    return (
        <>
            <div key={item.id} className="card-container shadow p-2 mt-3 rounded">
                <div className="stage-container d-flex flex-row gap-4 ps-1 pe-md-3 w-100">
                    <div className="progress-card-img d-flex flex-row gap-3 w-100">
                        <img src={`${apiURL}/storage/thumbnails/${item.job.thumbnail}`} className="rounded my-2" alt="" style={{ width: '8rem', height: '9rem', objectFit: 'cover' }} />
                        <div className="d-flex flex-column w-100">
                            <JobInfoCard item={item} />
                            <div className="stepline-large d-none d-md-block">
                                <div className="box d-flex flex-row justify-content-between align-items-center mt-4">
                                    <h6 className='fw-normal fs-8'>{formatDateContract(item.job.kontrakStart)} - {formatDateContract(item.job.kontrakEnd)} </h6>
                                    <h6 className='text-success '><span className='badge bg-green-t text-green rounded-pill'>Remaining {differenceInDays} days</span></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-block d-md-none">
                    <div className="box d-flex flex-row justify-content-between align-items-center">
                        <h6 className='fw-normal fs-8'>{formatDateContract(item.job.kontrakStart)} - {formatDateContract(item.job.kontrakEnd)} </h6>
                        <h6 className='text-success '><span className='badge bg-green-t text-green rounded-pill'>Remaining {differenceInDays} days</span></h6>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HiredCard