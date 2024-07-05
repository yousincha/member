import React from "react";
import { Container, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "./styles/HomePage.module.css";

const HomePage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const images = [
    "https://cdn.pixabay.com/photo/2017/08/05/12/19/dress-2583113_1280.jpg",
    "https://cdn.pixabay.com/photo/2021/10/03/14/29/scarves-6678139_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/02/08/02/56/booties-2047596_1280.jpg",
  ];

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
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className={styles.imageContainer}>
              <img
                src={image}
                alt={`쇼핑몰 이미지 ${index}`}
                className={styles.bannerImage}
              />
            </div>
          ))}
        </Slider>
      </Container>
    </div>
  );
};

export default HomePage;
