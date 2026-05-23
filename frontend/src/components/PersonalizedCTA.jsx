import "../styles/personalizedCTA.css";

export default function PersonalizedCTA() {
  return (
    <section className="personalized-cta">

      <div className="cta-container">

        <div className="cta-content">

          <span className="cta-tag">
            ✨ Personalized Reading Experience
          </span>

          <h2>
            Unlock Recommendations Made Just For You
          </h2>

          <p>
            Create your free MoodVerse account and
            discover books tailored to your moods,
            reading preferences, and favorite genres.
          </p>

          <div className="cta-features">

            <div>📚 Personalized Book Suggestions</div>
            <div>🎭 Mood-Based Recommendations</div>
            <div>📖 Reading Progress Tracking</div>
            <div>☁️ Save Books To Your Library</div>

          </div>

          <button className="cta-button">
            Get Started
          </button>

        </div>

      </div>

    </section>
  );
}