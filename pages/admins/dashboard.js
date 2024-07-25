import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const router = useRouter();
  const [paymentsInfos, setPaymentsInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/admins/login");
    } else {
      // Fetch paymentsInfos data from server
      const fetchPaymentsInfos = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8080/paymentInfos",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log(response.data); // 응답 데이터 확인

          setPaymentsInfos(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPaymentsInfos();
    }
  }, [router]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ marginTop: 4 }}>
          <Alert severity="error">Error: {error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          관리자 대시보드
        </Typography>
        <Box sx={{ marginTop: 4 }}>
          <TableContainer component={Paper} sx={{ width: "1300px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>결제 ID</TableCell>
                  <TableCell>impUid</TableCell>
                  <TableCell>금액</TableCell>
                  <TableCell>결제 방법</TableCell>
                  <TableCell>merchantUid</TableCell>
                  <TableCell>제품 이름</TableCell>
                  <TableCell>구매자 이름</TableCell>
                  <TableCell>구매자 전화</TableCell>
                  <TableCell>구매자 주소</TableCell>
                  <TableCell>구매자 우편번호</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentsInfos.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.impUid}</TableCell>
                    <TableCell>{payment.paid_amount}</TableCell>
                    <TableCell>{payment.payMethod}</TableCell>
                    <TableCell>{payment.merchantUid}</TableCell>
                    <TableCell>{payment.name}</TableCell>
                    <TableCell>{payment.buyerName}</TableCell>
                    <TableCell>{payment.buyerTel}</TableCell>
                    <TableCell>{payment.buyerAddr}</TableCell>
                    <TableCell>{payment.buyerPostcode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
