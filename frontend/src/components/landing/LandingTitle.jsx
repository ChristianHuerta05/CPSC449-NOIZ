import React from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";
const LandingTitle = ({ offsetY }) => {
  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate("/Signup");
  };

  return (
    <section className="landing-title-container">
      <h1
        className="gradient-text"
        style={{ transform: `translateY(${offsetY * 0.2}px)` }}
      >
        More than just noise - <i>it's music</i>
      </h1>

      <button
        className="discover-button"
        style={{ transform: `translateY(${offsetY * 0.15}px)` }}
      >
        <span className="gradient-text-button" onClick={handleSignIn}>
          Discover
        </span>
      </button>

      <img
        src="https://storage.googleapis.com/noiz-assets/disk.png"
        alt="Decorative disk"
        className="parallax-image disk"
        style={{ transform: `translateY(${offsetY * 0.09}px)` }}
      />

      <img
        src="https://storage.googleapis.com/noiz-assets/lines.png"
        alt="Decorative lines"
        className="parallax-image lines"
        style={{ transform: `translateY(${offsetY * 0.05}px)` }}
      />

      <img
        src="https://storage.googleapis.com/noiz-assets/disk-reverse.png"
        alt="Decorative reversed disk"
        className="parallax-image disk-reverse"
        style={{ transform: `translateY(${offsetY * 0.07}px)` }}
      />
    </section>
  );
};

export default LandingTitle;
