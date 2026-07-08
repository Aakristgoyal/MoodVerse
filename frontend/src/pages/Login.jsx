import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import logo from "../assets/logo.jpeg";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
        {
          withCredentials: true
        }
      );
      console.log(res.data);
      navigate("/");
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
            Welcome Back
          </h1>
          <p>
            Continue your reading journey,
            discover books that match your mood,
            and reconnect with the MoodVerse community.
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
            Sign In to Your Moodverse Account
          </h2>
          <form className="auth-form" onSubmit={handleSubmit}>
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
            <Link
              to="/forgot-password"
              className="forgot-link"
            >
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="auth-btn"
            >
              Sign In
            </button>
          </form>
          <p className="auth-switch">
            Don't have an account?
            <Link to="/signup">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}