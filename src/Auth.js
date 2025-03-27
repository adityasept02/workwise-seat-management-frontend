import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:8080";

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      console.log(API_URL + endpoint);

      const { data } = await axios.post(API_URL + endpoint, { username, password });

      if (isLogin) {
        setToken(data.token);
      } else {
        alert("Signup successful! Please log in.");
        setIsLogin(true); // Switch to login page after signup
      }
    } catch (error) {
      console.error("Authentication failed:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Authentication error");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5">{isLogin ? "Login" : "Sign Up"}</Typography>
      <TextField label="Username" fullWidth margin="normal" onChange={(e) => setUsername(e.target.value)} />
      <TextField label="Password" type="password" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleAuth}>
        {isLogin ? "Login" : "Sign Up"}
      </Button>
      <Button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Create Account" : "Back to Login"}
      </Button>
    </Container>
  );
};

export default Auth;
