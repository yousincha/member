import React from "react";
import DesktopAppBar from "./DesktopAppBar";
import MobileAppBar from "./MobileAppBar";
import { useMediaQuery } from "@mui/material";

const AdaptiveAppBar = () => {
  const isMobile = useMediaQuery("(max-width:767px)");

  if (isMobile) {
    return <MobileAppBar />;
  } else {
    return <DesktopAppBar />;
  }
};

export default AdaptiveAppBar;
