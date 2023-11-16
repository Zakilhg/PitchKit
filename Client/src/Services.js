import React from "react";
import "./services.css";

const Card = ({ image, title, slogan }) => {
  return (
    <div className="card">
      <div className="services-image">
        <img
          src={image}
          alt={title}
          style={{ width: "65px", opacity: "0.5" }}
        />
      </div>
      <div className="services-content">
        <h3 style={{ marginTop: "20px" }}>{title}</h3>
        <p>{slogan}</p>
      </div>
    </div>
  );
};

const Services = () => {
  const cardsData = [
    {
      image: "../../image/bag.png",
      title: "Free shipping",
      slogan: "Free of shipping worldwide with applicable conditions.",
    },
    {
      image: "../../image/verified.png",
      title: "Secure payments",
      slogan: "Payment with a guaranteed level of security. ",
    },
    {
      image: "../../image/leaf.png",
      title: "Best Quality",
      slogan: "Our product is made from at least 75% recycled fibres.",
    },
  ];

  return (
    <>
      <div className="card-container">
        {cardsData.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </>
  );
};

export default Services;
