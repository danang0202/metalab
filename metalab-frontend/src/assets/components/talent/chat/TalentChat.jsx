import React from 'react'
import { useEffect, useState } from "react";
import { apiURL, formatDateChat, takeHoursAndMinute } from "../../../main.js";
import api from "../../../apiConfig/apiConfig.js";
import Cookies from "js-cookie";
import { useRef } from 'react';


const TalentChat = (props) => {
    const setShowChat = props.setShowChat;
    const showChat = props.showChat;
    const [chat, setChat] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const [goBottom, setGoBottom] = useState(true);
    const msgHistoryRef = useRef(null);
    const [inputFile, setInputFile] = useState();
    const [showImage, setShowImage] = useState();
    const token = Cookies.get('token_metalab');
    useEffect(() => {
        const fetchChat = async () => {
            // setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/chat-by-user`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setChat(response.data.chatData);
                    }
                    setInputFile(null);
                } catch (error) {
                    // setLoading(false);
                    console.error('Error:', error);
                }
            }
        };
        fetchChat();
        let intervalId;

        intervalId = setInterval(() => {
            setGoBottom(false);
            if (showChat) {
                fetchChat();
            }
        }, 3000);
        return () => {
            clearInterval(intervalId);
        };
    }, [])

    const handleSubmitChat = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData();
            if (inputFile) {
                data.append('message', e.target.file.files[0])
                data.append('type', 'file');
            } else {
                data.append('message', e.target.message.value)
                data.append('type', 'text');
            }

            const response = await api.post(`/chat-by-user`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response.status === 201) {
                setChat(response.data.chatData);
                setInputMsg('');
            }
            setGoBottom(true);
            const textarea = document.getElementById('input-msg-area');
            textarea.style.height = 'auto';
        } catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        if (chat && goBottom) {
            if (msgHistoryRef.current) {
                msgHistoryRef.current.scrollTop = msgHistoryRef.current.scrollHeight;
            }
        }

    }, [chat])

    const adjustTextareaHeight = () => {
        const textarea = document.getElementById('input-msg-area');
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    };

    function formatMessage(message) {
        return message.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                {index !== message.length - 1 && <br />} {/* Tambahkan <br /> kecuali di baris terakhir */}
            </React.Fragment>
        ));
    }

    const handleFileChange = (event) => {
        setInputMsg('');
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setInputFile(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-end w-100 h-100 bg-semi-transparent position-fixed align-items-center " style={{ top: '0rem', right: '0rem', zIndex: '10000' }}>
                <div className="col-xl-7 col-lg-6 col-md-6 col-sm-12 col-12 px-5 from-right">
                    <div className="rounded shadow border bg-clear">
                        <div className="d-flex justify-content-between flex-row w-100 align-items-center ps-5 pe-2 py-2 shadow" style={{ background: 'linear-gradient(to right, #7F7FD5, #86A8E7, #91EAE4)' }}>
                            <div className=""><h5 className='mb-0 text-light'>Chat with Admin</h5></div>
                            <div className="bg-clear py-1 px-2 rounded-pill" onClick={() => setShowChat(null)}>
                                <i className="fa-solid fa-x  hover-op6 fw-bold text-danger"></i>
                            </div>

                        </div>
                        <div className="pt-3 pb-1 position-relative p-0" >
                            {showImage && (
                                <div className="smooth-transition d-flex bg-clear flex-column position-absolute w-100" style={{ height: '100%', overflowY: "scroll", zIndex: "10" }}>
                                    <div className="header text-end px-5 py-4">
                                        <div className="btn btn-sm bg-danger rounded-pill text-light hover-op6" onClick={() => {
                                            setShowImage(null);
                                        }}>
                                            <i className="fa-solid fa-x  hover-op6 fw-bold"></i>
                                        </div>

                                    </div>
                                    <div className="box w-100 h-75 d-flex justify-content-center">
                                        <img src={`${apiURL}/storage/chatFiles/${showImage}`} alt=".." style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                    </div>
                                </div>
                            )}
                            <ul className="chat-list px-4" style={{ height: '60vh', overflowY: "scroll" }} ref={msgHistoryRef}>
                                {!chat ? (
                                    <p>Beluma ada pesan</p>
                                ) : (
                                    <>
                                        {chat
                                            .map((item) => (
                                                <li key={item.id} className={`smooth-transition ${item.sender.role == 'admin' ? 'in' : 'out'}`}>
                                                    <div className="chat-img">
                                                        {item.sender.role == 'admin' && (
                                                            <img alt="avatar" src={`${item.sender.avatar ? apiURL + '/storage/avatars/' + item.sender.avatar : '/images/avatar-default.png'}`} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }} />
                                                        )}
                                                    </div>
                                                    <div className="chat-body">
                                                        <div className="">
                                                            {item.type == 'text' ? (
                                                                <p className='chat-message'>{formatMessage(item.message)}</p>
                                                            ) : (
                                                                <>

                                                                    <p className='hover-op6 chat-message-img' onClick={() => setShowImage(item.message)}>
                                                                        <img src={`${apiURL}/storage/chatFiles/${item.message}`} alt=".." style={{ height: '8rem' }} />
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                        <span className="time_date"> {takeHoursAndMinute(item.updated_at)}    |    {formatDateChat(item.updated_at)} {item.sender.role == 'talent' && ' | ' + item.status}</span>.
                                                    </div>
                                                </li>
                                            ))}
                                    </>
                                )}
                            </ul>


                        </div>
                        <div className="type_msg px-4 position-relative">
                            <form onSubmit={handleSubmitChat} className='w-100'>
                                <div className="input-msg my-3 position-relative d-flex align-items-center">
                                    {!inputFile ? (
                                        <textarea
                                            id='input-msg-area'
                                            className="border"
                                            placeholder="Type a message"
                                            name="message"
                                            value={inputMsg}
                                            onChange={(e) => { setInputMsg(e.target.value); adjustTextareaHeight() }}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                padding: '1rem 6rem 0rem 2rem',
                                                borderRadius: '2rem',
                                                background: 'linear-gradient(to right, #91eae42b, #86a8e72b, #7f7fd531)',
                                            }}
                                            required
                                        />
                                    ) : (
                                        <div className="image-container w-100 p-2 ps-3 rounded border" style={{ background: 'linear-gradient(to right, #7f7fd531, #86a8e72b,  #91eae42b)' }}>
                                            <img src={`${inputFile}`} alt="..." style={{ height: '4rem' }} />
                                            <div className="btn btn-sm hover-op6 bg-danger text-light p-0 px-1 ms-3 rounded-pill" onClick={() => setInputFile(null)}>
                                                <i className='fa-solid fa-x'></i>
                                            </div>
                                        </div>
                                    )}

                                    <label htmlFor="file-input" className="btn btn-sm bg-orange file-label position-absolute me-4 hover-op6 rounded-pill text-light" style={{ top: '1rem', right: '2.5rem' }}>
                                        <i className="fa-solid fa-paperclip"></i>
                                    </label>
                                    <input type="file" id="file-input" style={{ display: 'none' }} onChange={(e) => handleFileChange(e)} name='file' />
                                    <button className="position-absolute me-4 hover-op6 rounded-pill bg-blue text-light btn btn-sm" type="submit" style={{ top: '1rem', right: '0rem' }}><i className="fa-solid fa-paper-plane"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TalentChat