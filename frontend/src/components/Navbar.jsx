import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.jpeg";
import "../styles/navbar.css";
import { UserCircle } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/auth/me",
          {
            withCredentials: true
          }
        );
        if (res.data.loggedIn) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true
        }
      );
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (

    <header className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img
            src={logo}
            alt="MoodVerse Logo"
          />
        </Link>
      </div>
      {/* Desktop Navigation */}
      <nav className="navbar-center">
        <Link to="/discover">
          Discover
        </Link>
        <Link to="/ai-assistant">
          AI Assistant
        </Link>
        <Link to="/community">
          Community
        </Link>
        <Link to="/library">
          Library
        </Link>
      </nav>
      {/* Desktop Actions */}
      <div className="navbar-actions">
        {
          user ? (
            <div className="user-profile">
              <Link
                to="/profile"
                className="profile-btn"
              >
                <UserCircle size={24} />
              </Link>

            </div>
          ) : (
            <Link
              to="/login"
              className="login-btn"
            >
              Sign In
            </Link>
          )
        }
      </div>
      {/* Hamburger */}
      <button
        className="menu-toggle"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >
        {menuOpen ? <HiX /> : <HiMenu />}
      </button>
      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${menuOpen ? "active" : ""
          }`}
      >
        <Link
          to="/discover"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Discover
        </Link>
        <Link
          to="/ai-assistant"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          AI Assistant
        </Link>
        <Link
          to="/community"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Community
        </Link>
        <Link
          to="/library"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Library
        </Link>
        {
          user ? (
            <Link
              to="/profile"
            >
              My Account
            </Link>
          ) : (
            <Link
              to="/login"
              className="auth-btn-mobile"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          )
        }
      </div>
    </header>
  );
}