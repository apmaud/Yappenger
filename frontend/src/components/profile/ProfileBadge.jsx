import { Avatar, Badge, Box, Button, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


const ProfileBadge = ({ user, handleFunction, admin}) => {

    return (
        <Box
        sx={{
            padding: 1,
            borderRadius: 5,
            margin: 1,
            marginBottom: 1,
            fontSize: 12,
            cursor: "pointer",
            backgroundColor: "#75E6DA",
        }}
        variant="solid"
        >
            {user.name}
            {admin === user._id && <span> (Admin) </span>}
            <IconButton
            onClick={handleFunction}
            >
                <CloseIcon />
            </IconButton>
        </Box>
    )
}

export default ProfileBadge