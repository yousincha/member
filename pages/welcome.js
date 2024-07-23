import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box, Alert } from "@mui/material";
import Link from "next/link";

const WelcomePage = () => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    // 메시지가 화면에 일정 시간 동안 보이도록 설정
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000); // 5초 후 알림 숨기기

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
  }, []);

  return (
    <Container>
      <Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }} // 폰트 굵게 설정
        >
          {" "}
          Welcome.
        </Typography>
        <Typography variant="body1" paragraph>
          회원가입이 성공적으로 완료되었습니다.
        </Typography>
        {showAlert && (
          <Alert
            severity="info"
            sx={{
              marginBottom: "1rem",
            }}
          >
            로그인 페이지로 이동하여 로그인해 주세요.
          </Alert>
        )}
        <Link href="/login" passHref>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#000",
              },
            }}
          >
            {" "}
            로그인 페이지로 이동
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default WelcomePage;
