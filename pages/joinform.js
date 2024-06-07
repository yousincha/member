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
import axios from "axios";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  height: 100%;
  margin: 0 auto;
`;

const StyledForm = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const JoinForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const [birthYear, birthMonth, birthDay] = birthDate.split("-");
    const memberSignupDto = {
      email,
      password,
      name,
      birthYear,
      birthMonth,
      birthDay,
      gender,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/members/signup",
        memberSignupDto
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
        회원가입
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          label="회원이름"
          type="text"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
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
        <TextField
          label="생년월일"
          type="date"
          variant="outlined"
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          required
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        <FormControl fullWidth variant="outlined" margin="normal" required>
          <InputLabel>성별</InputLabel>
          <Select value={gender} onChange={handleChange} label="성별">
            <MenuItem value="M">남성</MenuItem>
            <MenuItem value="F">여성</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          회원가입
        </Button>
      </StyledForm>
    </StyledContainer>
  );
};

export default JoinForm;
