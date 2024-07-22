import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import styles from "./styles/MyPage.module.css";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [editInfo, setEditInfo] = useState({
    name: "",
    email: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "M", // Initialize with a default value
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false); // State to track save success
  const [addressList, setAddressList] = useState([]);
  const [editAddressIndex, setEditAddressIndex] = useState(-1); // Index of the address being edited

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedLoginInfo = localStorage.getItem("loginInfo");

      if (!storedLoginInfo) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
        return;
      }

      const loginInfo = JSON.parse(storedLoginInfo);

      try {
        const response = await axios.get("http://localhost:8080/members/info", {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        });

        const userData = response.data;
        setUserInfo(userData);
        setEditInfo({
          name: userData.name,
          email: userData.email,
          birthYear: userData.birthYear,
          birthMonth: userData.birthMonth,
          birthDay: userData.birthDay,
          gender: userData.gender,
        });

        const addressResponse = await axios.get(
          `http://localhost:8080/addresses/${userData.memberId}`,
          {
            headers: {
              Authorization: `Bearer ${loginInfo.accessToken}`,
            },
          }
        );
        setAddressList(addressResponse.data);
      } catch (error) {
        console.error("회원 정보를 가져오는 중 오류가 발생했습니다.", error);
        if (error.response && error.response.status === 401) {
          // 토큰이 만료되거나 유효하지 않은 경우
          alert("로그인이 필요합니다.");
          localStorage.removeItem("loginInfo");
          window.location.href = "/login";
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const storedLoginInfo = localStorage.getItem("loginInfo");

    if (!storedLoginInfo) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    const loginInfo = JSON.parse(storedLoginInfo);

    try {
      await axios.put(
        `http://localhost:8080/members/update/${userInfo.memberId}`,
        { ...editInfo },
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );
      alert("회원 정보가 성공적으로 업데이트되었습니다.");
      setUserInfo(editInfo);
      setIsEditing(false);
      setSaveSuccess(true); // Indicate save success
    } catch (error) {
      console.error("회원 정보를 업데이트하는 중 오류가 발생했습니다.", error);
      alert("회원 정보를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  const handleEditAddress = (index) => {
    setEditAddressIndex(index);
  };

  const handleSaveAddress = async (editedAddress) => {
    const storedLoginInfo = localStorage.getItem("loginInfo");

    if (!storedLoginInfo) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    const loginInfo = JSON.parse(storedLoginInfo);

    try {
      await axios.put(
        `http://localhost:8080/addresses/${editedAddress.id}`,
        { address: editedAddress.address }, // Assuming address is the field being edited
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );
      alert("주소가 성공적으로 업데이트되었습니다.");

      // Update the address list with the edited address
      const updatedAddressList = [...addressList];
      updatedAddressList[editAddressIndex] = editedAddress;
      setAddressList(updatedAddressList);

      setEditAddressIndex(-1); // Reset edit mode
    } catch (error) {
      console.error("주소를 업데이트하는 중 오류가 발생했습니다.", error);
      alert("주소를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    const storedLoginInfo = localStorage.getItem("loginInfo");

    if (!storedLoginInfo) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    const loginInfo = JSON.parse(storedLoginInfo);

    try {
      await axios.delete(
        `http://localhost:8080/members/delete/${userInfo.memberId}`,
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );
      console.log(userInfo);
      alert("회원 탈퇴가 성공적으로 처리되었습니다.");
      localStorage.removeItem("loginInfo");
      window.location.href = "/login";
    } catch (error) {
      console.error("회원 탈퇴 중 오류가 발생했습니다.", error);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (saveSuccess) {
      // Refresh the page once after save success
      window.location.reload();
    }
  }, [saveSuccess]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Container className={styles.container}>
      <h1>MyPage.</h1>
      {!isEditing ? (
        <div className={styles["table-container"]}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>이름</th>
                <td>{userInfo.name}</td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>{userInfo.email}</td>
              </tr>
              <tr>
                <th>생년월일</th>
                <td>
                  {userInfo.birthYear}년 {userInfo.birthMonth}월{" "}
                  {userInfo.birthDay}일
                </td>
              </tr>
              <tr>
                <th>성별</th>
                <td>
                  {userInfo.gender === "M"
                    ? "남자"
                    : userInfo.gender === "F"
                    ? "여자"
                    : "기타"}
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{
                bgcolor: "black",
                color: "white",
                "&:hover": { bgcolor: "black" },
              }}
            >
              수정하기
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeleteAccount}
              sx={{
                bgcolor: "red",
                color: "white",
                "&:hover": { bgcolor: "darkred" },
                marginLeft: "10px",
              }}
            >
              회원탈퇴하기
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles["form-container"]}>
          <TextField
            label="이름"
            name="name"
            value={editInfo.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="이메일"
            name="email"
            value={editInfo.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="생년"
            name="birthYear"
            value={editInfo.birthYear}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="생월"
            name="birthMonth"
            value={editInfo.birthMonth}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="생일"
            name="birthDay"
            value={editInfo.birthDay}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="성별"
            name="gender"
            value={editInfo.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="M">남자</MenuItem>
            <MenuItem value="F">여자</MenuItem>
            <MenuItem value="E">기타</MenuItem>
          </TextField>{" "}
          <div className={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{
                bgcolor: "black",
                color: "white",
                "&:hover": { bgcolor: "black" },
              }}
            >
              저장
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default MyPage;
