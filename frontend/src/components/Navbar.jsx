import { Link } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.jpeg";
import "../styles/navbar.css";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

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
      </nav>

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

      </div>

    </header>
  );
}