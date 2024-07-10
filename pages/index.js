import React, { useState, useEffect, useRef } from "react";
import { Container, Typography } from "@mui/material";
import styles from "./styles/HomePage.module.css";

const HomePage = () => {
  const images = [`/main1.jpg`, `/main2.jpg`, `/main3.jpg`];
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideInterval = useRef(null);

  useEffect(() => {
    startSlideShow();
    return () => stopSlideShow();
  }, []);

  const startSlideShow = () => {
    slideInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
  };

  const stopSlideShow = () => {
    clearInterval(slideInterval.current);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    stopSlideShow();
    startSlideShow();
  };

  return (
    <div className={styles.main}>
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
        <div className={styles.slider}>
          <div
            className={styles.slides}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className={styles.slide}>
                <img
                  src={image}
                  alt={`쇼핑몰 이미지 ${index}`}
                  className={styles.bannerImage}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.dots}>
          {images.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${
                currentIndex === index ? styles.active : ""
              }`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
