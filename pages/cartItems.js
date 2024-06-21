import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Box } from "@mui/material";

const CartItems = () => {
  const [itemsInfo, setItemsInfo] = useState(null);

  const fetchItemsInfo = async () => {
    try {
      const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

      if (!loginInfo || !loginInfo.accessToken) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login"; // 로그인 페이지로 리디렉션
        return;
      }

      const response = await axios.get("http://localhost:8080/cartItems", {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      });

      setItemsInfo(response.data);
    } catch (error) {
      console.error("빈 카트 입니다.", error);
      setItemsInfo([]); // 빈 카트 처리
    }
  };

  useEffect(() => {
    fetchItemsInfo();
  }, []);

  if (!itemsInfo) {
    return <div>Loading...</div>;
  }

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
      <h1>Cart</h1>
      <p>카트 정보입니다.</p>
      <Box sx={{ textAlign: "center" }}>
        {itemsInfo.length > 0 ? (
          itemsInfo.map((item) => (
            <Box key={item.id} sx={{ margin: "20px 0" }}>
              <Typography variant="h5">상품명: {item.productTitle}</Typography>
              <Typography variant="h6">
                상품 상세: {item.productDescription}
              </Typography>
              <Typography variant="h6">
                가격: {item.productPrice} 수량: {item.quantity}
              </Typography>
              <Typography variant="h6"></Typography>
            </Box>
          ))
        ) : (
          <Typography variant="h6">카트가 비어 있습니다.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default CartItems;
