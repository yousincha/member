import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import myAxios from "../utils/myaxios"; // Custom axios instance
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

const ResetPassword = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [resetTokenValid, setResetTokenValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const queryToken = new URLSearchParams(window.location.search).get("token");

    if (!queryToken) {
      setErrorMessage(
        "잘못된 접근입니다. 이메일을 통해 유효한 링크로 접속해주세요."
      );
      return;
    }

    const checkResetTokenValidity = async (resetToken) => {
      try {
        const response = await myAxios.get("/members/resettoken", {
          params: { resetToken },
        });
        setResetTokenValid(true);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setErrorMessage("링크가 만료되었거나 잘못된 링크입니다.");
        } else {
          setErrorMessage(
            "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      }
    };

    checkResetTokenValidity(queryToken);
  }, []);

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await myAxios.post("/members/resetpassword", {
        resetToken: new URLSearchParams(window.location.search).get("token"),
        newPassword,
      });

      setSuccessMessage(response.data);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setErrorMessage(
          "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      } else if (error.response && error.response.data) {
        setErrorMessage(`비밀번호 재설정 중 오류 발생: ${error.response.data}`);
      } else {
        setErrorMessage("비밀번호 재설정 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        비밀번호 재설정
      </Typography>
      {!resetTokenValid && (
        <Typography variant="body1" gutterBottom>
          {errorMessage}
        </Typography>
      )}
      {resetTokenValid && (
        <div>
          <Typography variant="body1" gutterBottom>
            새로운 비밀번호를 입력하세요.
          </Typography>
          <TextField
            label="새로운 비밀번호"
            variant="outlined"
            fullWidth
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="새로운 비밀번호 확인"
            variant="outlined"
            fullWidth
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handlePasswordReset}
          >
            비밀번호 재설정
          </Button>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}
        </div>
      )}
      <Link href="/login" passHref>
        <Button>로그인 페이지로 이동</Button>
      </Link>
    </StyledContainer>
  );
};

export default ResetPassword;
