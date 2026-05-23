import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import "../styles/footer.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-brand">
        <img
          src={logo}
          alt="MoodVerse"
          className="footer-logo"
        />

        <h3>MoodVerse</h3>
      </div>

      <p className="footer-tagline">
        Every mood deserves the perfect book.
      </p>

      <p className="footer-description">
        Discover meaningful stories through
        personalized reading experiences
        designed around how you feel.
      </p>

      <div className="footer-links">
        <Link to="/contact">
          Contact
        </Link>

        <Link to="/privacy-policy">
          Privacy Policy
        </Link>

        <Link to="/terms">
          Terms of Service
        </Link>
      </div>

      <div className="footer-socials">

        <a
          href="https://github.com/Aakristgoyal"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub />
          <span>GitHub</span>
        </a>

        <a
          href="https://www.linkedin.com/in/aakristgoyal"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin />
          <span>LinkedIn</span>
        </a>

      </div>

      <div className="footer-bottom">
        <p>© 2026 MoodVerse</p>

      </div>

    </footer>
  );
}