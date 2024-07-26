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
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const router = useRouter();
  const [paymentsInfos, setPaymentsInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerTel, setBuyerTel] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name"); // Default search criteria
  const [filteredPayments, setFilteredPayments] = useState([]);

  const fetchPaymentsInfos = async (accessToken) => {
    try {
      const response = await axios.get("http://localhost:8080/paymentInfos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPaymentsInfos(response.data);
      setFilteredPayments(response.data); // Initialize filtered payments
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          await fetchPaymentsInfos(newAccessToken);
        } else {
          router.push("/admins/login");
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(
        "http://localhost:8080/admins/refreshToken",
        {
          refreshToken,
        }
      );
      if (response.status === 200) {
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        return accessToken;
      }
    } catch (error) {
      console.error("Failed to refresh access token", error);
      return null;
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/admins/login");
    } else {
      fetchPaymentsInfos(accessToken);
    }
  }, [router]);

  useEffect(() => {
    // Filtering logic based on search criteria
    const filtered = paymentsInfos.filter((payment) => {
      if (searchCriteria === "name") {
        return buyerName ? payment.buyerName.includes(buyerName) : true;
      } else if (searchCriteria === "tel") {
        return buyerTel ? payment.buyerTel.includes(buyerTel) : true;
      }
      return true;
    });
    setFilteredPayments(filtered);
  }, [buyerName, buyerTel, paymentsInfos, searchCriteria]);

  const formatPhoneNumber = (value) => {
    const cleaned = ("" + value).replace(/\D/g, ""); // Remove non-digits
    const match = cleaned.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/); // Split number
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join("-"); // Join with dashes
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setBuyerTel(formattedValue);
  };

  const handleSearchCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

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
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>검색 기준</InputLabel>
            <Select
              value={searchCriteria}
              onChange={handleSearchCriteriaChange}
              label="검색 기준"
            >
              <MenuItem value="name">구매자 이름</MenuItem>
              <MenuItem value="tel">전화</MenuItem>
            </Select>
          </FormControl>
          {searchCriteria === "name" && (
            <TextField
              label="구매자 이름"
              variant="outlined"
              fullWidth
              margin="normal"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
          )}
          {searchCriteria === "tel" && (
            <TextField
              label="전화"
              variant="outlined"
              fullWidth
              margin="normal"
              value={buyerTel}
              onChange={handlePhoneChange} // Use formatted phone change handler
            />
          )}
          <Box sx={{ marginTop: 4 }}>
            <TableContainer component={Paper} sx={{ width: "100%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>결제 ID</TableCell>
                    <TableCell>구매자 이름</TableCell>
                    <TableCell>제품 이름</TableCell>
                    <TableCell>금액</TableCell>
                    <TableCell>결제 방법</TableCell>
                    <TableCell>전화</TableCell>
                    <TableCell>주소</TableCell>
                    <TableCell>우편번호</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.buyerName}</TableCell>
                      <TableCell>{payment.name}</TableCell>
                      <TableCell>
                        {formatCurrency(payment.paid_amount)}
                      </TableCell>
                      <TableCell>{payment.payMethod}</TableCell>
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
      </Box>
    </Container>
  );
};

export default Dashboard;
