import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import logo from "../assets/logo.jpeg";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signup",
        formData,
        {
          withCredentials: true
        }
      );
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message
      );
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        {/* Left Side */}
        <div className="auth-branding">
          <Link
            to="/"
            className="back-home"
          >
            ← Back to Home
          </Link>
          <div className="auth-logo">
            <img
              src={logo}
              alt="MoodVerse"
            />
          </div>
          <h1>
            Join MoodVerse
          </h1>
          <p>
            Discover books based on your mood,
            connect with fellow readers,
            and build your personal reading space.
          </p>
          <div className="auth-features">
            <div className="feature-item">
              📖 Mood-Based Recommendations
            </div>
            <div className="feature-item">
              🤖 AI Reading Companion
            </div>
            <div className="feature-item">
              👥 Reader Community
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="auth-form-container">
          <h2>
            Create Account
          </h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value
                })
              }
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value
                })
              }
            />
            <label className="terms-label">
              <input type="checkbox" />
              <span>
                I agree to the{" "}
                <Link to="/terms">
                  Terms & Conditions
                </Link>
                {" "}and{" "}
                <Link to="/privacy">
                  Privacy Policy
                </Link>
              </span>
            </label>
            <button
              type="submit"
              className="auth-btn"
            >
              Create Account
            </button>
          </form>
          <p className="auth-switch">
            Already have an account?
            <Link to="/login">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}