import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">

      {/* Left - Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="MoodVerse Logo" />
        </Link>
      </div>

      {/* Center - Main Navigation */}
      <nav className="navbar-center">
        <Link to="/discover">Discover</Link>

        <Link to="/ai-assistant">
          AI Assistant
        </Link>

        <Link to="/community">
          Community
        </Link>
      </nav>

    </header>
  );
}