import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { AuthContext } from "./AuthContext";
import "./SignUp.css";

const SignUp = () => {
  const { setUserId } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, agreeToTerms } = formData;
    if (!firstName || !lastName || !email || !password) {
      return setError("Please fill in all fields.");
    }
    if (!agreeToTerms) {
      return setError("Please agree to the terms and conditions.");
    }

    try {
      await apiFetch("/api/signup", {
        method: "POST",
        body: { firstName, lastName, email, password },
      });

      const session = await apiFetch("/api/check-session");
      setUserId(session.userId);
      navigate("/connect-spotify");
    } catch (err) {
      setError(err.error || "Sign-up failed.");
    }
  };

  return (
    <div className="SignUpContainer">
      <div className="SignUpLeftHalf">
        <img
          src="https://storage.googleapis.com/noiz-assets/signup_pic.svg"
          alt="Signup"
          className="SignUpImage"
        />
      </div>
      <div className="SignUpRightHalf">
        <div className="SignUpBeginText">
          <h2>Create an account</h2>
          <p>
            Already have an account?{" "}
            <Link to="/login" id="log-in">
              Log in
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="SignUpForm">
          <div className="SignUpNameGroup">
            <div className="SignUpNameField">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="SignUpInput"
              />
            </div>
            <div className="SignUpNameField">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="SignUpInput"
              />
            </div>
          </div>

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
          <div className="SignUpCheckboxGroup">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeToTerms">
              I agree to the terms &amp; conditions
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button
            type="submit"
            className="SignUpGradientButton"
            disabled={!formData.agreeToTerms}
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
