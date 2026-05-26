import "../styles/communityFavourites.css";

export default function CommunityFavourites() {

    const favorites = [
        {
            title: "Atomic Habits",
            author: "James Clear",
            recommendations: 46,
            mood: "Motivated",
            genre: "Self Growth",
            insight:
                "Readers love this book for building consistent habits and improving productivity."
        },
        {
            title: "The Alchemist",
            author: "Paulo Coelho",
            recommendations: 39,
            mood: "Thoughtful",
            genre: "Fiction",
            insight:
                "Frequently recommended for readers seeking inspiration and personal growth."
        },
        {
            title: "Deep Work",
            author: "Cal Newport",
            recommendations: 28,
            mood: "Focused",
            genre: "Productivity",
            insight:
                "Popular among students and professionals looking to improve concentration."
        }
    ];
    return (
        <section className="favorites-section">
            <div className="favorites-header">
                <span className="favorites-tag">
                    🏆 Community Favorites
                </span>
                <h2>
                    Most Recommended By Readers
                </h2>
                <p>
                    Discover books that consistently earn praise
                    from the MoodVerse community.
                </p>
            </div>
            <div className="favorites-grid">
                {favorites.map((book, index) => (
                    <div
                        key={index}
                        className="favorite-card"
                    >
                        <div className="favorite-cover">
                            <img
                                src={book.cover}
                                alt={book.title}
                                className="favorite-cover"
                            />
                        </div>
                        <div className="favorite-content">
                            <h3>
                                {book.title}
                            </h3>
                            <span className="author">
                                {book.author}
                            </span>
                            <div className="favorite-meta">
                                <span>
                                    ❤️ {book.recommendations}
                                </span>
                                <span>
                                    🎭 {book.mood}
                                </span>
                                <span>
                                    📖 {book.genre}
                                </span>
                            </div>
                            <p>
                                {book.insight}
                            </p>
                            <button>
                                View Book →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}