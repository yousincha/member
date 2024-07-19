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
import styles from "./styles/CartItems.module.css";
import cancelCart from "./services/cancelService";
import updateCart from "./services/updateService";
import DeliveryInfo from "./api/delivery";
import PayInfo from "./api/pay";

const CartItems = () => {
  const [itemsInfo, setItemsInfo] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loginInfo, setLoginInfo] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState({
    part1: "",
    part2: "",
    part3: "",
  });
  const router = useRouter();

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

  const handleCancel = async (itemId) => {
    try {
      const result = await cancelCart(loginInfo, [itemId]);
      setItemsInfo((prevItemsInfo) =>
        prevItemsInfo.filter((item) => item.id !== itemId)
      );
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((id) => id !== itemId)
      );
    } catch (error) {
      alert(error);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      const result = await updateCart(loginInfo, itemId, newQuantity);
      setItemsInfo((prevItemsInfo) =>
        prevItemsInfo.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      alert(error);
    }
  };

  const calculateTotalSum = (items) => {
    let totalSum = 0;
    items.forEach((item) => {
      totalSum += calculateTotalPrice(item.productPrice, item.quantity);
    });

    if (totalSum <= 30000) {
      totalSum += 3000;
    }

    return totalSum;
  };

  const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };
  const formatPriceWithCommas = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                        가격: {formatPriceWithCommas(item.productPrice)} | 수량:{" "}
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
                        {formatPriceWithCommas(
                          calculateTotalPrice(item.productPrice, item.quantity)
                        )}
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
                    {formatPriceWithCommas(
                      calculateTotalSum(
                        itemsInfo.filter((item) =>
                          selectedItems.includes(item.id)
                        )
                      )
                    )}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" component="span">
                    {calculateTotalSum(
                      itemsInfo.filter((item) =>
                        selectedItems.includes(item.id)
                      )
                    ) <= 30000
                      ? "(+배송비: 3,000원)"
                      : "(+무료배송(0원))"}
                  </Typography>
                }
              />
            </ListItem>
            <DeliveryInfo
              loginInfo={loginInfo}
              itemsInfo={itemsInfo}
              selectedItems={selectedItems}
              calculateTotalSum={calculateTotalSum}
              calculateTotalPrice={calculateTotalPrice}
              setItemsInfo={setItemsInfo}
              setSelectedItems={setSelectedItems}
              postalCode={postalCode}
              setPostalCode={setPostalCode}
              address={address}
              setAddress={setAddress}
              recipientName={recipientName}
              setRecipientName={setRecipientName}
              recipientPhone={recipientPhone}
              setRecipientPhone={setRecipientPhone}
            />
            <PayInfo
              loginInfo={loginInfo}
              itemsInfo={itemsInfo}
              selectedItems={selectedItems}
              calculateTotalSum={calculateTotalSum}
              calculateTotalPrice={calculateTotalPrice}
              setItemsInfo={setItemsInfo}
              setSelectedItems={setSelectedItems}
              setPostalCode={setPostalCode}
              recipientName={recipientName}
              recipientPhone={recipientPhone}
              postalCode={postalCode}
              address={address}
            />
          </List>
        ) : (
          <Typography variant="h6">카트가 비어 있습니다.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default CartItems;
