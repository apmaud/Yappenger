import React, { useContext } from 'react'
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ChatState } from "../../contexts/ChatProvider"
import axios from "axios"
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { AlertContext } from '../../contexts/AlertProvider';

const Login = () => {
  // Page control
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();
  const { setUser, user } = ChatState();

  // Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Notification bar
  const { actions } = useContext(AlertContext);
  const alertTypes = ["success", "warning", "info", "error"];

  
  const handleSubmit = async () => {
    if (!email || !password) {
      actions.addAlert({
        text: "Please fill in the login information!",
        title: "Error",
        type: alertTypes[3],
        id: Date.now()
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      actions.addAlert({
        text: "Successfully logged in!",
        title: "Success",
        type: alertTypes[0],
        id: Date.now()
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats")

    } catch (error) {
      console.log(error)
      actions.addAlert({
        text: "Login failed!",
        title: "Error",
        type: alertTypes[3],
        id: Date.now()
      });
    }
  }

  return (
    <Box
    display="flex"
    flexDirection="column"
    alignItems="left"
    justifyContent="center"
    paddingTop="0"
    >
      <Stack spacing={2} direction="column" sx={{marginBottom: 4}}> 
        <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
          <InputLabel>Email</InputLabel>
          <OutlinedInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={show ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClick}
                  edge="end"
                >
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
              handleSubmit();
              }
          }}
          />
        </FormControl>
        <Button onClick={handleSubmit} type="submit" variant="contained" size="large" width="100%">Login</Button>
      </Stack>
    </Box>
  )
}

export default Login