import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { AuthContext } from "./AuthContext";
import "./SignUp.css";

const LogIn = () => {
  const { setUserId } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      return setError("Please fill in all fields.");
    }

    try {
      await apiFetch("/api/signin", {
        method: "POST",
        body: { email, password },
      });
      const session = await apiFetch("/api/check-session");
      setUserId(session.userId);
      navigate("/home");
    } catch (err) {
      setError(err.error || "Login failed.");
    }
  };

  return (
    <div className="SignUpContainer">
      <div className="SignUpLeftHalf">
        <img
          src="https://storage.googleapis.com/noiz-assets/signup_pic.svg"
          alt="Login"
          className="SignUpImage"
        />
      </div>
      <div className="SignUpRightHalf">
        <div className="SignUpBeginText">
          <h2>Log In</h2>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" id="log-in">
              Sign Up
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="SignUpForm">
          <div className="SignUpFormGroup">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="SignUpInput"
            />
          </div>
          <div className="SignUpFormGroup">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
              className="SignUpInput"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="SignUpGradientButton">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
