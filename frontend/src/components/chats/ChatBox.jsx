import React, { useContext, useEffect, useRef, useState } from 'react'
import BlockBox from "../misc/BlockBox"
import { AlertContext } from '../../contexts/AlertProvider';
import { ChatState } from '../../contexts/ChatProvider';
import axios from 'axios';
import io from "socket.io-client"
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, OutlinedInput, Paper, Typography, alpha } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getSender, getSenderFull } from '../../config/ChatVerification';
import ProfileDialog from '../dialogs/ProfileDialog';
import UpdateGroupDialog from "../dialogs/UpdateGroupDialog"
import MessageFeed from './MessageFeed';

const ENDPOINT = "https://yappenger.onrender.com";
var socket, selectedChatCompare;

const ChatBox = ({ refresh, setRefresh }) => {
  // Notification bar
  const { actions } = useContext(AlertContext);
  const alertTypes = ["success", "warning", "info", "error"];

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const { selectedChat, 
    setSelectedChat, 
    user,
    setUser,
    notification, 
    setNotification } 
  = ChatState();


  const getMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);

    } catch(error) {
      actions.addAlert({
        text: "Failure to load messages",
        title: "Error",
        type: alertTypes[3],
        id: Date.now()
      });
    }

  }

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        actions.addAlert({
          text: "Failure to send message",
          title: "Error",
          type: alertTypes[3],
          id: Date.now()
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    getMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setRefresh(!refresh);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });


  // Auto scroll
  const listRef = useRef();

  useEffect(() => {
    // Scroll to the bottom when the messages change
    if (selectedChat) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <BlockBox
    height="100%"
    width="100%"
    minWidth="60vw"
    minHeight="30rem"
    >
      {selectedChat ? (
        <Box
        paddingTop="0.5rem"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        >
          <Box
          display="flex"
          alignItems="center"
          >
            <IconButton
            onClick={() => setSelectedChat("")}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            {messages && 
              (!selectedChat.isGroupChat ? (
                <>
                  <Box>
                    <Typography
                    fontSize="1.5rem"
                    >
                      {getSender(user, selectedChat.users).name}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }} />
                  <ProfileDialog
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  <Box>
                    <Typography
                    fontSize="1.5rem"
                    >
                      {selectedChat.chatName}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }} />
                  <UpdateGroupDialog
                    getMessages={getMessages}
                    refresh={refresh}
                    setRefresh={setRefresh}
                  />
                </>
              ))
            }
          </Box>

          <Box
          sx={{
            backgroundColor: alpha("#189AB4", 0.25),
          }}
          width="100%"
          height="100%"
          >
            {loading ? (
              <CircularProgress 
              sx={{
                height: "5rem",
                width: "5rem",
                margin: "auto",
                alignSelf: "center",
              }}
              />
            ) : (
              <>
                <Box
                width="100%"
                maxHeight="75vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column-reverse"
                >
                  <FormControl
                  sx={{
                    width: "90%",
                    marginTop: "3rem",
                    marginBottom: "0rem",

                  }}
                  variant="outlined"
                  >
                    <InputLabel>Type a message here</InputLabel>
                    <OutlinedInput
                      label="message"
                      type="text"
                      onKeyDown={sendMessage}
                      value={newMessage}
                      sx={{backgroundColor: alpha("#189AB4", 0.45),}}
                    />
                  </FormControl>
                  <Box
                    width="100%"
                    height="100vh"
                    overflow="auto"
                    backgroundColor={alpha("#189AB4", 0.45)}
                    ref={listRef}
                    >
                      <MessageFeed messages={messages}/>
                  </Box>
                </Box>
                </>
            )}
            
          </Box>
        </Box>
      ) : (
        <Box
        display="flex"
        justifyContent="center"
        paddingTop="3rem"
        >
          <Typography
          fontSize="2rem"
          >
            Click on an existing chat or start a new one!
          </Typography>
        </Box>
      )}
    </BlockBox>
  )
}

export default ChatBox