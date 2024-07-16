import React from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import styles from "../styles/CartItems.module.css";
import requestPay from "../services/paymentService";

const PayInfo = ({
  loginInfo,
  itemsInfo,
  selectedItems,
  calculateTotalSum,
  calculateTotalPrice,
  setItemsInfo,
  setSelectedItems,
  recipientName,
  recipientPhone,
  postalCode,
  address,
}) => {
  const handleCheckout = async (pg) => {
    const selectedItemsInfo = itemsInfo.filter((item) =>
      selectedItems.includes(item.id)
    );

    if (selectedItemsInfo.length === 0) {
      alert("결제할 상품을 선택하세요.");
      return;
    }

    // 추가된 부분: 모든 배송 정보가 입력되었는지 확인
    if (
      !postalCode ||
      !address ||
      !recipientName ||
      !recipientPhone.part1 ||
      !recipientPhone.part2 ||
      !recipientPhone.part3
    ) {
      alert("모든 배송 정보를 입력하세요.");
      return;
    }

    try {
      const result = await requestPay(
        loginInfo,
        selectedItemsInfo,
        calculateTotalSum,
        calculateTotalPrice,
        pg,
        recipientName,
        recipientPhone,
        address,
        postalCode
      );
      alert(result);
      setItemsInfo((prevItemsInfo) =>
        prevItemsInfo.filter((item) => !selectedItems.includes(item.id))
      );
      setSelectedItems([]);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <List className="pay_info" style={{ marginLeft: "3em" }}>
      <ListItemText
        primary="결제수단"
        primaryTypographyProps={{
          style: {
            fontWeight: "bold",
            fontSize: "1.2em",
            marginTop: "3em",
          },
        }}
      />
      <ListItem
        className={`${styles["box-list"]}`}
        style={{ justifyContent: "left" }}
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
  );
};

export default PayInfo;
