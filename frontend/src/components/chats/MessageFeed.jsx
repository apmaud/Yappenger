import React from 'react'
import { ChatState } from '../../contexts/ChatProvider'
import { Avatar, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatVerification';
import { Box } from '@mui/system';

const MessageFeed = ({ messages }) => {
    const { user } = ChatState();

    // return (
    //         <Box
    //         display="flex"
    //         flexDirection="column"
    //         width="100%"
    //         >
    //             {messages && 
    //             messages.map((m, i) => (
    //                 <Box
    //                 key={m._id}
    //                 display="flex"
    //                 >
    //                     {(isSameSender(messages, m, i, user._id) ||
    //                     isLastMessage(messages, i, user._id)) && (
    //                         <Avatar
    //                         sx={{ height: "2.5rem", width: "2.5rem",}}
    //                         src={m.sender.pic}
    //                         />
    //                     )}
    //                     <Box
    //                     style={{
    //                     backgroundColor: `${
    //                         m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
    //                     }`,
    //                     marginLeft: isSameSenderMargin(messages, m, i, user._id),
    //                     marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
    //                     borderRadius: "20px",
    //                     padding: "5px 15px",
    //                     maxWidth: "75%",
    //                     }}
    //                     >
    //                         <Typography>{m.content}</Typography>
    //                     </Box>
    //                 </Box>
    //             ))}
    //         </Box>
    // )


    return (
        <Box
        over
        >
        <List
        >
            {messages && 
                messages.map((m, i) => (
                <ListItem
                key={m._id}
                alignItems="center"
                sx={{overflow: "hidden", padding: "0", margin: "0", }}
                >
                    {(isSameSender(messages, m, i, user._id) ||
                    isLastMessage(messages, i, user._id)) && (
                        <Avatar
                        sx={{ height: "2.5rem", width: "2.5rem",}}
                        src={m.sender.pic}
                        />
                    )}
                    <Box
                    style={{
                    backgroundColor: `${
                        m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    }}
                    overflow="hidden"
                    >
                        <ListItemText
                        >{m.content}</ListItemText>
                    </Box>
                </ListItem>
            ))}
        </List>
        </Box>
    )
}

export default MessageFeed