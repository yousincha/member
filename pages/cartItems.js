import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import styles from "./styles/CartItems.module.css"; // CSS 모듈 임포트

const CartItems = () => {
  const [itemsInfo, setItemsInfo] = useState([]);
  const [loginInfo, setLoginInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedLoginInfo = localStorage.getItem("loginInfo");
        if (!storedLoginInfo) {
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
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
        setItemsInfo([]);
      }
    };

    fetchUserInfo();
  }, []);

  if (!loginInfo) {
    return <div>Loading...</div>;
  }

  const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };

  const calculateTotalSum = () => {
    let totalSum = 0;
    itemsInfo.forEach((item) => {
      totalSum += calculateTotalPrice(item.productPrice, item.quantity);
    });
    return totalSum;
  };
  return (
    <Container className={styles.container}>
      <h1>Cart.</h1>
      <Box className={styles.box}>
        {itemsInfo.length > 0 ? (
          <List>
            {itemsInfo.map((item) => (
              <ListItem key={item.id} className={styles["box-list"]}>
                <ListItemText
                  primary={
                    <Typography className={`${styles["item-title"]} `}>
                      상품명: {item.productTitle}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography className={styles["item-description"]}>
                        상품 상세: {item.productDescription}
                      </Typography>
                      <Typography className={styles["item-price"]}>
                        가격: {item.productPrice} | 수량: {item.quantity}
                      </Typography>
                      <Typography className={styles["item-total"]}>
                        + 총 금액:{" "}
                        {calculateTotalPrice(item.productPrice, item.quantity)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}{" "}
            <ListItem className={styles["box-list"]} disableTypography>
              <ListItemText
                className={styles["item-totalprice"]}
                primary={
                  <Typography variant="body1">
                    전체 총 합계: {calculateTotalSum()}
                  </Typography>
                }
                secondary={<></>}
              />
            </ListItem>
          </List>
        ) : (
          <Typography variant="h6">카트가 비어 있습니다.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default CartItems;
