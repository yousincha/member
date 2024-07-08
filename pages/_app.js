import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Container } from "@mui/material";
import AppBar from "../components/AppBar";
import { createTheme } from "@mui/material/styles";
import myAxios from "../utils/myaxios";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: css`
        html,
        body,
        #__next {
          height: 100%;
        }
      `,
    },
  },
});

const StyledContainer = styled(Container)`
  min-height: calc(100% - 64px);
  min-width: 767px;
  padding-top: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function MyApp({ Component, pageProps }) {
  const router = useRouter(); // useRouter 훅 사용

  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      const storedLoginInfo = localStorage.getItem("loginInfo");
      if (storedLoginInfo) {
        const loginInfo = JSON.parse(storedLoginInfo);
        const { accessToken, refreshToken } = loginInfo;

        try {
          const response = await myAxios.post(
            "/members/refreshToken",
            { refreshToken },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const newLoginInfo = response.data;
          localStorage.setItem("loginInfo", JSON.stringify(newLoginInfo));
        } catch (error) {
          console.error("토큰 갱신 실패:", error);

          localStorage.removeItem("loginInfo");
          window.dispatchEvent(new CustomEvent("loginStatusChanged"));
          router.push("/"); // router.push 사용
        }
      }
    }, 10 * 1000);

    return () => {
      clearInterval(refreshTokenInterval);
    };
  }, [router]);

  return (
    <ThemeProvider theme={theme}>
      <AppBar />
      <StyledContainer>
        <Component {...pageProps} />
      </StyledContainer>
    </ThemeProvider>
  );
}

export default MyApp;
