import React, { useEffect, useState } from "react";
import profile from "../css/profile.module.css";
import img from "../assets/1.jpg";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineUploadFile } from "react-icons/md";
import { Navigate } from "react-router-dom";

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
        console.log(id);

        if (id) {
          const response = await fetch(`http://127.0.0.1:8000/api/user/${id}`);

          if (!response.ok) {
            throw new Error("Server Response Not OK");
          }

          const data = await response.json();
          console.log(data);
          setUser(data);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    // You can render a loading spinner or some other loading indicator here
    return <div>Loading...</div>;
  }

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: first,
            last_name: last,
            adresse: adresse,
            country: country,
            city: city,
            code_postale: code,
            image: image,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server Response Not OK - ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      alert('All done !!');
      <Navigate to= "/"/>
    } catch (err) {
      console.log("Error:", err.message);
    }
  };

  return (
    <main className={profile.main}>
      <section className={profile.container}>
        <aside className={profile.left}>
          <div className={profile.infos}>
            <img
              src={`http://127.0.0.1:8000/profile/${user.image}`}
              alt="profil"
            />
            <div className={profile.text}>
              <h4>Hi, {user.username}</h4>
              <p>Member since {user.created_at.split("-")[0]}</p>
            </div>
          </div>

          <div className={profile.section__wrapper}>
            <div className={profile.section}>
              Edit Account
              <FaArrowRight />
            </div>
            <div className={profile.section}>
              Orders
              <FaArrowRight />
            </div>
            <div className={profile.section}>
              favorites
              <FaArrowRight />
            </div>
            <div className={profile.section}>
              setting
              <FaArrowRight />
            </div>
            <div className={profile.section}>
              logout
              <FaArrowRight />
            </div>
          </div>
        </aside>

        <section className={profile.right}>
          <div className={profile.heading}>
            <h3 className={profile.title}>Edit Account</h3>
            <div className={profile.img__wrapper}>
              <img
                src={`http://127.0.0.1:8000/profile/${user.image}`}
                alt="profile"
              />
              <label htmlFor="img">
                <input
                  type="file"
                  name="file"
                  id="img"
                  onChange={(e) => setImage(e.target.files[0])}
                  hidden
                />
                <span> Upload Photo (Max 1 Mb)</span> <MdOutlineUploadFile />
              </label>
            </div>
          </div>
          <form action="#" className={profile.edit}>
            <div className={profile.form__grp}>
              <label>First name</label>
              <input type="text" onChange={(e) => setFirst(e.target.value)} />
            </div>
            <div className={profile.form__grp}>
              <label>last name</label>
              <input type="text" onChange={(e) => setLast(e.target.value)} />
            </div>
            <div className={profile.form__grp}>
              <label>Address</label>
              <input type="text" onChange={(e) => setAdress(e.target.value)} />
            </div>
            <div className={profile.form__grp}>
              <label>Postal code</label>
              <input type="text" onChange={(e) => setCode(e.target.value)} />
            </div>
            <div className={profile.form__grp}>
              <label>City</label>
              <input type="text" onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className={profile.form__grp}>
              <label>Country</label>
              <input type="text" onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div className={profile.save}>
              <button onClick={handleClick}>Save</button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
};

export default Profile;
