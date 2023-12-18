import { Avatar, Box, Button, Typography } from "@mui/material";
import { ChatState } from "../../contexts/ChatProvider"


const ProfileItem = ({ handleFunction, user }) => {
    // const { user } = ChatState();

    return (
        <Box
        onClick={handleFunction}
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
        sx={{cursor: "pointer"}}
        >
            <Avatar 
                sx={{ height: "3rem", width: "3rem",}}
                src={user.pic}
            />
            <Box>
                <Typography
                fontSize="1rem"
                >
                    {user.name}
                </Typography>
                <Typography
                fontSize="1rem"
                >
                    Email : {user.email}
                </Typography>
            </Box>
            {/* <Button
            sx={{color: "#05445E",}}
            onClick={handleFunction}
            >
                Add
            </Button> */}
        </Box>
    )
}

export default ProfileItem