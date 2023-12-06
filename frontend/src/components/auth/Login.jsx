import React, { useContext } from 'react'
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ChatState } from "../../contexts/ChatProvider"
import Notification from "../misc/Notification"
import axios from "axios"
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { AlertContext } from '../../contexts/AlertProvider';

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const { setUser } = ChatState();

  const { actions } = useContext(AlertContext);
  const alertTypes = ["success", "warning", "info", "error"];
  // const selectedType =
  //   alertTypes[Math.floor(Math.random() * alertTypes.length)];

  // const triggerNotification = () => {
  //   actions.addAlert({
  //     text: "Notification text",
  //     title: ` Clicked on ${selectedType}`,
  //     type: selectedType,
  //     id: Date.now()
  //   });
  // };

  const handleSubmit = async () => {
    if (!email || !password) {

      actions.addAlert({
        text: "Please fill in the login information!",
        title: "Error",
        type: alertTypes[3],
        id: Date.now()
      });
      // <Notification
      // type="error"
      // title="Error"
      // message="Please fill in the login information!"
      // />
      console.log("Please fill in the login information!")
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

      // <Notification
      // type="success"
      // title="Success"
      // message="Successfully logged in!"
      // />

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats")

    } catch (error) {
      console.log(error)
      // <Notification
      // type="error"
      // title="Error"
      // message="Login failed!"
      // />
    }
  }

  return (
    <Box
    display="flex"
    flexDirection="column"
    alignItems="left"
    justifyContent="center"
    paddingTop="1rem"
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
                  aria-label="toggle password visibility"
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
          />
        </FormControl>
        <Button onClick={handleSubmit} type="submit" variant="contained" size="large" width="100%">Login</Button>
      </Stack>
      <Notification />
    </Box>
  )
}

export default Login