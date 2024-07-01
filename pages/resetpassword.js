import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

const ResetPassword = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [resetTokenValid, setResetTokenValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // 페이지 로드 시, URL에서 reset token을 가져옵니다.
    const resetToken = router.query.token;

    if (!resetToken) {
      setErrorMessage(
        "잘못된 접근입니다. 이메일을 통해 유효한 링크로 접속해주세요."
      );
      return;
    }

    // 서버에서 reset token의 유효성을 검사합니다.
    const checkResetTokenValidity = async () => {
      try {
        const response = await myAxios.get("/validate-reset-token", {
          params: { resetToken },
        });
        // 서버로부터 유효한 토큰인 경우
        setResetTokenValid(true);
      } catch (error) {
        // 서버로부터 유효하지 않은 토큰 또는 다른 오류인 경우
        setErrorMessage("링크가 만료되었거나 잘못된 링크입니다.");
      }
    };

    checkResetTokenValidity();
  }, [router.query.token]);

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await myAxios.post("/reset-password", {
        resetToken: router.query.token,
        newPassword,
      });
      setSuccessMessage("비밀번호가 성공적으로 재설정되었습니다.");
      setErrorMessage("");
      // 여기에서 원하는 처리를 추가할 수 있습니다. 예를 들어 로그인 페이지로 리다이렉트하는 등의 동작.
    } catch (error) {
      setErrorMessage("비밀번호 재설정 중 오류가 발생했습니다.");
      console.error("Error resetting password:", error);
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
