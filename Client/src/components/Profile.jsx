import React from "react";
import profile from "../css/profile.module.css";
import img from "../assets/1.jpg";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineUploadFile } from "react-icons/md";

const Profile = () => {
  return (
    <main className={profile.main}>
      <section className={profile.container}>
        <aside className={profile.left}>
          <div className={profile.infos}>
            <img src={img} alt="profil" />
            <div className={profile.text}>
              <h4>Hi, Pristina</h4>
              <p>Member since 2022</p>
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
              <img src={img} alt="profile" />
              <label htmlFor="img">
                <input type="file" name="file" id="img" hidden />
                <span> Upload Photo (Max 1 Mb)</span> <MdOutlineUploadFile />
              </label>
            </div>
          </div>
          <form action="#" className={profile.edit}>
            <div className={profile.form__grp}>
              <label>First name</label>
              <input type="text" />
            </div>
            <div className={profile.form__grp}>
              <label>last name</label>
              <input type="text" />
            </div>
            <div className={profile.form__grp}>
              <label>Address</label>
              <input type="text" />
            </div>
            <div className={profile.form__grp}>
              <label>Postal code</label>
              <input type="text" />
            </div>
            <div className={profile.form__grp}>
              <label>Province/State</label>
              <input type="text" />
            </div>
            <div className={profile.save}>
              <button>Save</button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
};

export default Profile;
