import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import styles from "./styles/MyPage.module.css";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);

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
      } catch (error) {
        console.error("회원 정보를 가져오는 중 오류가 발생했습니다.", error);
        window.location.href = "/login";
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Container className={styles.container}>
      <h1>Info.</h1>
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
              <td>{userInfo.gender === "M" ? "남자" : "여자"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default MyPage;
