import React from 'react'
import { Box, Tab, Tabs, Typography } from "@mui/material"
import BlockBox from '../components/misc/BlockBox'
import { useState } from 'react';
import Login from "../components/auth/Login"
import Register from "../components/auth/Register"

const LandingPage = () => {
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
 
    const handleTabChange = (e, tabIndex) => {
      setCurrentTabIndex(tabIndex);
    };
    
    return (
        <Box
        width="100%" 
        height="100%" 
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        gap="2rem"
        paddingTop="1rem"
        >
            <BlockBox
            minHeight="100px"
            minWidth="450px"
            maxWidth="550px"
            maxHeight="5rem"
            width="65%"
            height="65%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            >
                <Typography fontSize="36px">Yappenger</Typography>
            </BlockBox>
            <BlockBox
            // minHeight="500px"
            // maxHeight="600px"
            // minWidth="450px"
            // maxWidth="550px"
            // width="65%" 
            // height="65%"
            padding="4rem"
            display="flex"
            gap="1rem"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}
                width="100%"
                >
                    <Tabs 
                    value={currentTabIndex} 
                    onChange={handleTabChange}
                    variant="fullWidth"
                    >
                        <Tab label="Sign In" />
                        <Tab label="Register" />
                    </Tabs>
                </Box>
                <Box
                minHeight="200px"
                minWidth="400px"
                // maxWidth="500px"
                // maxHeight="300px"
                width="90%"
                height="65%"
                >
                    {currentTabIndex === 0 && (
                        <Login />
                    )}
                    {currentTabIndex === 1 && (
                        <Register />
                    )}
                </Box>

            </BlockBox>
        </Box>
    )
}

export default LandingPage