import "../styles/aiWidget.css";

export default function AIWidget() {
  return (
    <section className="ai-section">

      <div className="ai-container">

        <span className="ai-tag">
          🤖 AI Recommendation Assistant
        </span>

        <h2>
          Ask MoodVerse AI
        </h2>

        <p>
          Describe your mood, favorite genre,
          or the kind of story you're looking for.
          Our AI will help you discover the perfect book.
        </p>

        <div className="ai-search-box">

          <input
            type="text"
            placeholder="I need a motivational book for exam stress..."
          />

          <button>
            Get Recommendations
          </button>

        </div>

        <div className="prompt-container">

          <h4>Popular Prompts</h4>

          <div className="prompt-grid">

            <div className="prompt-card">
              📚 Recommend a fantasy adventure
            </div>

            <div className="prompt-card">
              🔍 I want a mystery with plot twists
            </div>

            <div className="prompt-card">
              🚀 Suggest books for productivity
            </div>

            <div className="prompt-card">
              ⚡ Something like Harry Potter
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}