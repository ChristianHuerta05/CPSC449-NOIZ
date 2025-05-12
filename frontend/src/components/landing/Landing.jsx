import React, { useState, useEffect } from "react";
import LandingHeader from "./LandingHeader";
import LandingTitle from "./LandingTitle";
import SongsCarousel from "./SongsCarousel";
import PixelBackground from "./PixelBackground";

import "./Landing.css";

const Landing = () => {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
    console.log("scrolling");
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () =>
      window.removeEventListener("scroll", handleScroll, { passive: true });
  }, []);

  return (
    <div className="main-landing-container">
      <div className="hero-container">
        <div
          className="hero-content-container"
          style={{ display: "flex", flexDirection: "column", width: "100dvw" }}
        >
          <PixelBackground />
          <LandingHeader />
          <LandingTitle offsetY={offsetY} />
          <div className="spacer" />
          <SongsCarousel />
        </div>
      </div>
    </div>
  );
};

export default Landing;
