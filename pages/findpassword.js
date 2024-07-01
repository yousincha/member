import React, { useState } from "react";
import myAxios from "../utils/myaxios"; // 커스텀 axios 인스턴스를 사용
import { Container, Typography, TextField, Button, Alert } from "@mui/material";
import styled from "@emotion/styled";
import Link from "next/link";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  height: 100%;
  margin: 0 auto;
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FindButton = styled(Button)`
  background-color: black;
  color: white;
  &:hover {
    background-color: #333;
  }
`;

const LinkButton = styled(Button)`
  color: black;
`;

const FindPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFindPassword = async () => {
    try {
      const response = await myAxios.post("/members/findpassword", { email });
      setSuccessMessage("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("비밀번호 찾기 요청 중 오류가 발생했습니다.");
      setSuccessMessage("");
      console.error("Error finding password:", error);
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        비밀번호 찾기
      </Typography>
      <StyledForm>
        <TextField
          label="이메일"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FindButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleFindPassword}
        >
          비밀번호 찾기
        </FindButton>
        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <Link href="/login" passHref>
          <LinkButton>로그인</LinkButton>
        </Link>
      </StyledForm>
    </StyledContainer>
  );
};

export default FindPassword;
