import "../styles/hero.css";

export default function Hero() {
    return (
        <section className="hero">

            <div className="hero-left">

                <span className="hero-tag">
                    📚 AI-Powered Reading Companion
                </span>

                <h1>
                    Every Mood Deserves
                    <span> The Perfect Book</span>
                </h1>

                <p>
                    Discover books through AI-powered
                    recommendations, emotional insights,
                    and personalized reading journeys.
                </p>

                <div className="hero-buttons">

                    <button className="primary-btn">
                        Find My Next Read
                    </button>

                    <button className="secondary-btn">
                        Ask AI Assistant
                    </button>

                </div>

            </div>

            <div className="hero-right">

                <div className="recommendation-card">

                    <h3>😊 Today's Suggestions</h3>
                    <div className="book-item">
                        <h4>📘 Atomic Habits</h4>
                        <p>Self Improvement</p>
                    </div>

                    <div className="book-item">
                        <h4>📘 Deep Work</h4>
                        <p>Productivity</p>
                    </div>

                    <div className="book-item">
                        <h4>📘 The Alchemist</h4>
                        <p>Personal Growth</p>
                    </div>

                </div>

            </div>

        </section>
    );
}