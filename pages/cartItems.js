import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import styles from "./styles/CartItems.module.css"; // CSS 모듈 임포트
import requestPay from "./services/paymentService"; // paymentService.js에서 requestPay import

const CartItems = () => {
  const [itemsInfo, setItemsInfo] = useState([]);
  const [loginInfo, setLoginInfo] = useState(null);
  const router = useRouter(); // useRouter 훅 사용

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

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "http://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "http://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const handleCheckout = async () => {
    try {
      const result = await requestPay(loginInfo, itemsInfo);
      alert(result); // 성공 메시지 출력
      setItemsInfo([]); // 결제 후 카트 아이템 정보 초기화
    } catch (error) {
      alert(error); // 실패 메시지 출력
    }
  };
  const calculateTotalSum = (itemsInfo) => {
    let totalSum = 0;
    itemsInfo.forEach((item) => {
      totalSum += calculateTotalPrice(item.productPrice, item.quantity);
    });
    return totalSum;
  };

  const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };
  if (!loginInfo) {
    return <div>Loading...</div>;
  }

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
                    <Typography
                      className={styles["item-title"]}
                      component="span"
                    >
                      상품명: {item.productTitle}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        className={styles["item-description"]}
                        component="span"
                      >
                        상품 상세: {item.productDescription}
                      </Typography>
                      <br />
                      <Typography
                        className={styles["item-price"]}
                        component="span"
                      >
                        가격: {item.productPrice} | 수량: {item.quantity}
                      </Typography>
                      <br />
                      <Typography
                        className={styles["item-total"]} // 오른쪽 정렬을 위한 CSS 클래스
                        component="span" // div 요소로 변경
                      >
                        + 총 금액:{" "}
                        {calculateTotalPrice(item.productPrice, item.quantity)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
            <ListItem className={styles["box-list"]}>
              <ListItemText
                className={styles["item-totalprice"]}
                primary={
                  <Typography variant="body1" component="span">
                    전체 총 합계: {calculateTotalSum(itemsInfo)}
                  </Typography>
                }
                secondary={<></>}
              />
            </ListItem>
            <ListItem className={styles["box-list"]}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                fullWidth
              >
                결제하기
              </Button>
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
