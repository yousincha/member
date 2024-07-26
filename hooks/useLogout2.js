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

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/admins/refreshToken",
        {
          refreshToken,
        }
      );
      if (response.status === 200) {
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        return accessToken;
      }
    } catch (error) {
      console.error("Failed to refresh access token", error);
      return null;
    }
  };

  const handleLogout = async () => {
    const role = localStorage.getItem("role");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (role && accessToken && refreshToken) {
      try {
        let token = accessToken;

        try {
          const response = await axios.delete(
            `http://localhost:8080/admins/logout`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
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
          if (error.response && error.response.status === 401) {
            // 액세스 토큰이 만료된 경우
            token = await refreshAccessToken(refreshToken);

            if (token) {
              const retryResponse = await axios.delete(
                `http://localhost:8080/admins/logout`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  data: { refreshToken },
                }
              );

              if (retryResponse.status === 200) {
                localStorage.removeItem("role");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/admins/login";
              }
            } else {
              console.error("Failed to refresh access token");
            }
          } else {
            console.error(error);
          }
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
