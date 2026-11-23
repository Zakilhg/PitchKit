import { useState } from "react";
import hero from "../css/hero.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = ["hero.jpg", "hero2.jpg", "hero3.jpg"].map(
    (file) => `${import.meta.env.BASE_URL}img/${file}`,
  );

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
      <img src={images[currentIndex]} alt="Football players wearing club jerseys" />
      <div className={hero.arrows}>
        <button type="button" className={hero.left} onClick={handlePrevious} aria-label="Previous image">
          <FaArrowLeft aria-hidden="true" />
        </button>
        <button type="button" className={hero.right} onClick={handleNext} aria-label="Next image">
          <FaArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
