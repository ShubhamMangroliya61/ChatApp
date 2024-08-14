import React, { useEffect, useRef, useState } from 'react';
import { Grid, Box, Modal } from '@mui/material';
import Header from '../../Components/Header/Header';
import './Home.css';
import { GetChatList, GetMessagesList } from '../../redux/slice/ChatSlice';
import connection from '../../helpers/ChatService'
import Chat from '../../Components/Chat/Chat';
import { useDispatch } from 'react-redux';
import Message from '../../Components/Message/Message';
import SearchUser from '../../Components/SearchModal/SearchUser'
import Profile from '../../Components/Profile/Profile';
import { X } from "@phosphor-icons/react";

function Home() {
    const [openModal, setOpenModal] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const dispatch = useDispatch();
    const messagesContainerRef = useRef(null);
    const chatListRef = useRef(null);
    const chatRef = useRef(null);
    const userId = localStorage.getItem("userId");
    const [showPicker, setShowPicker] = useState(false);
    const [ProfileUserId, setProfileUserId] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [getData, setgetData] = useState(true);

    useEffect(() => {
        const startSignalRConnection = async () => {
            try {
                if (connection && connection.state === "Disconnected") {
                    await connection.start().then(()=>{
                        console.log("Connected to SignalR")
                    }).catch((error)=>{
                        console.log(error);
                    });
                } else {
                    console.log("SignalR already connected");
                }
            } catch (err) {
                console.error("SignalR Connection Error: ", err);
            }
        };
        startSignalRConnection();
    }, []);

    const toggleEmojiPicker = () => {
        setShowPicker(prev => !prev);
    };
    useEffect(() => {
        setLoading(true);
        setTimeout(async () => { setLoading(false); }, 2000);
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = {
                    pageNumber,
                    pageSize: 10,
                    searchName: searchValue,
                };

                const response = await dispatch(GetChatList(data));
                if (response.payload) {
                    setChatList((prevChatList) => [...response.payload.data.record, ...prevChatList]);
                }
                if (pageNumber == response.payload.data.requirdPage) {
                    setgetData(false);
                }

            } catch (error) {
                console.error('Error fetching chat list:', error);
            } finally {

            }
        };
        fetchData();
    }, [searchValue, pageNumber])

    const searchHandle = (event) => {
        setChatList([]);
        setSearchValue(event.target.value);
        setPageNumber(1);
    };

    useEffect(() => {
        // Setup event listeners for receiving messages, user connection status, and message read status
        connection.on("ReceiveMessage", handleReceiveMessage);
        connection.on('UserConnected', handleUserConnected);
        connection.on('MarkAsRead', handleMarkAsRead);
        connection.on('CreateChat', handleCreateChat);
        connection.on('UserDisconnected', handleUserDisconnected);
        connection.on('ReactionMessages', handleMessageReaction);

        return () => {
            // Clean up event listeners when component unmounts or dependencies change
            connection.off("ReceiveMessage", handleReceiveMessage);
            connection.off('UserConnected', handleUserConnected);
            connection.off('MarkAsRead', handleMarkAsRead);
            connection.off('CreateChat', handleCreateChat);

        };
    }, [dispatch, selectedChat, userId]);

    useEffect(() => {
        const fetchChatMessages = async () => {
            if (selectedChat) {
                try {
                    const response = await dispatch(GetMessagesList({ chatId: selectedChat.chatId }));
                    if (response.payload) {
                        setMessages(response.payload.data.record);
                        
                    }
                } catch (error) {
                    console.error('Error fetching chat messages:', error);
                } finally {
                }
            } else {
                setMessages([]);
            }
        };

        fetchChatMessages();
    }, [selectedChat]);

    const markMessagesAsRead = async () => {
        if (selectedChat) {
            try {
                const containerId = messagesContainerRef.current?.id;
                if (containerId == selectedChat.chatId) {
                    await connection.invoke("MarkAsReadMessages", selectedChat.toUserId, selectedChat.chatId);

                    setChatList(prevChatList => prevChatList.map(chat =>
                        chat.chatId == selectedChat.chatId
                            ? { ...chat, unread: 0 }
                            : chat
                    ));
                }
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        }
    };

    useEffect(() => {
        markMessagesAsRead();
    }, [selectedChat]);

    const handleListItemClick = (chat) => {
        setSelectedChat(chat);
        setChatList(prevChatList => prevChatList.map(chat1 =>
            chat1.chatId == chat.chatId
                ? { ...chat1, unread: 0 }
                : chat1
        ));
        openChat();
    };

    const handleSendMessage = async (message, replyMessId) => {
        if (!message.trim()) return;
        try {
            let messageDTO = {};
            if (replyMessId != null) {
                messageDTO = await connection.invoke("SendMessageToUser", selectedChat.toUserId, message, selectedChat.chatId, replyMessId);
            }
            else {
                replyMessId = 0;
                messageDTO = await connection.invoke("SendMessageToUser", selectedChat.toUserId, message, selectedChat.chatId, replyMessId);
            }
            setMessages(prevMessages => [...prevMessages, messageDTO]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const SendMessageReaction = async (messageId, reactionId) => {
        try {
            const reactionDTO = await connection.invoke("Sendmessagereaction", selectedChat.toUserId, messageId, reactionId);
            setMessages(prevMessages => {
                return prevMessages.map(message => {
                    if (message.messagesId == reactionDTO.messageId) {
                        if (message.reactionId == reactionId) {
                            return { ...message, reactionId: null };
                        } else {
                            return { ...message, reactionId: reactionDTO.reactionId };
                        }
                    }
                    return message;
                });
            });

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const CreateChat = async (toUserId) => {
        try {
            const chatDTO = await connection.invoke("CreateChat", toUserId);
            setChatList(prevChats => {
                const chatExists = prevChats.some(chat => chat.chatId == chatDTO.chatId);
                if (chatExists) {
                    return prevChats;
                }
                return [...prevChats, chatDTO];
            });
            closeModalHandler();
            const chat = chatList.find(chat => chat.chatId == chatDTO.chatId);
            setSelectedChat(chat);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleReceiveMessage = (responseDTO) => {
        // Check if the message already exists in messages
        const messageExists = messages.some(msg => msg.messageId == responseDTO.messagesId);
        if (!messageExists) {
            setMessages(prevMessages => [...prevMessages, responseDTO]);

            setChatList(prevChatList => prevChatList.map(chat =>
                chat.chatId == responseDTO.chatId ? {
                    ...chat,
                    lastMessage: responseDTO.messageText,
                    unread: (chat.unread || 0) + 1
                } : chat
            ));

            markMessagesAsRead();
        }
    };

    const handleUserDisconnected = (userId) => {
        setChatList(prevChatList => prevChatList.map(chat =>
            chat.toUserId == userId ? {
                ...chat,
                isOnline: false,
            } : chat
        ));
    };

    const handleUserConnected = (userId, messId) => {
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.messageId == messId
                    ? { ...msg, status: 'received' }
                    : msg
            )
        );

        setChatList(prevChatList => prevChatList.map(chat =>
            chat.toUserId == userId ? {
                ...chat,
                isOnline: true,
            } : chat
        ));
    };
    const handleMessageReaction = (reactionDTO) => {
        setMessages(prevMessages => {
            return prevMessages.map(message => {
                if (message.messagesId == reactionDTO.messageId) {
                    if (message.reactionId == reactionDTO.reactionId) {
                        return { ...message, reactionId: null };
                        
                    } else {
                        return { ...message, reactionId: reactionDTO.reactionId };
                    }
                }
                return message;
            });
        });
    };

    const handleCreateChat = (chatDTO) => {
        setChatList(prevChats => [...prevChats, chatDTO]);
    };

    const handleMarkAsRead = (userId, chatId) => {
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.chatId == chatId
                    ? { ...msg, isSeen: true }
                    : msg
            )
        );
    };

    const openChat = () => {
        chatRef.current.style.display = "inline-block";
        if (window.innerWidth < 599) {
            chatListRef.current.style.display = "none"
        }
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 599) {
                chatListRef.current.style.display = "";
                // chatRef.current.style.display = "";
            }
           
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const BackChatList = () => {
        chatRef.current.style.display = "none";
        chatListRef.current.style.display = "inline-block"
    }

    //modal
    const openModalHandler = (open) => {
        setOpenModal(open);
    };
    const closeModalHandler = () => {
        setOpenModal(false);
    };

    const setUserId = (userID) => {
        setProfileUserId(userID);
    };

    const openProfile = (open) => {
        setShowProfile(open);
        if (window.innerWidth < 1200) {
            document.getElementById("mySidenav").style.width = "300px";
        }
    };

    const toggleSlider = () => {
        document.getElementById("mySidenav").style.width = "0";
    };

    return (
        <>
            <Header setUserId={setUserId} showProfile={openProfile} />
            <Grid container>
                <Grid item xs={12} sm={5} md={4} lg={3} xl={3} ref={chatListRef}>
                    <Chat
                        chatList={chatList} loading={loading}
                        selectedChat={selectedChat} handleListItemClick={handleListItemClick}
                        openModalHandler={() => openModalHandler(true)}
                        searchHandle={searchHandle} setpageNumber={setPageNumber} getData={getData}
                    />
                </Grid>
                <Grid item xs={12} sm={7} md={8} lg={6} xl={6} className='hidden sm:inline-block' ref={chatRef}>
                    <Message selectedChat={selectedChat} messages={messages} onSendMessage={handleSendMessage}
                        onToggleEmojiPicker={toggleEmojiPicker} showPicker={showPicker}
                        onBack={BackChatList} messagesContainerRef={messagesContainerRef}
                        ProfileUserId={setUserId} showProfile={openProfile} SendMessageReaction={SendMessageReaction}
                    />
                </Grid>
                <Grid item className='hidden lg:inline-block' lg={3} xl={3}>
                    <Profile ProfileUserId={ProfileUserId} showProfile={showProfile} />
                </Grid>
            </Grid>

            {/* Modal */}
            <Modal
                open={openModal}
                onClose={closeModalHandler}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 330,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        minWidth: "25vw",
                        borderRadius: 2,
                    }}
                >
                    <SearchUser closeModalHandler={closeModalHandler} CreateChat={CreateChat} />
                </Box>
            </Modal>


            <div className="sidenav z-[1000]" id="mySidenav">
                <button className="closebtn" onClick={toggleSlider}>
                    <X />
                </button>
                <Profile ProfileUserId={ProfileUserId} showProfile={showProfile} />
            </div>

        </>
    );
}

export default Home;
