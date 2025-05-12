import React from "react";
import "./Landing.css";

import { useNavigate } from "react-router-dom";

const LandingHeader = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/Signup");
  };
  return (
    <header className="landing-header">
      <img
        src="https://storage.googleapis.com/noiz-assets/LOGO.svg"
        alt="Noiz Logo"
      />
      <div className="header-buttons">
        <button className="header-button" onClick={handleSignIn}>
          Sign In
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;
