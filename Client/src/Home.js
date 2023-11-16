import React from "react";
import Hero from "./Components/Hero";
import Brands from "./Components/Brands";
import Collection from "./Collection";
import Services from "./Services";
import Popular from "./Popular";

const Home = () => {
  return (
    <>
      <Hero />
      <Brands />
      <Collection />
      <Services />
      <Popular />
    </>
  );
};

export default Home;
