import { Link } from "react-router-dom";
import "../styles/personalizedRecommendations.css";

export default function PersonalizedRecommendations() {

    // Replace later with actual auth state
    const isLoggedIn = false;

    const recommendedBooks = [
        "Atomic Habits",
        "Deep Work",
        "The Alchemist",
        "Ikigai"
    ];

    if (isLoggedIn) {
        return (
            <section className="personalized-section">

                <div className="personalized-container">

                    <span className="personalized-tag">
                        ✨ Recommended For You
                    </span>

                    <h2>
                        Personalized Picks Based On Your Interests
                    </h2>

                    <p>
                        These recommendations are generated
                        using your reading history, favorite genres,
                        moods and saved books.
                    </p>

                    <div className="recommendation-list">

                        {recommendedBooks.map((book) => (
                            <div
                                key={book}
                                className="recommendation-item"
                            >
                                📚 {book}
                            </div>
                        ))}

                    </div>

                </div>

            </section>
        );
    }

    return (
        <section className="personalized-section">

            <div className="personalized-container">

                <span className="personalized-tag">
                    ✨ Personalized Recommendations
                </span>

                <h2>
                    Recommendations That Get Better With Every Book
                </h2>

                <p>
                    Create a free MoodVerse account to unlock
                    recommendations tailored to your reading history,
                    favorite genres, moods and interests.
                    The more you read and explore,
                    the better your recommendations become.
                </p>

                <div className="personalized-features">

                    <div className="personalized-feature">
                        📚 Based On Your Reading History
                    </div>

                    <div className="personalized-feature">
                        🎭 Learns Your Favorite Moods
                    </div>

                    <div className="personalized-feature">
                        ❤️ Tracks Preferred Genres
                    </div>

                    <div className="personalized-feature">
                        🔍 Discovers Books You'll Enjoy
                    </div>

                </div>

                <div className="locked-badge">
                    🔒 Available For Registered Users
                </div>

                <Link
                    to="/signup"
                    className="unlock-btn"
                >
                    Create Free Account
                </Link>

            </div>

        </section>
    );
}