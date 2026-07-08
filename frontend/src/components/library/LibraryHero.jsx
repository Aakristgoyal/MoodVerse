import { Link, useNavigate } from "react-router-dom";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function LibraryHero({ username, onUpload }) {

  const navigate = useNavigate();

  return (
    <div className="library-hero">

      <div className="hero-text">
        <span className="greeting">
          {getGreeting()}
          {username ? `, ${username}` : ""}
        </span>

        <h1>My Library</h1>

        <p>Your personal reading universe</p>
      </div>

      <div className="hero-actions">

        <button onClick={onUpload}>
          Upload Book
        </button>

        <Link
          to="/discover"
          className="secondary-btn"
        >
          Discover Books
        </Link>

      </div>

    </div>
  );
}