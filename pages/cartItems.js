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
  Checkbox,
  Button,
  TextField,
} from "@mui/material";
import styles from "./styles/CartItems.module.css"; // CSS 모듈 임포트
import requestPay from "./services/paymentService";
import cancelCart from "./services/cancelService";
import updateCart from "./services/updateService";

const CartItems = () => {
  const [itemsInfo, setItemsInfo] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 아이템들 상태
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

  const handleItemCheck = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const handleCheckout = async (pg) => {
    const selectedItemsInfo = itemsInfo.filter((item) =>
      selectedItems.includes(item.id)
    );

    if (selectedItemsInfo.length === 0) {
      alert("결제할 상품을 선택하세요.");
      return;
    }

    try {
      const result = await requestPay(
        loginInfo,
        selectedItemsInfo,
        calculateTotalSum,
        calculateTotalPrice,
        pg
      );
      alert(result);
      setItemsInfo((prevItemsInfo) =>
        prevItemsInfo.filter((item) => !selectedItems.includes(item.id))
      ); // 결제된 상품들을 카트에서 제거
      setSelectedItems([]); // 선택된 상품 초기화
    } catch (error) {
      alert(error); // 실패 메시지 출력
    }
  };

  const handleCancel = async (itemId) => {
    try {
      const result = await cancelCart(loginInfo, [itemId]);
      // alert(result); // 성공 메시지 출력
      setItemsInfo((prevItemsInfo) =>
        prevItemsInfo.filter((item) => item.id !== itemId)
      ); // 선택 취소된 상품들을 카트에서 제거
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((id) => id !== itemId)
      ); // 선택된 상품에서 제거
    } catch (error) {
      alert(error); // 실패 메시지 출력
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      const result = await updateCart(loginInfo, itemId, newQuantity);
      // alert(result); // 성공 메시지 출력
      setItemsInfo((prevItemsInfo) =>
        prevItemsInfo.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      ); // 수량이 업데이트된 상품 정보 반영
    } catch (error) {
      alert(error); // 실패 메시지 출력
    }
  };

  const calculateTotalSum = (items) => {
    let totalSum = 0;
    items.forEach((item) => {
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
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleItemCheck(item.id)}
                />
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
                    <div>
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
                        가격: {item.productPrice} | 수량:{" "}
                      </Typography>
                      <TextField
                        type="number"
                        defaultValue={item.quantity}
                        onBlur={(e) =>
                          handleUpdateQuantity(item.id, e.target.value)
                        }
                        className={styles["quantity-input"]}
                        inputProps={{ min: 1 }}
                        sx={{
                          "& .MuiInputBase-input": {
                            padding: "5px 8px",
                            height: "1em",
                            width: "2em",
                          },
                        }}
                      />
                      <br />
                      <Typography
                        className={styles["item-total"]}
                        component="span"
                      >
                        + 총 금액:{" "}
                        {calculateTotalPrice(item.productPrice, item.quantity)}
                      </Typography>
                      <br />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleCancel(item.id)}
                        className={styles["cancel-button"]}
                      >
                        선택취소
                      </Button>
                    </div>
                  }
                />
              </ListItem>
            ))}
            <ListItem className={styles["box-list"]}>
              <ListItemText
                className={styles["item-totalprice"]}
                primary={
                  <Typography variant="body1" component="span">
                    전체 총 합계:{" "}
                    {calculateTotalSum(
                      itemsInfo.filter((item) =>
                        selectedItems.includes(item.id)
                      )
                    )}
                  </Typography>
                }
                secondary={<></>}
              />
            </ListItem>
            <ListItemText
              primary="결제수단"
              primaryTypographyProps={{
                style: {
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  marginLeft: "3em",
                  marginTop: "3em",
                },
              }}
            />

            <ListItem
              className={`${styles["box-list"]}`}
              style={{
                display: "flex",
                justifyContent: "left",
                paddingLeft: "3em",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCheckout("html5_inicis.INIBillTst")}
                className={styles["cardpay-button"]}
              >
                신용 · 체크카드
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCheckout("kakaopay.TC0ONETIME")}
                className={styles["pay-button"]}
                style={{
                  backgroundImage: `url('/kakaopay.png')`,
                }}
              >
                카카오페이 간편결제
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCheckout("tosspay.tosstest")}
                className={styles["pay-button"]}
                style={{
                  backgroundImage: `url('/toss.png')`,
                }}
              >
                토스페이 간편결제
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
