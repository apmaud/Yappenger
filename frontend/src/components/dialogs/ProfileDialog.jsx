import React from 'react'
import { useState } from 'react'
import { Avatar, Box, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CloseIcon from '@mui/icons-material/Close';

const ProfileDialog = ({ user, children}) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {children ? (
                <span onClick={handleClickOpen}>{children}</span>
            ) : (
                <IconButton
                onClick={handleClickOpen}
                >
                    <AccountBoxIcon 
                      sx={{ width: "2rem", height: "2rem" }}
                    />
                </IconButton>
            )}
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
                        {user.name}
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
                    <DialogContent>
                        <Avatar
                        alt={user.name}
                        src={user.pic}
                        sx={{ width: "6rem", height: "6rem" }}
                        />
                    </DialogContent>
                    <DialogContentText>Email: {user.email}</DialogContentText>
                </Box>
            </Dialog>
        </>
    )
}

export default ProfileDialog