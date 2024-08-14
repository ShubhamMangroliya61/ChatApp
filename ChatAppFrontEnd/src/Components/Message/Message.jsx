import React, { useEffect, useRef, useState } from 'react'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { CaretLeft, PaperPlaneRight } from "@phosphor-icons/react";
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { Regex } from '../../constatns/Regex';
import EmojiPicker from 'emoji-picker-react';
import Chat from '../../assets/LoginImg.jpg'
import moment from 'moment';
import CopyToClipboard from 'react-copy-to-clipboard'
import  { emojiMap } from '../../constatns/Emoji'

const Message = ({ selectedChat, messages, onSendMessage,SendMessageReaction, onBack, messagesContainerRef, onToggleEmojiPicker, showPicker, showProfile, ProfileUserId }) => {
    const [message, setMessage] = useState('');
    const [replyMessage, setReplyMessage] = useState({});
    const messagesEndRef = useRef(null);
    const menuRef = useRef(null);
    const emojiRef = useRef(null);
    const userId = localStorage.getItem("userId");
    const [event, setEvent] = useState();
    const [anchorEl, setAnchorEl] = useState(false);
    const [openReplyBox, setOpenReplyBox] = useState(false);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            onSendMessage(message, replyMessage.messagesId);
            setMessage('');
            setOpenReplyBox(false);
            setReplyMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };
    const onEmojiClick = (event, emojiObject) => {
        setMessage(prevMessage => (prevMessage ? prevMessage + event.emoji : event.emoji));
    };

    const handleReplyClick = (message) => {
        setOpenReplyBox(true);
        setAnchorEl(null);
    };

    const screenWidth = window.innerWidth;

    const renderBackButton = screenWidth < 599 && (
        <IconButton style={{ marginRight: '5px' }} onClick={onBack} className='inline-block md:hidden'>
            <CaretLeft />
        </IconButton>
    );

    const clearTempMessage = () => {
        setOpenReplyBox(false);
        setReplyMessage({});
    }

    const handleClick = (e, msg) => {
        setEvent(e);

        setAnchorEl(prevAnchorEl => {
            const newAnchorEl = !prevAnchorEl;
            if (newAnchorEl) {
                setReplyMessage(msg);

            } else {
                setReplyMessage(msg);

            }
            return newAnchorEl;
        });
    };
    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setAnchorEl(false);
            setReplyMessage("");
        }
    
        
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutsideemoji = (e) => {
        if (emojiRef.current && !emojiRef.current.contains(e.target)) {
            onToggleEmojiPicker();
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideemoji);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideemoji);
        };
    }, []);

    const closeModal = () => {
        setAnchorEl(false);
        setReplyMessage("");
    }

    return (
        selectedChat ? (
            <Box className="mt-4 bg-violet-50 border-spacing-2 border rounded-xl">
                <Box style={{ display: 'flex', alignItems: 'center', }} className="border-b-2 px-3 p-1" >
                    {renderBackButton}
                    <Box style={{ display: 'flex', alignItems: 'center', }} onClick={() => { showProfile(true); ProfileUserId(selectedChat.toUserId); }}>
                        <Avatar src={selectedChat.profileName ? `data:image/jpeg;base64,${selectedChat.profileName}` : `data:image/jpeg;base64,${Regex.profile}`} />
                        <Typography gutterBottom style={{ marginLeft: '10px', paddingTop: '5px' }}>
                            <span className='flex flex-col'>
                                <b>{selectedChat.toUserName}</b>
                                <span className="flex items-center">
                                    {selectedChat?.isOnline && (
                                        <FiberManualRecordIcon style={{ color: 'green', marginRight: '4px', fontSize: '13px', marginBottom: '2px' }} />
                                    )}
                                    {selectedChat?.isOnline ? "Online" : "Offline"}
                                </span>
                            </span>
                        </Typography>
                    </Box>
                </Box>
                <Box
                    ref={messagesContainerRef}
                    id={selectedChat?.chatId}
                    className={`flex-col relative overflow-y-auto ${showPicker && openReplyBox ? 'h-[20vh]' :
                        showPicker ? 'h-[33vh]' :
                            openReplyBox ? 'h-[60vh]' :
                                'h-[73vh]'
                        }`}
                >
                    {messages.map((msg, index) => (
                        msg.chatId == selectedChat?.chatId && (
                            <React.Fragment key={index}>
                                {(index === 0 || moment(msg.createdDate).format('MMMM D, YYYY') !== moment(messages[index - 1].createdDate).format('MMMM D, YYYY')) && (
                                    <div className="flex items-center gap-2 p-3">
                                        <Divider className="flex-grow" />
                                        <Typography variant="subtitle2" className="text-gray-500">
                                            {moment(msg.createdDate).format('MMMM D, YYYY') === moment(new Date()).format('MMMM D, YYYY')
                                                ? "Today"
                                                : moment(msg.createdDate).format('MMMM D, YYYY')}
                                        </Typography>
                                        <Divider className="flex-grow" />
                                    </div>
                                )}
                                <div className="relative pt-2 pb-2">
                                    <MessageBox
                                        {...(msg.replyOfMessageId && {
                                            reply: {
                                                title: msg.title,
                                                titleColor: '#4f46e5',
                                                message: msg.replyOfMessageText
                                            }
                                        })}
                                        key={index}
                                        position={msg.fromUserId == userId ? 'right' : 'left'}
                                        titleColor="#7e22ce"
                                        type='text'
                                        text={msg.messageText}
                                        date={new Date(msg.createdDate)}
                                        replyButton={msg.fromUserId != userId}
                                        status={msg.fromUserId == userId
                                            ? (msg.isDeliverd && msg.isSeen ? 'read' :
                                                msg.isDeliverd && !msg.isSeen ? 'received' :
                                                    'sent')
                                            : ""}
                                        dateString={new Date(msg.createdDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                        onReplyClick={(e) => handleClick(e, msg)}
                                    />
                                    { msg.reactionId != null && msg.fromUserId != userId ? (
                                        <Box
                                        className={`bg-purple-200 z-[10] ps-2 pe-2 w-fit rounded-2xl absolute  left-7 bottom-[-0.5rem]`}>
                                            {emojiMap[msg.reactionId]}
                                        </Box>) : (
                                            <Box
                                        className={`bg-violet-200 z-[10] ps-2 pe-2 w-fit rounded-2xl absolute  right-7 bottom-[-0.5rem]`}>
                                            {emojiMap[msg.reactionId]}
                                        </Box>) 

                                        }

                                    {anchorEl && msg.messagesId == replyMessage.messagesId && (
                                        <Box ref={menuRef}
                                            className="bg-violet-300 fixed rounded-lg p-2 text-center gap-2 flex flex-col items-center z-[1000] w-fit"
                                            style={{ left: `${event.clientX - 10}px`, top: `${event.clientY + 20}px` }}
                                        >
                                            <div className="flex gap-2 mb-1">
                                                <span className="text-yellow-500" onClick={()=> {SendMessageReaction(msg.messagesId,1); closeModal();} }>😊</span>
                                                <span className="text-red-500" onClick={()=> {SendMessageReaction(msg.messagesId,2); closeModal(); }}>😍</span>
                                                <span className="text-blue-500" onClick={()=>{SendMessageReaction(msg.messagesId,3); closeModal();}}>😂</span>
                                                <span className="text-green-500" onClick={()=>{SendMessageReaction(msg.messagesId,4); closeModal();}}>👍</span>
                                            </div>
                                            <button
                                                className="flex items-center gap-2 mb-2 p-1  text-black rounded hover:bg-violet-200"
                                                onClick={() => handleReplyClick(msg)}
                                            >
                                                <ReplyIcon className="text-xl" />
                                                <span >Reply</span>
                                            </button>
                                            <CopyToClipboard text={replyMessage.messageText}>
                                                <button className="flex items-center hover:bg-violet-200 p-1"
                                                    onClick={() => closeModal()}>
                                                    <ContentCopyIcon className="text-lg me-1 " />
                                                    <span>Copy</span>
                                                </button>
                                            </CopyToClipboard>

                                        </Box>
                                    )}
                                </div>
                            </React.Fragment>
                        )
                    ))}
                    <div ref={messagesEndRef} />
                </Box>
                <Box>
                    {showPicker && (
                        <Box ref={emojiRef}>
                        <EmojiPicker
                            searchDisabled={true}
                            onEmojiClick={onEmojiClick}
                            emojiStyle='Apple'
                            style={{
                                width: "100%",
                                height: "40vh"
                            }}
                        />
                        </Box>
                    )}
                    {openReplyBox &&
                        <Box className="border rounded-lg border-s-4 border-s-indigo-600 p-4 pt-0 ms-2 me-2 h-[13vh]">
                            <Box className="flex w-full justify-between items-center">
                                <ReplyIcon className="text-gray-500 text-xl" />
                                <IconButton
                                    onClick={clearTempMessage}
                                    className="flex items-center py-2 px-2 rounded-full justify-center"
                                >
                                    <CloseIcon className="text-gray-500 text-xl" />
                                </IconButton>
                            </Box>
                            <Typography>
                                <b className='text-indigo-600'>{selectedChat.toUserName}</b>
                            </Typography>
                            <Typography variant="body1" className="mt-2">
                                {replyMessage.messageText}
                            </Typography>
                        </Box>}
                    <Box className="relative flex items-center p-2">
                        <input
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            type="text" placeholder="Type your message..."
                            className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                            onKeyPress={handleKeyPress}
                        />
                        <Box className="absolute right-5 top-1/2 transform -translate-y-1/2 flex space-x-2">
                            <button onClick={() => onToggleEmojiPicker()} className="flex items-center justify-center rounded-full">
                                <InsertEmoticonIcon />
                            </button>
                            <button onClick={handleSendMessage} className="flex items-center justify-center bg-indigo-500 text-white rounded-full p-3 hover:bg-blue-400 cursor-pointer">
                                <PaperPlaneRight />
                            </button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        ) : (
            <Box className="mt-4 bg-gray-50 border-spacing-2 border rounded-xl h-[90vh] flex flex-col">
                <img src={Chat} alt="Logo" className="w-100 mb-5" />
                <Typography variant="h6" className='text-center text-indigo-500'>Select a chat to view details</Typography>
            </Box>
        )
    )
}
export default Message