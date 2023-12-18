import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import PendingIcon from '@mui/icons-material/Pending';
import { useState } from 'react';
import { Avatar, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import ProfileItem from '../profile/ProfileItem';
import { useContext } from 'react';
import { AlertContext } from '../../contexts/AlertProvider';
import axios from 'axios';
import { ChatState } from '../../contexts/ChatProvider';
import { useNavigate } from 'react-router-dom';
import { getSender } from '../../config/ChatVerification';
import ProfileDialog from '../dialogs/ProfileDialog';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha("#75E6DA", 0.45),
    '&:hover': {
        backgroundColor: alpha("#75E6DA", 0.75),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: "black",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
        width: '20ch',
        },
    },
}));

export default function PrimarySearchAppBar() {
    // Notification bar
    const { actions } = useContext(AlertContext);
    const alertTypes = ["success", "warning", "info", "error"];
    
    // Search
    const { 
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        } = ChatState();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const submitSearch = async () => {
        if (!search) {
            actions.addAlert({
                text: "Please enter a search query",
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
        
            const { data } = await axios.get(
                `http://localhost:8000/api/user?search=${search}`, 
                config
            );
            
            setLoading(false);
            setSearchResult(data);
            console.log(data);
        } catch (error) {
            actions.addAlert({
                text: "Failure to fetch search results",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
        }
    };

    const accessChat = async (userId) => {
        try {
            const config = {
                headers: {
                  "Content-type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `http://localhost:8000/api/chat`, 
                { userId }, 
                config
            );
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            handleClose();
        } catch(error) {
            actions.addAlert({
                text: "Failure to fetch the chat",
                title: "Error",
                type: alertTypes[3],
                id: Date.now()
            });
        }
    }


    





    // App Bar
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isMenuOpen2 = Boolean(anchorEl2);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const navigate = useNavigate();

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationsMenuOpen = (event) => {
        setAnchorEl2(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleNotificationsMenuClose = () => {
        setAnchorEl2(null);
        // handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        setUser(null);
        setChats([]);
        setSelectedChat(null);
        actions.addAlert({
            text: "Logged out successfully!",
            title: "Success",
            type: alertTypes[0],
            id: Date.now()
        });
        navigate("/");
        
    };

    const notificationsMenuId = 'primary-search-notifications-menu';
    const renderNotificationsMenu = (
        <Menu
        anchorEl={anchorEl2}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        id={notificationsMenuId}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isMenuOpen2}
        onClose={handleNotificationsMenuClose}
        
        >
        <Box
        padding="0.5rem"
        >{!notification.length && "No New Messages"}
        {notification.map((notif) => (
            <MenuItem
            key={notif._id}
            onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
            }}
            sx={{gap: "0.5rem"}}
            >
                <MailIcon />
                {notif.chat.isGroupChat
                    ? `${notif.chat.chatName}: New Message`
                    : `${getSender(user, notif.chat.users).name}: New Message`
                }
            </MenuItem>
        ))}
        </Box>
        </Menu>
    );

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        >
        <ProfileDialog
            user={user}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        </ProfileDialog>
        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        >
        <MenuItem>
            <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
            >
            <Badge badgeContent={notification.length} color="error">
                <NotificationsIcon />
            </Badge>
            </IconButton>
            <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            >
            <AccountCircle />
            </IconButton>
            <p>Profile</p>
        </MenuItem>
        </Menu>
    );

    return (
        <Box 
        // sx={{ flexGrow: 1 }}
        width="100%"
        minWidth="60rem"
        >
        <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
        >
            <DialogTitle id="alert-dialog-title">
                Search for a user
            </DialogTitle>
            <DialogContent
            >
                <Box
                width="100%"
                minHeight="15rem"
                display="flex"
                marginBottom="1rem"
                flexDirection="column"
                justifyContent="start"
                alignItems="center"
                >
                    <Search
                    >
                        <SearchIconWrapper>
                            <SearchIcon
                            sx={{ color: "black" }}
                            />
                        </SearchIconWrapper>
                        <StyledInputBase
                        placeholder="Enter a name or email"
                        inputProps={{ 'aria-label': 'search' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                            submitSearch();
                            }
                        }}
                        >
                        </StyledInputBase>
                    </Search>
                    {loading ? (
                        <PendingIcon size="lg"/>
                    ) : (
                        searchResult?.map((user) => (
                            <ProfileItem
                                key={user._id}
                                user={user}
                                handleFunction={() => accessChat(user._id)}
                            />
                        ))
                    )}
                    
                </Box>
            </DialogContent>
        </Dialog>
        <AppBar position="static" style={{ background: "#D4F1F4" }}>
            <Toolbar>
                    <Button
                        sx={{
                            backgroundColor: alpha("#75E6DA", 0.45),
                            '&:hover': {
                                backgroundColor: alpha("#75E6DA", 0.75),
                            },
                            mr: 2,
                        }}
                        onClick={(e) => {
                            setOpen(true);
                        }} 
                    >
                        <SearchIcon 
                        sx={{ color: "black" }}
                        />
                        <Typography
                        color="grey"
                        >
                            Search for a user
                        </Typography>
                    </Button>
                <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
                color="black"
                >
                Yappenger
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex', gap: ".5rem" } }}>
                    {/* <IconButton size="large" aria-label="show 4 new mails">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                    </IconButton> */}
                    <IconButton
                    size="large"
                    edge="end"
                    aria-label="show 17 new notifications"
                    aria-controls={notificationsMenuId}
                    aria-haspopup="true"
                    onClick={handleNotificationsMenuOpen}
                    >
                    <Badge badgeContent={notification.length} color="error">
                        <NotificationsIcon sx={{fontSize: "2rem"}}/>
                    </Badge>
                    </IconButton>
                    <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    >
                        <Avatar src={user.pic}/>
                    </IconButton>
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                    >
                    <MoreIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderNotificationsMenu}
        {renderMenu}
        </Box>
    );
}