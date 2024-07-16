// Order.js

import React from "react";
import {
  ListItem,
  List,
  TextField,
  Button,
  ListItemText,
  Typography,
} from "@mui/material";
import styles from "./styles/CartItems.module.css";

const Order = ({
  recipientName,
  setRecipientName,
  phonePart1,
  setPhonePart1,
  handlePhoneChange,
  phonePart2,
  phonePart3,
  setPhonePart2,
  setPhonePart3,
  phonePart2Ref,
  phonePart3Ref,
  postalCode,
  setPostalCode,
  address,
  setAddress,
  handleAddressChange,
  handleCheckout,
}) => {
  return (
    <List>
      <ListItem>
        <TextField
          label="이름"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          className={styles["name-input"]}
        />
      </ListItem>
      <ListItem>
        <TextField
          label="전화번호"
          value={phonePart1}
          onChange={(e) => handlePhoneChange(1, e.target.value)}
          inputProps={{ maxLength: 3 }}
          sx={{ width: "5em", marginRight: "0.5em" }}
          className={styles["phone-input"]}
        />
        <TextField
          value={phonePart2}
          onChange={(e) => handlePhoneChange(2, e.target.value)}
          inputProps={{ maxLength: 4 }}
          sx={{ width: "6em", marginRight: "0.5em" }}
          className={styles["phone-input"]}
          inputRef={phonePart2Ref}
        />
        <TextField
          value={phonePart3}
          onChange={(e) => handlePhoneChange(3, e.target.value)}
          inputProps={{ maxLength: 4 }}
          sx={{ width: "6em" }}
          className={styles["phone-input"]}
          inputRef={phonePart3Ref}
        />
      </ListItem>
      <ListItem>
        <TextField
          label="우편번호"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className={styles["address-input"]}
          style={{ marginRight: "1em" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddressChange}
          className={styles["address-button"]}
        >
          주소 검색
        </Button>
      </ListItem>
      <ListItem>
        <TextField
          label="주소"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ width: "30em" }}
          className={styles["address-input"]}
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
  );
};

export default Order;
