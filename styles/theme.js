import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000", // 버튼 등의 주요 요소의 기본 색상을 검은색으로 지정
    },
    text: {
      primary: "#000", // 텍스트의 기본 색상을 검은색으로 지정
    },
  },
});

export default theme;
