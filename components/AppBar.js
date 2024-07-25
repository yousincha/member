import React, { useState, useEffect } from "react";
import DesktopAppBar from "./DesktopAppBar";
import DesktopAppBar2 from "./DesktopAppBar2"; // 새로운 관리자 AppBar
import MobileAppBar from "./MobileAppBar";
import { useMediaQuery } from "@mui/material";

const AdaptiveAppBar = () => {
  const [role, setRole] = useState(null);
  const isMobile = useMediaQuery("(max-width:767px)");

  useEffect(() => {
    // 클라이언트 사이드에서 localStorage에 접근
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  if (isMobile) {
    return <MobileAppBar />;
  } else {
    // role 값에 따라 다른 AppBar를 렌더링
    return role === "admin" ? <DesktopAppBar2 /> : <DesktopAppBar />;
  }
};

export default AdaptiveAppBar;
