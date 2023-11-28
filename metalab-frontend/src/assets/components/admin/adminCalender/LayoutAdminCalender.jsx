import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect } from 'react';
import api from '../../../apiConfig/apiConfig';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { getEndDateCalenderEvents } from '../../../main';
import Loading from '../../Loading';

const LayoutAdminCalender = () => {
    const token = Cookies.get('token_metalab');
    const [hiring, setHiring] = useState();
    const [events, setEvents] = useState();
    const [loading, setLoading] = useState();

    useEffect(() => {
        const fetchHiringDetail = async () => {
            setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/hiring/data-calender`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log(response);
                    if (response.status === 200) {
                        setHiring(response.data.hiring)
                    }
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchHiringDetail();
    }, [])

    useEffect(() => {
        if (hiring) {
            let eventDump = [];
            hiring.map(item => {
                let event = {
                    title: `[ ${item.talent.firstName} ] - [ Stage ${item.lastStage} ] - [ ${item.job.name} ]`,
                    start: item.second_stage?.dateUser || item.third_stage?.dateUser,
                    end: getEndDateCalenderEvents(item.second_stage?.dateUser || item.third_stage?.dateUser),
                    url: `/admin/hiring/detail/${item.id}`,
                };
                eventDump.push(event);
            });
            setEvents(eventDump)
        }
    }, [hiring])

    return (
        <>
            <div className="ms-sm-auto m-0 p-0 w-100 h-100 bg-light" style={{ borderRadius: '2rem' }}>
                <div className="d-flex py-2 justify-content-between w-auto gap-2 px-4 h-100">
                    <div className="calender-container bg-light w-100 p-4">
                        <div className="d-flex mb-4">
                            <h5 className="m-0">Hiring Agenda</h5>
                        </div>
                        <div className='bg-clear px-3 mt-2 rounded-3' style={{ height: '90%', overflowY: 'scroll', paddingTop: '2rem' }}>
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin]}
                                initialView="timeGridWeek"
                                weekends={false}
                                height={'auto'}
                                nowIndicator={true}
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'timeGridWeek,dayGridMonth',
                                }}
                                events={events}
                                slotMinTime="07:00:00"
                                slotMaxTime="19:00:00"
                                dayHeaderFormat={{ weekday: 'long', day: 'numeric' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {loading &&
                <Loading />
            }

        </>
    )
}

export default LayoutAdminCalender