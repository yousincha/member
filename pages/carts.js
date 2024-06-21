import React, { useState } from "react";
import myAxios from "../utils/myaxios"; // 커스텀 axios 인스턴스를 사용
import { Container, Typography, Box, TextField, Button } from "@mui/material";

const Carts = () => {
  const [memberId, setMemberId] = useState("");
  const [addedCart, setAddedCart] = useState(null);

  const handleAddCart = async () => {
    try {
      const loginInfo = JSON.parse(localStorage.getItem("loginInfo")); // 로컬 스토리지에서 로그인 정보 가져오기

      if (!loginInfo || !loginInfo.accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await myAxios.post(
        "/carts",
        { memberId },
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`, // 토큰을 헤더에 추가
          },
        }
      );
      setAddedCart(response.data);
    } catch (error) {
      console.error("Error adding cart:", error);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Add Cart
      </Typography>
      <Box sx={{ textAlign: "center", width: "100%", maxWidth: 400 }}>
        <TextField
          label="Member ID"
          variant="outlined"
          fullWidth
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddCart}>
          Add Cart
        </Button>
        {addedCart && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Added Cart</Typography>
            <Typography>ID: {addedCart.id}</Typography>
            <Typography>Member ID: {addedCart.memberId}</Typography>
            <Typography>Date: {addedCart.date}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Carts;
