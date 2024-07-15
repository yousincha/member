import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, TextField, Button, MenuItem } from "@mui/material";
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

        setUserInfo(response.data);
        setEditInfo({
          name: response.data.name,
          email: response.data.email,
          birthYear: response.data.birthYear,
          birthMonth: response.data.birthMonth,
          birthDay: response.data.birthDay,
          gender: response.data.gender,
        });
      } catch (error) {
        console.error("회원 정보를 가져오는 중 오류가 발생했습니다.", error);
        window.location.href = "/login";
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditing(true)}
            fullWidth
          >
            수정하기
          </Button>
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
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
          >
            저장
          </Button>
        </div>
      )}
    </Container>
  );
};

export default MyPage;
