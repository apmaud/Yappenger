import React, { useContext } from 'react'
import { useState } from 'react'
import { Avatar, Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputLabel, OutlinedInput, Stack, alpha } from '@mui/material'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CloseIcon from '@mui/icons-material/Close';
import { ChatState } from '../../contexts/ChatProvider';
import axios from 'axios';
import { AlertContext } from '../../contexts/AlertProvider';
import ProfileBadge from '../profile/ProfileBadge';
import ProfileItem from '../profile/ProfileItem';

const UpdateGroupDialog = ({ getMessages, refresh, setRefresh}) => {
    // Notification bar
    const { actions } = useContext(AlertContext);
    const alertTypes = ["success", "warning", "info", "error"];
    
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);

        if(!query) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:8000/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch(error) {
            actions.addAlert({
                text: "Failure to load search query",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
            setLoading(false);
        }
    }

    const handleRename = async () => {
        if (!groupName) return;
            
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };
              const { data } = await axios.put(
                `http://localhost:8000/api/chat/rename`,
                {
                  chatId: selectedChat._id,
                  chatName: groupName,
                },
                config
              );
              setSelectedChat(data);
              setRefresh(!refresh);
              setRenameLoading(false);
        } catch(error) {
            actions.addAlert({
                text: "Failure to rename group chat",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
            setRenameLoading(false);
        }
        setGroupName("");
    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            actions.addAlert({
                text: "User already in group",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            actions.addAlert({
                text: "Only admins can add someone",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:8000/api/chat/groupadd`,
                {
                chatId: selectedChat._id,
                userId: user1._id,
                },
                config
            );
        
            setSelectedChat(data);
            setRefresh(!refresh);
            setLoading(false);
        } catch (error) {
            actions.addAlert({
                text: "Failed to add user",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
            setLoading(false);
        }
        setGroupName("");
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            actions.addAlert({
                text: "Only admins can remove users",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `http://localhost:8000/api/chat/groupremove`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
    
          user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
          setRefresh(!refresh);
          getMessages();
          setLoading(false);
        } catch (error) {
            actions.addAlert({
                text: "Failed to remove user",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
          setLoading(false);
        }
        setGroupName("");
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton
            onClick={handleClickOpen}
            >
                <AccountBoxIcon 
                    sx={{ width: "2rem", height: "2rem" }}
                />
            </IconButton>
            
            <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth="sm"
            >
                <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                padding="1rem"
                >
                    <DialogTitle>
                        {selectedChat.chatName}
                    </DialogTitle>
                    <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Stack spacing={2} direction="column" sx={{marginBottom: 4}}> 
                        <Box width="100%" display="flex" flexWrap="wrap" paddingBottom={1}>
                            {selectedChat.users.map((u) => (
                                <ProfileBadge
                                key={u._id}
                                user={u}
                                admin={selectedChat.groupAdmin}
                                handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                            <Box
                            width="100%"
                            display="flex"
                            justifyContent="space-between"
                            >
                                <InputLabel>Group Name</InputLabel>
                                <OutlinedInput
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    sx={{width: "100%"}}
                                />
                                <Button
                                variant="solid"
                                sx={{
                                    backgroundColor: alpha("#05445E", 0.35),
                                    '&:hover': {
                                        backgroundColor: alpha("#05445E", 0.55),},
                                }}
                                onClick={handleRename}
                                >
                                    Update
                                </Button>
                            </Box>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                            <InputLabel>Add Users</InputLabel>
                            <OutlinedInput
                                // value={groupChatName}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                        // <ChatLoading />
                        <div>Loading...</div>
                        ) : (
                        searchResult
                            ?.slice(0, 4)
                            .map((user) => (
                            <ProfileItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                            ))
                        )}
                        <Button
                        variant="solid"
                        sx={{
                            backgroundColor: alpha("#05445E", 0.35),
                            '&:hover': {
                                backgroundColor: alpha("#05445E", 0.55),},
                        }}
                        onClick={() => handleRemove(user)}
                        >
                            Leave Group
                        </Button>
                        </Stack>
                        
                </Box>
            </Dialog>
        </>
    )
}

export default UpdateGroupDialog