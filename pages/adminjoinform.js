import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/router";

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  margin: "0 auto",
});
const SignupButton = styled(Button)({
  backgroundColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: "#333",
  },
});
const StyledForm = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

const JoinForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const adminSignupDto = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/admins/signup",
        adminSignupDto
      );
      if (response.status === 200 || response.status == 201) {
        router.push("/welcome");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StyledContainer maxWidth="sm" component="main">
      <Typography variant="h4" component="h1" gutterBottom>
        관리자 회원가입
      </Typography>
      <form onSubmit={handleSubmit}>
        <StyledForm>
          <TextField
            sx={{ width: "500px" }}
            label="이메일"
            type="email"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="암호"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SignupButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
          >
            회원가입
          </SignupButton>
        </StyledForm>
      </form>
    </StyledContainer>
  );
};

export default JoinForm;
