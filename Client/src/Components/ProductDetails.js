import React, { useState, useEffect } from "react";
import "./ProductDetails.css";
import axios from "axios";
import { SideBySideMagnifier } from "react-image-magnifiers";
import { useParams } from "react-router-dom";
import MightAlso from "../MightAlso";

const ProductDetails = ({ handleClick }) => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/jersey/${id}`)
      .then((response) => {
        setProduct(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  return (
    <>
      <div className="container" style={{ marginTop: "57px" }}>
        <div className="row">
          <div className="d-flex product-container" style={{ gap: "15px" }}>
            <div className="col-md-6">
              <div id="image-slider" className="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <div className="thumbnail-container">
                      <SideBySideMagnifier
                        imageSrc={`http://127.0.0.1:8000/images/${product.image}`}
                        imageAlt="Image1"
                        alwaysInPlace="true"
                      />
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="thumbnail-container">
                      <SideBySideMagnifier
                        imageSrc={`http://127.0.0.1:8000/images/${product.image1}`}
                        imageAlt="Image1"
                        alwaysInPlace="true"
                      />
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="thumbnail-container">
                      <SideBySideMagnifier
                        imageSrc={`http://127.0.0.1:8000/images/${product.image2}`}
                        imageAlt="Image1"
                        alwaysInPlace="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="image-selection">
                <img
                  src={`http://127.0.0.1:8000/images/${product.image}`}
                  className={`image-thumbnail ${
                    selectedImage === 0 ? "active" : ""
                  }`}
                  alt="Image1"
                  data-target="#image-slider"
                  data-slide-to="0"
                  onClick={() => handleImageClick(0)}
                />
                <img
                  src={`http://127.0.0.1:8000/images/${product.image1}`}
                  className={`image-thumbnail ${
                    selectedImage === 1 ? "active" : ""
                  }`}
                  alt="Image2"
                  data-target="#image-slider"
                  data-slide-to="1"
                  onClick={() => handleImageClick(1)}
                />
                <img
                  src={`http://127.0.0.1:8000/images/${product.image2}`}
                  className={`image-thumbnail ${
                    selectedImage === 2 ? "active" : ""
                  }`}
                  alt="Image3"
                  data-target="#image-slider"
                  data-slide-to="2"
                  onClick={() => handleImageClick(2)}
                />
              </div>
            </div>

            <div className="col-md-7">
              <img
                src={`http://127.0.0.1:8000/images/${product.brand_image}`}
                alt={product.brand_name}
                className="brand"
              />
              <h2 className="product-title" style={{ fontSize: "33px" }}>
                {product.name}
              </h2>
              <p className="text-muted">Football</p>
              <p className="product-price">{product.price} $</p>
              <hr style={{ borderTop: "1px solid " }} />

              <div
                className="input-group"
                style={{ width: "19%", border: " solid 1px grey" }}
              >
                <span className="input-group-prepend">
                  <button
                    className="btn"
                    type="button"
                    id="quantity-minus"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={quantity}
                  min="1"
                  style={{
                    border: "none",
                    outline: "none",
                    textAlign: "center",
                  }}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />

                <span className="input-group-append">
                  <button
                    className="btn"
                    type="button"
                    id="quantity-plus"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </span>
              </div>
              <br />
              <div className="size-options" style={{ flexDirection: "column" }}>
                <p htmlFor="size">Select size:</p>
                <div className="options">
                  <input type="radio" id="size-s" name="size" value="s" />
                  <label htmlFor="size-s">S</label>
                  <input type="radio" id="size-m" name="size" value="m" />
                  <label htmlFor="size-m">M</label>
                  <input type="radio" id="size-l" name="size" value="l" />
                  <label htmlFor="size-l">L</label>
                  <input type="radio" id="size-xl" name="size" value="xl" />
                  <label htmlFor="size-xl">XL</label>
                  <input type="radio" id="size-xxl" name="size" value="xxl" />
                  <label htmlFor="size-xxl">XXL</label>
                </div>
              </div>

              <div className="center-button">
                <button className="Ajouter" onClick={handleClick}>
                  AJOUTER AU PANIER
                </button>
                <button className="Fav">ADD TO FAVORITE</button>
              </div>
            </div>
          </div>

          <table className="description">
            <h4>Description</h4>
            <tbody>
              <tr>
                <th>Team</th>
                <td>{product.club_name}</td>
              </tr>

              <tr>
                <th>Season</th>
                <td>2022/2023</td>
              </tr>

              <tr>
                <th>Type</th>
                <td>Home</td>
              </tr>

              <tr>
                <th>Brand</th>
                <td>{product.brand_name}</td>
              </tr>

              <tr>
                <th>League</th>
                <td>{product.league_name}</td>
              </tr>

              <tr>
                <th>Rating</th>
                <td>
                  <i class="fa-solid fa-star" style={{ color: "#000000" }}></i>
                  <i class="fa-solid fa-star" style={{ color: "#000000" }}></i>
                  <i class="fa-solid fa-star" style={{ color: "#000000" }}></i>
                  <i class="fa-solid fa-star" style={{ color: "#000000" }}></i>
                  <i class="fa-solid fa-star" style={{ color: "grey" }}></i>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="container mt-4">
            <h2>You Might Also Like</h2>
            <br />
            <MightAlso />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
