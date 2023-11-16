import React, { useState, useEffect } from "react";
import axios from "axios";

import "./Brands.css";
import { Link } from "react-router-dom";

const Brands = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/brand")
      .then((response) => {
        setBrands(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <section id="feature" class="section-p1">
        {brands.slice(0, 6).map((brand) => (
          <div class="fe-box" key={brand.id}>
            <Link to={`/brand`}>
              <img src={`http://127.0.0.1:8000/images/${brand.image}`} alt="" />
            </Link>
          </div>
        ))}
      </section>
    </>
  );
};

export default Brands;
