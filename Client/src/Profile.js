import React, { useEffect, useState } from "react";
import "./profile.css";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Home from "./Home";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [adresse, setAdress] = useState("");
  const [code, setCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = localStorage.getItem("id");

        if (id) {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/user/${id}`
          );

          setUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="loader loader--style2" title="1">
        <svg
          version="1.1"
          id="loader-1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="40px"
          height="40px"
          viewBox="0 0 50 50"
          style={{ enableBackground: "new 0 0 50 50" }}
          xmlSpace="preserve"
        >
          <path
            fill="#000"
            d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    );
  }

  // const handleClick = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put(
  //       `http://127.0.0.1:8000/api/user/${user.id}`,
  //       {
  //         first_name: first,
  //         last_name: last,
  //         adresse: adresse,
  //         country: country,
  //         city: city,
  //         code_postale: code,
  //         image: image,
  //       }
  //     );

  //     console.log(response.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("first_name", first);
      formData.append("last_name", last);
      formData.append("adresse", adresse);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("code_postale", code);
      formData.append("image", image);

      console.log("Form Data:", formData); // Check if the image is included correctly

      const response = await axios.put(
        `http://127.0.0.1:8000/api/user/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct Content-Type header
          },
        }
      );

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-options">
        <div className="image-option">
          <img
            src={`http://127.0.0.1:8000/profile/${user.image}`}
            alt="prfl"
            className="profile-image"
          />
          <div className="infos">
            <h2>Hi,&nbsp; {user.username}</h2>
            <p>Member since {user.created_at.split("-")[0]}</p>
          </div>
        </div>
        <div className="edit-items">
          <div className="edit-options">
            <h4>Edit Account</h4>
            <img
              src="../../image/angle-right.svg"
              className="angle-right"
              alt="angle"
            />
          </div>
          <div className="edit-options">
            <h4>Orders</h4>
            <img
              src="../../image/angle-right.svg"
              className="angle-right"
              alt="angle"
            />
          </div>
          <div className="edit-options">
            <h4>Favorites</h4>
            <img
              src="../../image/angle-right.svg"
              className="angle-right"
              alt="angle"
            />
          </div>
          <div className="edit-options">
            <h4>Setting</h4>
            <img
              src="../../image/angle-right.svg"
              className="angle-right"
              alt="angle"
            />
          </div>
          <div className="edit-options">
            <h4>Logout</h4>
            <img
              src="../../image/angle-right.svg"
              className="angle-right"
              alt="angle"
            />
          </div>
        </div>
      </div>

      <div className="edit-infos">
        <h1 className="section-title">Edit Account</h1>
        <div className="edit-img">
          <img
            src={`http://127.0.0.1:8000/profile/${user.image}`}
            alt="prfl"
            className="profile-image"
          />
          <div className="upload-box">
            <input
              type="file"
              accept="image/*"
              className="upload-input"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <p className="upload-text">Upload Photo</p>
            <img
              className="upload-icon"
              src="../../image/file.svg"
              alt="upload"
            />
          </div>
        </div>
        <div className="input-containers">
          <label className="label-text">First Name</label>
          <input
            className="input-text"
            type="text"
            name="first_name"
            value={user.first_name}
            onChange={(e) => setFirst(e.target.value)}
          />
        </div>

        <div className="input-containers">
          <label className="label-text">Last Name</label>
          <input
            className="input-text"
            type="text"
            name="last_name"
            value={user.last_name}
            onChange={(e) => setLast(e.target.value)}
          />
        </div>

        <div className="input-containers">
          <label className="label-text">Address</label>
          <input
            className="input-text"
            type="text"
            name="adresse"
            value={user.adresse}
            onChange={(e) => setAdress(e.target.value)}
          />
        </div>

        <div className="splitted-containers">
          <div className="splitted-input">
            <label className="label-text">Postal Code</label>
            <input
              value={user.code_postale}
              onChange={(e) => setCode(e.target.value)}
              className="input-text"
              type="text"
              name="code_postale"
              style={{ width: "240px" }}
            />
          </div>
          <div className="splitted-input">
            <label className="label-text">City</label>
            <input
              value={user.city}
              onChange={(e) => setCity(e.target.value)}
              className="input-text"
              type="text"
              name="city"
              style={{ width: "240px" }}
            />
          </div>
        </div>

        <div className="input-containers">
          <label className="label-text">Country</label>
          <input
            className="input-text"
            type="text"
            name="country"
            value={user.country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <button className="save" onClick={handleClick}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Profile;
