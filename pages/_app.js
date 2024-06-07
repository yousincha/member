import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Container } from "@mui/material";
import AppBar from "../components/AppBar";
import { createTheme } from "@mui/material/styles";
import myAxios from "../utils/myaxios";
import Router from "next/router";
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
  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

      console.log(loginInfo);
      if (loginInfo) {
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

          const loginInfo = response.data;
          localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
        } catch (error) {
          console.error(error);

          localStorage.removeItem("loginInfo");
          window.dispatchEvent(new CustomEvent("loginStatusChanged"));
          Router.push("/");
        }
      }
    }, 10 * 1000);

    return () => {
      clearInterval(refreshTokenInterval);
    };
  }, []);

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
