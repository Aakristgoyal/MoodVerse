import { Link } from "react-router-dom";
import "../styles/aiWidget.css";

export default function AIWidget() {
  return (
    <section className="ai-section">

      <div className="ai-container">

        <span className="ai-tag">
          🤖 AI-Powered Book Discovery
        </span>

        <h2>
          Let MoodVerse AI Find Your Next Great Read
        </h2>

        <p>
          Whether you're looking for motivation,
          adventure, romance, or comfort, MoodVerse AI
          analyzes your preferences and reading goals
          to recommend books tailored specifically to you.
        </p>

        <div className="ai-features">

          <div className="ai-feature-card">
            🎭 Mood-Based Recommendations
          </div>

          <div className="ai-feature-card">
            📚 Personalized Reading Suggestions
          </div>

          <div className="ai-feature-card">
            🔍 Discover Hidden Gems
          </div>

          <div className="ai-feature-card">
            ⚡ Instant AI Assistance
          </div>

        </div>

        <Link
          to="/ai-assistant"
          className="ai-button"
        >
          Open AI Assistant
        </Link>

      </div>

    </section>
  );
}