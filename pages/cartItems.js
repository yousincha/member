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

  const requestPay = () => {
    const { IMP } = window;
    IMP.init("imp07380687");
    const totalPrice = calculateTotalSum();
    IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card",
        merchant_uid: new Date().getTime(),
        name: "테스트 상품",
        amount: totalPrice,
        buyer_email: "test@gmail.com",
        buyer_name: "cozy",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울특별시",
        buyer_postcode: "123-456",
      },
      async (rsp) => {
        if (rsp.success) {
          try {
            // GET 요청으로 변경
            const response = await axios.get(
              `http://localhost:8080/paymentInfos/${rsp.imp_uid}`,
              {
                params: rsp, // rsp 객체를 쿼리 매개변수로 전달합니다.
              }
            );
            console.log(rsp.imp_uid);
            if (rsp.paid_amount === response.data.paid_amount) {
              alert("결제 성공");
              // 결제 성공 시, 서버에 삭제 요청
              await axios.delete(
                "http://localhost:8080/cartItems/deleteAfterPayment",
                {
                  data: itemsInfo.map((item) => item.id),
                  headers: {
                    Authorization: `Bearer ${loginInfo.accessToken}`,
                  },
                }
              );

              // 결제 후 카트 아이템 정보 갱신
              setItemsInfo([]);
            } else {
              alert("결제 실패: 금액 불일치");
            }
          } catch (error) {
            console.error("Error while verifying payment:", error);
            alert("결제 실패: 서버 오류");
          }
        } else {
          alert(`결제 실패: ${rsp.error_msg}`);
        }
      }
    );
  };

  const handleCheckout = () => {
    requestPay(); // 결제 함수 호출
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
                    전체 총 합계: {calculateTotalSum()}
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
