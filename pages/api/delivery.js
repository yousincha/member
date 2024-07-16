import React, { useRef } from "react";
import { List, ListItem, TextField, Button, ListItemText } from "@mui/material";
import addressInfo from "../services/addressService";
import axios from "axios";

const DeliveryInfo = ({
  loginInfo,
  postalCode,
  setPostalCode,
  address,
  setAddress,
  recipientName,
  setRecipientName,
  recipientPhone,
  setRecipientPhone,
}) => {
  const phonePart2Ref = useRef(null);
  const phonePart3Ref = useRef(null);

  const handleAddressChange = async () => {
    try {
      const { postalCode, address } = await addressInfo();
      setPostalCode(postalCode);
      setAddress(address);
    } catch (error) {
      console.error("주소를 가져오는데 실패했습니다.", error);
    }
  };

  const handlePhoneChange = (part, value) => {
    if (part === 1) {
      setRecipientPhone((prevPhone) => ({
        ...prevPhone,
        part1: value.replace(/[^0-9]/g, "").slice(0, 3),
      }));
      if (value.length === 3) {
        phonePart2Ref.current.focus(); // phonePart1 입력이 끝나면 phonePart2로 포커스 이동
      }
    } else if (part === 2) {
      setRecipientPhone((prevPhone) => ({
        ...prevPhone,
        part2: value.replace(/[^0-9]/g, "").slice(0, 4),
      }));
      if (value.length === 4) {
        phonePart3Ref.current.focus(); // phonePart2 입력이 끝나면 phonePart3로 포커스 이동
      }
    } else if (part === 3) {
      setRecipientPhone((prevPhone) => ({
        ...prevPhone,
        part3: value.replace(/[^0-9]/g, "").slice(0, 4),
      }));
    }
  };

  const onSaveAddress = async () => {
    if (!loginInfo) {
      alert("로그인이 필요합니다.");
      return;
    }
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
      const addressData = {
        memberId: loginInfo.memberId,
        recipientName,
        recipientPhone: `${recipientPhone.part1}-${recipientPhone.part2}-${recipientPhone.part3}`,
        postalCode,
        address,
      };

      const response = await axios.post(
        "http://localhost:8080/saveAddress",
        addressData,
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );

      alert("주소가 저장되었습니다.");
    } catch (error) {
      console.error("주소 저장 실패:", error);
      alert("주소 저장에 실패했습니다.");
    }
  };

  return (
    <List className="delivery_info" style={{ paddingLeft: "3em" }}>
      <ListItemText
        primary="배송지 입력"
        primaryTypographyProps={{
          style: {
            fontWeight: "bold",
            fontSize: "1.2em",
            marginTop: "3em",
          },
        }}
      />
      <ListItem>
        <TextField
          label="이름"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
        />
      </ListItem>
      <ListItem>
        <TextField
          label="전화번호"
          value={recipientPhone.part1}
          onChange={(e) => handlePhoneChange(1, e.target.value)}
          inputProps={{ maxLength: 3 }}
          sx={{ width: "5em", marginRight: "0.5em" }}
        />
        <TextField
          value={recipientPhone.part2}
          onChange={(e) => handlePhoneChange(2, e.target.value)}
          inputProps={{ maxLength: 4 }}
          sx={{ width: "6em", marginRight: "0.5em" }}
          inputRef={phonePart2Ref}
        />
        <TextField
          value={recipientPhone.part3}
          onChange={(e) => handlePhoneChange(3, e.target.value)}
          inputProps={{ maxLength: 4 }}
          sx={{ width: "6em" }}
          inputRef={phonePart3Ref}
        />
      </ListItem>
      <ListItem>
        <TextField
          label="우편번호"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          style={{ marginRight: "1em" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddressChange}
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
        />
      </ListItem>
      <ListItem>
        <Button variant="contained" color="primary" onClick={onSaveAddress}>
          주소 저장
        </Button>
      </ListItem>
    </List>
  );
};

export default DeliveryInfo;
