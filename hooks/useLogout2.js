import { useState } from "react";
import axios from "axios";

const useLogout = () => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutDialogOpen = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogout = async () => {
    const role = localStorage.getItem("role");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (role && accessToken && refreshToken) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/admins/logout`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            data: { refreshToken },
          }
        );

        if (response.status === 200) {
          localStorage.removeItem("role");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/admins/login";
        }
      } catch (error) {
        console.error(error);
      }
    }

    setLogoutDialogOpen(false);
  };

  return {
    logoutDialogOpen,
    handleLogoutDialogOpen,
    handleLogoutDialogClose,
    handleLogout,
  };
};

export default useLogout;
