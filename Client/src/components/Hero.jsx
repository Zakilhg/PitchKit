import React, { useState } from "react";
import hero from "../css/hero.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = ["./img/hero.jpg", "./img/hero2.jpg", "./img/hero3.jpg"];

  const handleNext = () => {
    if (currentIndex === images.length - 1) {
      return setCurrentIndex(0);
    }

    setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex === 0) {
      return setCurrentIndex(images.length - 1);
    }

    setCurrentIndex(currentIndex - 1);
  };

  return (
    <section className={hero.hero__container}>
      <img src={images[currentIndex]} alt="image" />
      <div className={hero.arrows}>
        <div className={hero.left} onClick={handlePrevious}>
          <FaArrowLeft />
        </div>
        <div className={hero.right} onClick={handleNext}>
          <FaArrowRight />
        </div>
      </div>
    </section>
  );
};

export default Hero;
