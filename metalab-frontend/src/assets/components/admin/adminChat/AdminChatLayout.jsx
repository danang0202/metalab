import React from 'react';
import { useEffect } from 'react'
import Cookies from 'js-cookie';
import api from '../../../apiConfig/apiConfig';
import { useState } from 'react';
import { apiURL, formatDateChat, takeHoursAndMinute, truncateText } from '../../../main';
import { useRef } from 'react';
import { asCleanDays } from '@fullcalendar/core/internal';
import Login from '../../Login';

const AdminChatLayout = () => {
    const token = Cookies.get('token_metalab');
    const [chatList, setChatList] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chatData, setChatData] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const msgHistoryRef = useRef(null);
    const [showNewMsg, setShowNewMsg] = useState();
    const [talentList, setTalentList] = useState();
    const [udpateChatList, setUpdateChatList] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [goBottom, setGoBottom] = useState();
    const [inputFile, setInputFile] = useState();
    const [showImage, setShowImage] = useState();

    useEffect(() => {
        const fetchChatList = async () => {
            // setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/chat-list`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setChatList(response.data.chatList);
                    }
                    // setLoading(false);
                } catch (error) {
                    // setLoading(false);
                    console.error('Error:', error);
                }
            }
        };
        fetchChatList();
        const chatListInterval = setInterval(() => {
            fetchChatList();
        }, 3000);

        return () => {
            clearInterval(chatListInterval);
        };
    }, [udpateChatList])

    useEffect(() => {
        const fetchChatData = async () => {
            // setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/chat-data-admin/${selectedChat.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setChatData(response.data.chatData);
                    }
                    // setLoading(false);
                } catch (error) {
                    // setLoading(false);
                    console.error('Error:', error);
                }
            }
        };
        if (selectedChat && selectedChat.id) {
            fetchChatData();
            setGoBottom(true);
        }
        const chatDataInterval = setInterval(() => {
            setGoBottom(false);
            if (selectedChat && selectedChat.id) {
                fetchChatData();
            }
        }, 3000);
        return () => {
            clearInterval(chatDataInterval);
        };
    }, [selectedChat])

    useEffect(() => {
        const fetchTalent = async () => {
            // setLoading(true);
            if (token) {
                try {
                    const response = await api.get(`/new-message/get-talent`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setTalentList(response.data.talents);
                    }
                    // setLoading(false);
                } catch (error) {
                    // setLoading(false);
                    console.error('Error:', error);
                }
            }
        };

        if (showNewMsg) {
            fetchTalent();
        }
    }, [showNewMsg])


    const handleSubmitChat = async (e) => {
        e.preventDefault()
        if (token) {
            try {
                const data = new FormData();
                if (inputFile) {
                    data.append('message', e.target.file.files[0])
                    data.append('type', 'file');
                } else {
                    data.append('message', e.target.message.value)
                    data.append('type', 'text');
                }

                const response = await api.post(`/send-chat-admin/${selectedChat.talent.id}`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });
                if (response.status === 201) {
                    setChatData(response.data.chatData);
                    if (selectedChat.id) {
                        setChatList(prevChatList => {
                            // Temukan indeks elemen yang ingin diubah
                            const index = prevChatList.findIndex(chat => chat.id === selectedChat.id);

                            // Jika elemen ditemukan, pindahkan ke elemen pertama
                            if (index !== -1) {
                                let lastMessage = '';
                                if (inputFile) {
                                    lastMessage = 'file';
                                } else {
                                    lastMessage = e.target.message.value;
                                }
                                const modifiedChat = { ...prevChatList[index], lastMessage: lastMessage, flag: '2' };

                                // Salin array sebelum mengubahnya
                                const updatedList = [...prevChatList];

                                // Hapus elemen dari posisi awal di salinan
                                updatedList.splice(index, 1);

                                // Tempatkan elemen yang diubah di posisi pertama
                                return [modifiedChat, ...updatedList];
                            }
                        });
                        setGoBottom(true);
                        const textarea = document.getElementById('input-msg-area');
                        if (textarea) {
                            textarea.style.height = 'auto';
                        }
                    } else {
                        setUpdateChatList(!udpateChatList);
                    }
                    setInputMsg('');
                    setInputFile(null);
                }

                // setLoading(false);
            } catch (error) {
                // setLoading(false);
                console.error('Error:', error);
            }
        }
    };

    useEffect(() => {
        if (chatData && goBottom) {
            if (msgHistoryRef.current) {
                msgHistoryRef.current.scrollTop = msgHistoryRef.current.scrollHeight;
            }
        }

    }, [chatData])


    const removeGreenCircle = (id) => {
        setChatList(prevChatList => {
            return prevChatList.map(chat => {
                if (chat.id === id) {
                    return { ...chat, flag: 3 };
                } else {
                    return chat;
                }
            });
        });
    }

    useEffect(() => {
        let newMsg = false;
        if (chatList && chatList.length != 0) {
            chatList.map((item) => {
                if (item.flag == '1') {
                    newMsg = true;
                }
            })
            if (!newMsg && sessionStorage.getItem('newMessages')) {
                sessionStorage.removeItem('newMessages');
            }
        }

    }, [chatList])


    const newMessage = (talent) => {
        let selectedChatTemp = {
            'talent': talent,
        }
        setSelectedChat(selectedChatTemp);
        setChatData();
        setShowNewMsg(false);
    }

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
            <div className="w-100 pe-1 bg-clear position-relative">

                {showImage && (
                    <div className="container smooth-transition d-flex w-100 h-100 position-absolute bg-clear flex-column border" style={{ zIndex: "10" }}>
                        <div className="header text-end px-5 py-4">
                            <div className="btn btn-sm hover-op6 bg-danger text-light rounded-pill" onClick={() => setShowImage(null)}>
                                <i className="fa-solid fa-x  hover-op6"></i>
                            </div>
                        </div>
                        <div className="box w-100 h-75 d-flex justify-content-center">
                            <img src={`${apiURL}/storage/chatFiles/${showImage}`} alt=".." style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        </div>


                    </div>
                )}
                <div className="h-100">
                    <div className="inbox_msg h-100 ">
                        <div className="inbox_people bg-light h-100 d-flex flex-column">
                            <div className="headind_srch py-3 px-4 d-flex flex-row">
                                <div className="recent_heading">
                                    <div className="box d-flex flex-row align-items-center gap-3">
                                        <h4 className='mb-0'>Recent</h4>
                                        {!showNewMsg ? (
                                            <div className="btn bg-blue text-light hover-op6 btn-sm" onClick={() => { setShowNewMsg(true); setKeyword('') }} style={{ bottom: '5rem', left: '30rem', zIndex: '2' }}>
                                                <i className="fa-solid fa-plus"></i>
                                            </div>
                                        ) : (
                                            <div className="btn bg-danger text-light hover-op6 btn-sm" onClick={() => { setShowNewMsg(false); setKeyword('') }} style={{ bottom: '5rem', left: '30rem', zIndex: '2' }}>
                                                <i className="fa-solid fa-x"></i>
                                            </div>
                                        )}

                                    </div>
                                </div>
                                <form >
                                    <span className="input-group">
                                        <input
                                            type="text"
                                            className="form-control rounded-0 border-0 rounded-start-3"
                                            placeholder="Search..."
                                            value={keyword} onChange={(e) => setKeyword(e.target.value)}
                                        />
                                        <button className="btn bg-orange rounded-0 rounded-end-3 d-flex align-content-center" type="button">
                                            <i className="material-icons text-white">search</i>
                                        </button>
                                    </span>
                                </form>

                            </div>
                            <div className="inbox_chat position-relative">
                                {!showNewMsg ? (
                                    <>
                                        {chatList && (
                                            chatList
                                                .filter(item => {
                                                    const fullName = `${item.talent.firstName} ${item.talent.lastName}`;
                                                    return fullName.toLowerCase().includes(keyword.toLowerCase());
                                                })
                                                .map((item => (
                                                    <div key={item.id} className={` people-box smooth-transition chat_list ${selectedChat && item.id == selectedChat.id ? 'active_chat' : ''}`} onClick={() => { setSelectedChat(item); removeGreenCircle(item.id) }}>
                                                        <div className="chat_people">
                                                            <div className="chat_img"> <img src={`${item.talent.avatar ? apiURL + '/storage/avatars/' + item.talent.avatar : '/images/avatar-default.png'}`} alt="..." style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover' }} /> </div>
                                                            <div className="chat_ib">
                                                                <h5>{item.talent.firstName} {item.talent.lastName} <span className="chat_date">{formatDateChat(item.updated_at)} {item.flag == '1' && (<i className="fa-solid fa-circle text-green"></i>)}</span></h5>
                                                                <p>{item.flagSender == '2' ? 'Anda: ' : ''}{truncateText(item.lastMessage, 80)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )))
                                        )}
                                    </>
                                ) : (
                                    <div className="smooth-transition pop-up-talent-list bg-clear d-flex justify-content-center align-items-center w-100 h-100" style={{ left: '0rem', top: '0rem' }}>
                                        <div className="w-100 d-flex flex-column align-items-center h-100">
                                            <div className="list-container d-flex flex-column bg-clear h-100 w-100">
                                                <div className="header">
                                                    <h5 className='text-center my-4'>New Messages</h5>
                                                </div>
                                                {talentList && talentList
                                                    .filter(item => {
                                                        const fullName = `${item.firstName} ${item.lastName}`;
                                                        return fullName.toLowerCase().includes(keyword.toLowerCase());
                                                    })
                                                    .map((item) => (
                                                        <div key={item.id} onClick={() => newMessage(item)} className="people-box bg-clear p-2 border list-item d-flex flex-row align-items-center gap-2">
                                                            <div className="chat_people">
                                                                <div className="info d-flex flex-row gap-2 align-items-center">
                                                                    <img src={`${item.avatar ? apiURL + '/storage/avatars/' + item.avatar : '/images/avatar-default.png'}`} alt="..." style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover' }} />
                                                                    <div className="chat_ib">
                                                                        <h6 className='mb-0'>{item.firstName} {item.lastName}</h6>
                                                                        <span className={`badge rounded-pill ${item.status == 'Enable' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{item.status}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mesgs">
                            {selectedChat && (
                                <div className="p-3 people-box bg-light pt-3 pb-2 list-item d-flex flex-row align-items-center gap-2" style={{ borderBottom: '1px solid #c4c4c4', background: 'linear-gradient(to right, #7f7fd531, #86a8e72b,  #91eae42b)' }}>
                                    <div className="chat_people">
                                        <div className="info d-flex flex-row gap-2 align-items-center">
                                            <img src={`${selectedChat.talent.avatar ? apiURL + '/storage/avatars/' + selectedChat.talent.avatar : '/images/avatar-default.png'}`} alt="..." style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover' }} />
                                            <div className="chat_ib">
                                                <h6 className='mb-0'>{selectedChat.talent.firstName} {selectedChat.talent.lastName}</h6>
                                                <span className={`badge rounded-pill ${selectedChat.talent.status == 'Enable' ? 'bg-green-t text-green' : 'bg-danger-t text-danger'}`}>{selectedChat.talent.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <ul className="chat-list px-3" ref={msgHistoryRef}>
                                {chatData && chatData.length == 0 ? (
                                    <div className="container h-100 d-flex align-items-center justify-content-center">
                                        <div className="d-flex flex-column align-items-center p-2">
                                            <img src="/images/empty-icon.png" alt="" style={{ width: '8rem' }} />
                                            <h5 className='text-secondary my-3'>Start a chat !</h5>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {chatData && chatData
                                            .map((item) => (
                                                <li key={item.id} className={`smooth-transition pt-3 ${item.sender.role == 'talent' ? 'in' : 'out'}`}>
                                                    <div className="chat-img">
                                                        {item.sender.role == 'talent' && (
                                                            <img alt="avatar" src={`${selectedChat.talent.avatar ? apiURL + '/storage/avatars/' + selectedChat.talent.avatar : '/images/avatar-default.png'}`} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }} loading="lazy" />
                                                        )}

                                                    </div>
                                                    <div className="chat-body">
                                                        <div className="">
                                                            {item.type == 'text' ? (
                                                                <p className='chat-message'>{formatMessage(item.message)}</p>
                                                            ) : (
                                                                <>

                                                                    <span className='hover-op6 chat-message-img' onClick={() => setShowImage(item.message)}>
                                                                        <img src={`${apiURL}/storage/chatFiles/${item.message}`} alt=".." style={{ height: '8rem' }} loading="lazy" />
                                                                    </span>
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
                            <div className="type_msg mx-4">
                                <form onSubmit={handleSubmitChat} className='w-100'>
                                    <div className="input-msg position-relative d-flex align-items-center">
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
                                                    <i className='fa-solid fa-x bg-dange'></i>
                                                </div>
                                            </div>
                                        )}

                                        <label htmlFor="file-input" className="btn btn-sm bg-orange text-light file-label position-absolute me-4 hover-op6 rounded-pill text-lightl" style={{ top: '1rem', right: '2.5rem' }}>
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
            </div>
        </>
    )
}

export default AdminChatLayout