import React, { useState, useEffect } from "react";
import "./MightAlso.css";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

const MightAlso = () => {
  const [products, setProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/jersey")
      .then((response) => {
        const updatedProducts = response.data.map((product) => ({
          ...product,
          favorite: false,
        }));
        setProducts(updatedProducts);
        setFavoriteProducts(Array(response.data.length).fill(false));
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClick = (index) => {
    setFavoriteProducts((prevFavoriteProducts) => {
      const updatedFavoriteProducts = [...prevFavoriteProducts];
      updatedFavoriteProducts[index] = !updatedFavoriteProducts[index];
      return updatedFavoriteProducts;
    });
  };

  const handleLinkClick = (productId) => {
    const pathWithoutId = window.location.pathname.replace(
      `/p/${productId}`,
      ""
    );
    window.history.pushState(null, "", pathWithoutId);
  };

  return (
    <>
      <div className="row" style={{ flexWrap: "nowrap", overflow: "hidden" }}>
        {products.slice(30, 34).map((product, index) => (
          <div className="col-md-6 col-lg-3 mb-4" key={index}>
            <div className="card">
              <div className="image-container">
                <Link
                  to={`/p/${product.id}`}
                  onClick={() => handleLinkClick(product.id)}
                >
                  <img
                    src={`http://127.0.0.1:8000/images/${product.image}`}
                    className="card-img-top-m"
                    alt="CardImage"
                  />
                </Link>

                <div className="overlay">
                  <button className="add-to-bag-btn">Add to bag</button>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">Football jersey</p>
                <p className="card-text">{product.price} $</p>
                <button
                  className="heart-btn-m"
                  onClick={() => handleClick(index)}
                >
                  <i
                    className={`fa-heart ${
                      favoriteProducts[index] ? "fa-solid" : "fa-regular"
                    }`}
                    style={{
                      color: favoriteProducts[index] ? "red" : "",
                    }}
                  ></i>
                </button>
              </div>
              <img
                src={`http://127.0.0.1:8000/images/${product.brand_image}`}
                className="img-fluid position-absolute small-icon-m"
                id="brand"
                alt="Icon"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MightAlso;
