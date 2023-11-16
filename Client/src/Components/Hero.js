import React, { useState, useEffect } from "react";
import "./hero.css";

const images = [
  "../image/hero.png",
  "../image/hero2.png",
  "../image/hero3.png",
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPreviousImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(goToNextImage, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="main">
      <div className="hero-container">
        <div className="hero" align="center">
          <img
            src={images[currentIndex]}
            alt="Summer Collection"
            className="hero-image"
          />
          <button className="shop-now-button">SHOP NOW</button>
          <button className="left-button" onClick={goToPreviousImage}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <button className="right-button" onClick={goToNextImage}>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
