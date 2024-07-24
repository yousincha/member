// pages/admins/dashboard.js

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Typography, Box, Button } from "@mui/material";

const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/admins/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminId");
    router.push("/admins/login");
  };

  return (
    <Container>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          관리자 대시보드
        </Typography>
        <Typography variant="body1">
          이곳에서 관리자 정보를 관리하고, 통계 자료를 볼 수 있습니다.
        </Typography>
        <Button onClick={handleLogout} variant="contained" color="primary">
          로그아웃
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
