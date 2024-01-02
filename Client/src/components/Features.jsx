import React from "react";
import { FaShippingFast } from "react-icons/fa";
import features from "../css/features.module.css";
import { GoShieldCheck } from "react-icons/go";
import { LuLeaf } from "react-icons/lu";

const Features = () => {
  return (
    <section className={features.container}>
      <div className={features.item}>
        <FaShippingFast className={features.icon} />
        <h3>Free Shipping</h3>
        <p>Free of shipping worldwide with applicable conditions.</p>
      </div>
      <div className={features.item}>
        <GoShieldCheck className={features.icon} />
        <h3>Free Shipping</h3>
        <p>Payment with a guaranteed level of security. </p>
      </div>
      <div className={features.item}>
        <LuLeaf className={features.icon} />
        <h3>Free Shipping</h3>
        <p>Our product is made from at least 75% recycled fibres.</p>
      </div>
    </section>
  );
};

export default Features;
