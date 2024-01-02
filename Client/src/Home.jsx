import React from "react";
import Hero from "./components/Hero";
import Collection from "./components/Collection";
import Features from "./components/Features";
import Popular from "./components/Popular";

const Home = () => {
  return (
    <>
      <Hero />
      <Collection />
      <Features />
      <Popular />
    </>
  );
};

export default Home;
