import React from "react";
import detail from "../css/detail.module.css";
import { FaStar } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Product from "./Product";

const ProductDetail = () => {
  return (
    <>
      <div className={detail.container}>
        <div className={detail.image__carousel}>
          <div className={detail.image__wrapper}>
            <img
              src="http://127.0.0.1:8000/images/atletico_madrid_1.jpeg"
              alt="product"
            />
          </div>
          <div className={detail.image__wrapper}>
            <img
              src="http://127.0.0.1:8000/images/atletico_madrid_1.jpeg"
              alt="product"
            />
          </div>
          <div className={detail.image__wrapper}>
            <img
              src="http://127.0.0.1:8000/images/atletico_madrid_1.jpeg"
              alt="product"
            />
          </div>
          <IoIosArrowForward />
        </div>
        <div className={detail.content__wrapper}>
          <div className={detail.brand}>
            <img src="http://127.0.0.1:8000/images/nike.png" />
          </div>

          <div className={detail.content}>
            <div className={detail.header}>
              <h3 className={detail.title}>
                Atletico Madrid Home Jersey 2021/22
              </h3>
              <div className={detail.desc}>
                <p className={detail.category}>Football</p>
                <p className={detail.rating}>
                  <FaStar />
                  <span>4.5</span>
                  <span>(1200 Reviews)</span>
                </p>
              </div>

              <p className={detail.price}>$59.66</p>
            </div>

            <div className={detail.size}>
              <p className={detail.size__head}>
                Select Size <span>Size Guide</span>{" "}
              </p>

              <div className={detail.size__wrapper}>
                <label
                  className={`${detail.size__box} ` + `${detail.active}`}
                  htmlFor="S"
                >
                  <input type="radio" name="size" value="S" id="S" />
                  <span>S</span>
                </label>
                <label className={detail.size__box} htmlFor="M">
                  <input type="radio" name="size" value="M" id="M" />
                  <span>M</span>
                </label>
                <label className={detail.size__box} htmlFor="L">
                  <input type="radio" name="size" value="L" id="L" />
                  <span>L</span>
                </label>
                <label className={detail.size__box} htmlFor="XL">
                  <input type="radio" name="size" value="XL" id="XL" />
                  <span>XL</span>
                </label>
              </div>
            </div>
            <div className={detail.btn__wrapper}>
              <button className={detail.add__cart}>Add to bag</button>
              <button className={detail.favorite}>Favorite</button>
            </div>
          </div>
        </div>
      </div>
      {/*
        #TODO :  ##  ADD A DESCRIPTION 
        #TODO2 :  ##  ADD A Product suggestion below 
      
      <div>
        <Product />
      </div> */}
    </>
  );
};

export default ProductDetail;
