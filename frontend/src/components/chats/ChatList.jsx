import React, { useContext, useEffect } from 'react'
import BlockBox from "../misc/BlockBox"
import { useState } from 'react';
import { ChatState } from '../../contexts/ChatProvider';
import { AlertContext } from '../../contexts/AlertProvider';
import axios from 'axios';
import { Avatar, Box, Button, CircularProgress, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography, alpha } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { getSender } from '../../config/ChatVerification';
import ChatItem from './ChatItem';
import GroupDialog from '../dialogs/GroupDialog';
import { useNavigate } from 'react-router-dom';

const ChatList = ({refresh, setRefresh}) => {
  // Notification bar
  const { actions } = useContext(AlertContext);
  const alertTypes = ["success", "warning", "info", "error"];

  const navigate = useNavigate();

  // List
  const [currentUser, setCurrentUser] = useState();

  const { 
    selectedChat, 
    setSelectedChat, 
    user,
    setUser,
    chats, 
    setChats
  } = ChatState();

  function generate(element) {
    return chats.map((chat) =>
      React.cloneElement(element, {
        key: chat._id,
        primary: `${!chat.isGroupChat ? getSender(currentUser, chat.users).name : chat.chatName}`,
        secondary: "hello"
      }),
    );
  }

 

  const getChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:8000/api/chat", 
        config
      );
      setChats(data);
    } catch (error) {
      actions.addAlert({
        text: "Failure to get chat list",
        title: "Error",
        type: alertTypes[3],
        id: Date.now()
      });
    }
  }

  const [selectedId, setSelectedId] = useState(0);

  const handleListItemClick = (event, chat) => {
    setSelectedId(chat._id);
    setSelectedChat(chat)
  };

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("userInfo")));
    getChats();
    // eslint-disable-next-line
  }, [refresh])

  useEffect(() => {
    if (!user) {
      try {
        setUser(JSON.parse(localStorage.getItem("userInfo")))
        setCurrentUser(JSON.parse(localStorage.getItem("userInfo")))
        setRefresh(!refresh)
      } catch (e) {
        navigate("/")
      }
    }
    // eslint-disable-next-line
  }, [user]);


  return (
    <BlockBox
    height="100%"
    width="30%"
    minWidth="20rem"
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="flex-start"
    >
      <Box
      margin="1rem"
      width="90%"
      display="flex"
      >
        <Typography variant='h6'>My Chats</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <GroupDialog />
      </Box>
      {chats ? (
        <Box
        height="100%"
        width="90%"
        display="flex"
        flexDirection="column"
        alignItems="start"
        justifyContent="flex-start"
        >
          <Box
          width="100%"
          height="95%"
          backgroundColor={alpha("#75E6DA", 0.1)}
          // backgroundColor="#f6eee3"
          overflow="auto"
          >
            <List
            >
              {chats.map((chat) => (
                <ListItemButton
                selected={selectedId === chat._id}
                onClick={(event) => handleListItemClick(event, chat)}
                key={chat._id}
                sx={{ cursor: "pointer", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "flex-start", 
                marginBottom: "1rem",
                backgroundColor: alpha("#75E6DA", 0.25),
                border: "1px black outset",
                '&:hover': {
                  backgroundColor: alpha("#75E6DA", 0.85),},
                selectedItemStyle: "red",
                "&.Mui-selected": {
                  backgroundColor: alpha("#75E6DA", 1),
                },
                
                }}
                
                >

                    <ListItemText
                    primaryTypographyProps={{fontSize: '1rem'}} 
                    primary={!chat.isGroupChat ? getSender(currentUser, chat.users).name : chat.chatName}
                    />
                    {chat.latestMessage && (
                      <ListItemText
                      primaryTypographyProps={{fontSize: '0.75rem'}} 
                      primary={`${chat.latestMessage.sender.name}: 
                        ${chat.latestMessage.content.length > 50 
                          ? chat.latestMessage.content.substring(0,51) + "..." 
                          : chat.latestMessage.content
                        }`
                      }
                      />
                    )}

                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>
      ) : (
        <CircularProgress
        sx={{
          height: "5rem",
          width: "5rem",
          margin: "auto",
          alignSelf: "center",
        }}
        />
      )}
    </BlockBox>
  )
}

export default ChatList