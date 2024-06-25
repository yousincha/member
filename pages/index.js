import React from "react";
import { Container, Typography, Box } from "@mui/material";

import styles from "./styles/HomePage.module.css";

const HomePage = () => {
  return (
    <div>
      <Container className={styles.container}>
        <Typography
          variant="h4"
          gutterBottom
          className={styles.banner}
          fontWeight="bold"
          textAlign={"center"}
        >
          CozyCorner
        </Typography>
        <Box className={styles.imageContainer}>
          <img
            src="https://cdn.pixabay.com/photo/2019/02/08/14/54/relaxation-3983334_1280.jpg"
            alt="쇼핑몰 이미지"
            className={styles.bannerImage}
          />
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
