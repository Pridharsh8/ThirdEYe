import React from "react";
import Header from "./Header";
import Categories from "./Categories";
import Features from "./Features";
import HeroSection from "./HeroSection";

const Home = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <Categories />
      <Features />
    </div>
  );
};

export default Home;
