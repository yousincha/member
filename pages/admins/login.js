import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import Link from "next/link";
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

const LoginButton = styled(Button)`
  background-color: black;
  color: white;
  &:hover {
    background-color: #333;
  }
`;

const LinkButton = styled(Button)`
  color: black;
`;

const AdminLogin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/admins/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { accessToken, refreshToken, memberId } = response.data;
        // JWT와 기타 필요한 정보를 로컬 스토리지에 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("adminId", memberId);
        router.push("/admins/dashboard");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("이메일이나 암호가 틀렸습니다.");
    }
  };

  return (
    <StyledContainer maxWidth="sm" component="main">
      <Typography variant="h4" component="h1" gutterBottom>
        관리자 로그인
      </Typography>
      <StyledForm component="form" onSubmit={handleLogin}>
        <TextField
          label="이메일"
          type="email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="비밀번호"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && (
          <Typography variant="body1" color="error" paragraph>
            {errorMessage}
          </Typography>
        )}
        <LoginButton type="submit" variant="contained" size="large" fullWidth>
          로그인
        </LoginButton>
        <Link href="/admins/joinform" passHref>
          <LinkButton>회원가입</LinkButton>
        </Link>
      </StyledForm>
    </StyledContainer>
  );
};

export default AdminLogin;
