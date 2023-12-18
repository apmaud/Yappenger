import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../contexts/ChatProvider';
import axios from "axios";
import { AlertContext } from '../../contexts/AlertProvider';
import { Box, Button, CircularProgress, FormControl, FormLabel, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

const Register = () => {
  // Page control
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();
  const { setUser } = ChatState();

  // Login form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);


  // Notification bar
  const { actions } = useContext(AlertContext);
  const alertTypes = ["success", "warning", "info", "error"];

  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!name || !email || !password || !confirmPassword) {
      actions.addAlert({
        text: "Please fill in the registration information!",
        title: "Error",
        type: alertTypes[3],
        id: Date.now()
      });
      return;
    }
    if (password !== confirmPassword) {
      actions.addAlert({
        text: "The passwords don't match!",
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
        "http://localhost:8000/api/user",
        { name, email, password, pic, },
        config
      );

      actions.addAlert({
        text: "Successfully registered!",
        title: "Success",
        type: alertTypes[0],
        id: Date.now()
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/chats");

    } catch(error) {
      actions.addAlert({
        text: "Registration failed",
        title: "Error",
        type: alertTypes[3],
        id: Date.now()
      });
      setPicLoading(false);
    };
  };

  const picParser = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      actions.addAlert({
        text: "Please select a profile image.",
        title: "Warning",
        type: alertTypes[1],
        id: Date.now()
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "yappenger");
      data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME)
      fetch(import.meta.env.VITE_CLOUD_API, {
        method: "POST",
        body: data,
        mode: 'cors',
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          setPicLoading(false);
        });
    } else {
      actions.addAlert({
        text: "Please select a profile image.",
        title: "Warning",
        type: alertTypes[1],
        id: Date.now()
      });
      setPicLoading(false);
      return;
    }
  };

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
          <InputLabel>Name</InputLabel>
          <OutlinedInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl> 
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
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
          <InputLabel>Confirm Password</InputLabel>
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        <FormControl id="pic">
          {picLoading && (
            <CircularProgress />
          )}
          <FormLabel>Upload your profile picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => picParser(e.target.files[0])}
          />
        </FormControl>
        <Button onClick={handleSubmit} type="submit" variant="contained" size="large" width="100%">Register</Button>
      </Stack>
    </Box>
  )
}

export default Register