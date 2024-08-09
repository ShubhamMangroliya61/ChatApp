import { Avatar, Box, List, ListItemButton, Typography } from '@mui/material'
import React, { useRef } from 'react'
import LoaderComponent from '../Loader/Loader'
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { Regex } from '../../constatns/Regex';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


const Chat = ({ chatList, loading, selectedChat, handleListItemClick, getData,openModalHandler ,searchHandle ,setpageNumber }) => {
    const scrollContainerRef = useRef(null);

    function convertTo12HourFormat(timestamp) {
        const date = new Date(timestamp);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedTime = hours + ':' + minutes + ' ' + period;
        return formattedTime;
    }

    const handleScroll = (event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.target;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
          if(getData)
            setpageNumber((prev) => prev + 1);
        }
      };

      
    return (
        <>
            <Box className='flex mb-5'>
                <Box className="relative flex-1 ms-4 pt-4">
                    <div className="absolute inset-y-0 left-0 flex items-center ps-3 pt-4 pointer-events-none">
                        <MagnifyingGlass className="text-gray-800" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-2 py-1 rounded-3xl bg-gray-100 focus:outline-none focus:bg-gray-100 border border-spacing-3"
                        placeholder="Search Chat"
                        id="my-search-input"
                        onChange={searchHandle}
                    />
                </Box>
                <Box className='pt-5 ps-4 me-3'>
                    <Plus className='text-2xl' onClick={openModalHandler} />
                </Box>
            </Box>
            <Box className={`flex-col overflow-y-auto h-[81vh] me-3`} onScroll={handleScroll} ref={scrollContainerRef}>
                <List component="nav" aria-label="main mailbox folders">
                    {loading ? (
                        <LoaderComponent isLoader={loading} />
                    ) : (
                        chatList.map((chat, index) => (
                            <ListItemButton
                                key={index}
                                onClick={() => handleListItemClick(chat)}
                            >
                                <Box className={`w-full rounded-md border-s-indigo-600 border-s-8 ${chat.chatId == selectedChat?.chatId ? 'chatitem' : ''}`}
                                    display="flex" alignItems="center" justifyContent="space-between" padding={2}>
                                    <div className='flex'>
                                        <div className="relative">
                                            <Avatar
                                                className="border-2"
                                                alt="Profile Picture"
                                                src={chat.profileName ? `data:image/jpeg;base64,${chat.profileName}` : `data:image/jpeg;base64,${Regex.profile}`}
                                                sx={{ width: 50, height: 50, marginRight: 1, marginLeft: 1 }}
                                            />

                                            <div className='absolute right-1 top-10 transform -translate-y-1/2'>
                                                {chat?.isOnline ?
                                                    <FiberManualRecordIcon style={{ color: 'green', marginRight: '4px', fontSize: '17px', marginBottom: '2px' }} />
                                                    : <FiberManualRecordIcon style={{ color: '#eab308', marginRight: '4px', fontSize: '17px', marginBottom: '2px' }} />}
                                            </div>

                                        </div>

                                        <Typography variant="subtitle1">
                                            <span className='flex flex-col'>
                                                <b>{chat.toUserName}</b>
                                                <span className='truncate w-14'>{chat.lastMessage}</span>
                                            </span>
                                        </Typography>
                                    </div>
                                    <div className=''>
                                        <Typography gutterBottom>
                                            <span className=''>
                                                <span className='text-sm'>{convertTo12HourFormat(chat.createdDate)}</span> <br />
                                                {chat.unread > 0 ? (<span className='bg-indigo-600 text-white rounded-full px-2 py-1'>{chat.unread}</span>) : ""}

                                            </span>
                                        </Typography>
                                    </div>
                                </Box>
                            </ListItemButton>
                        ))
                    )}
                </List>
            </Box>
        </>
    )
}

export default Chat