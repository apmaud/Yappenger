import React, { useContext, useState } from 'react'
import { ChatState } from '../../contexts/ChatProvider';
import axios from 'axios';
import { AlertContext } from '../../contexts/AlertProvider';
import { Box, Button, Dialog, DialogTitle, FormControl, IconButton, InputLabel, OutlinedInput, Stack, alpha } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProfileBadge from '../profile/ProfileBadge';
import ProfileItem from '../profile/ProfileItem';

const GroupDialog = () => {
    // Notification bar
    const { actions } = useContext(AlertContext);
    const alertTypes = ["success", "warning", "info", "error"];

    const { user, chats, setChats } = ChatState();

    const [open, setOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            actions.addAlert({
                text: "User already in group",
                title: "Error",
                type: alertTypes[1],
                id: Date.now()
            });
            return;
        }
    
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
          return;
        }
    
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
        } catch (error) {
            actions.addAlert({
                text: "Failed to load query",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
        }
      };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            actions.addAlert({
                text: "Fill in all fields!",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
          return;
        }
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(
            `http://localhost:8000/api/chat/group`,
            {
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
            config
          );
          setChats([data, ...chats]);
          handleClose();
          actions.addAlert({
            text: "New group chat created!",
            title: "Error",
            type: alertTypes[0],
            id: Date.now()
        });
        } catch (error) {
            actions.addAlert({
                text: "Failed to create group chat",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
            onClick={handleClickOpen}
            variant="filled"
            sx={{
                backgroundColor: alpha("#05445E", 0.35),
                '&:hover': {
                    backgroundColor: alpha("#05445E", 0.55),},
            }}
            >
                New Group Chat
            </Button>

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
                        Create Group Chat
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
                        <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                            <InputLabel>Group Name</InputLabel>
                            <OutlinedInput
                                type="text"
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                            <InputLabel>Add Users</InputLabel>
                            <OutlinedInput
                                // value={groupChatName}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box
                        width="100%"
                        display="flex"
                        flexWrap="wrap"
                        >
                            {selectedUsers.map((u) => (
                                <ProfileBadge
                                key={u._id}
                                user={u}
                                handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
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
                                handleFunction={() => handleGroup(user)}
                            />
                            ))
                        )}
                        <Button
                        sx={{
                            backgroundColor: alpha("#05445E", 0.35),
                            '&:hover': {
                                backgroundColor: alpha("#05445E", 0.55),},
                            color: "black"
                        }}
                        
                        >
                            Create Chat
                        </Button>
                    </Stack>
                </Box>
            </Dialog>
        </>
    )
}

export default GroupDialog