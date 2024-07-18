import React, { useEffect, useRef, useState } from "react";
import {
  List,
  ListItem,
  TextField,
  Button,
  ListItemText,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import addressInfo from "../services/addressService"; // addressInfo 함수를 import

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
  const [addressList, setAddressList] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    const fetchAddressList = async () => {
      if (!loginInfo) return;
      try {
        const response = await axios.get("http://localhost:8080/addresses", {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        });
        setAddressList(response.data);
      } catch (error) {
        console.error("주소 목록을 가져오는데 실패했습니다.", error);
      }
    };
    fetchAddressList();
  }, [loginInfo]);

  const handleAddressChange = async () => {
    try {
      const { postalCode: newPostalCode, address: newAddress } =
        await addressInfo(); // addressInfo 함수로부터 postalCode와 address를 가져옴
      setPostalCode(newPostalCode); // 가져온 postalCode를 state에 설정
      setAddress(newAddress); // 가져온 address를 state에 설정
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
        phonePart2Ref.current.focus();
      }
    } else if (part === 2) {
      setRecipientPhone((prevPhone) => ({
        ...prevPhone,
        part2: value.replace(/[^0-9]/g, "").slice(0, 4),
      }));
      if (value.length === 4) {
        phonePart3Ref.current.focus();
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
        "http://localhost:8080/addresses",
        addressData,
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );

      alert("주소가 저장되었습니다.");
      const updatedAddressList = await axios.get(
        "http://localhost:8080/addresses",
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );

      setAddressList(updatedAddressList.data);
    } catch (error) {
      console.error("주소 저장 실패:", error);
      alert("주소는 3개까지만 등록 가능합니다.");
    }
  };

  const handleAddressButtonClick = (address) => {
    setPostalCode(address.postalCode);
    setAddress(address.address);
    setRecipientName(address.recipientName);
    const phoneParts = address.recipientPhone.split("-");
    setRecipientPhone({
      part1: phoneParts[0] || "",
      part2: phoneParts[1] || "",
      part3: phoneParts[2] || "",
    });
    setEditingAddressId(address.id);
  };

  const handleEditAddress = async () => {
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
      const updatedData = {
        recipientName,
        recipientPhone: `${recipientPhone.part1}-${recipientPhone.part2}-${recipientPhone.part3}`,
        postalCode,
        address,
      };

      const response = await axios.put(
        `http://localhost:8080/addresses/${editingAddressId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );

      alert("주소가 업데이트 되었습니다.");
      const updatedAddressList = await axios.get(
        "http://localhost:8080/addresses",
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );

      setAddressList(updatedAddressList.data);
    } catch (error) {
      console.error("주소 업데이트 실패:", error);
      alert("주소를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );
      alert("주소가 삭제되었습니다.");

      const updatedAddressList = await axios.get(
        "http://localhost:8080/addresses",
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );
      setAddressList(updatedAddressList.data);
    } catch (error) {
      console.error("주소 삭제 실패:", error);
      alert("주소를 삭제하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <List
      className="delivery_info"
      style={{ paddingLeft: "3em", display: "flex", flexWrap: "wrap" }}
    >
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

      {addressList.map((address, index) => (
        <div key={address.id} style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddressButtonClick(address)}
            style={{
              margin: "0.5em",
              whiteSpace: "nowrap",
            }}
          >
            주소 {index + 1}
          </Button>
          <IconButton
            aria-label="edit"
            onClick={() => handleAddressButtonClick(address.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDeleteAddress(address.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
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
        <Button
          variant="contained"
          color="primary"
          onClick={editingAddressId ? handleEditAddress : onSaveAddress}
        >
          {editingAddressId ? "주소 수정" : "주소 저장"}
        </Button>
      </ListItem>
    </List>
  );
};

export default DeliveryInfo;
