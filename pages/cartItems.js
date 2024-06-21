import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";

const CartItems = () => {
  const [itemsInfo, setItemsInfo] = useState([]);
  const [loginInfo, setLoginInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedLoginInfo = localStorage.getItem("loginInfo");
        if (!storedLoginInfo) {
          alert("로그인이 필요합니다.");
          window.location.href = "/login"; // 로그인 페이지로 리디렉션
          return;
        }
        const loginInfo = JSON.parse(storedLoginInfo);
        setLoginInfo(loginInfo);

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

    fetchUserInfo();
  }, []);

  if (!loginInfo) {
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
      <h1>'{loginInfo.nickname}'님의 장바구니</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: "20px",
          width: "100%",
          maxWidth: 1200,
          margin: "auto",
        }}
      >
        {itemsInfo.length > 0 ? (
          itemsInfo.map((item) => (
            <Card
              key={item.id}
              sx={{ maxWidth: 350, flexGrow: 1, marginBottom: 20 }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  상품명: {item.productTitle}
                </Typography>
                <Typography variant="body1">
                  상품 상세: {item.productDescription}
                </Typography>
                <Typography variant="body1">
                  가격: {item.productPrice} | 수량: {item.quantity}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6">카트가 비어 있습니다.</Typography>
        )}
      </Box>
    </Container>
  );
};
export default CartItems;
