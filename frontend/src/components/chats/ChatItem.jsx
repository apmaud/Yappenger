import { Avatar, Box, Button, Typography } from "@mui/material";
import { ChatState } from "../../contexts/ChatProvider"
import { getSender } from "../../config/ChatVerification";


const ChatItem = (params) => {
    

    return (
        <Box
        bgcolor="#75E6DA"
        width="30rem"
        border="1px groove black"
        borderRadius="5px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="1rem"
        padding="1rem"
        margin="1rem"
        >
            <Box>
                <Typography
                fontSize="1rem"
                >
                    {!params.isGroupChat
                        ? getSender(params.currentUser, params.users)
                        : params.chatName}
                </Typography>
                {/* <Typography
                fontSize="1rem"
                >
                    Email : {params.user.email}
                </Typography> */}
            </Box>
        </Box>
    )
}

export default ChatItem