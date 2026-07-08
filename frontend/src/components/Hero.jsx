import "../styles/hero.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Hero() {

    const [suggestions, setSuggestions] = useState([]);
    const [todayMood, setTodayMood] = useState("");

    useEffect(() => {
        const moods = [
            {
                mood: "Motivated",
                emoji: "🔥"
            },
            {
                mood: "Calm",
                emoji: "😌"
            },
            {
                mood: "Happy",
                emoji: "😊"
            },
            {
                mood: "Thoughtful",
                emoji: "🧠"
            },
            {
                mood: "Adventurous",
                emoji: "🚀"
            },
            {
                mood: "Romantic",
                emoji: "❤️"
            },
            {
                mood: "Suspense",
                emoji: "😱"
            }
        ];
        const moodIndex = new Date().getDate() % moods.length;
        const randomMood = moods[moodIndex];
        setTodayMood(randomMood);
        const fetchSuggestions = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/search?query=${randomMood}`
                );
                const books = [
                    ...(res.data.openLibraryBooks || []),
                    ...(res.data.googleBooks || []),
                    ...(res.data.localBooks || [])
                ];
                setSuggestions(
                    books.slice(0, 3)
                );
            } catch (err) {
                console.error(
                    "Error fetching suggestions:",
                    err
                );
            }
        };
        fetchSuggestions();
    }, []);

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
                    <Link to="/discover">
                        <button className="primary-btn">
                            Find My Next Read
                        </button>
                    </Link>
                    <Link to="/ai-assistant">
                        <button className="secondary-btn">
                            Ask AI Assistant
                        </button>
                    </Link>
                </div>
            </div>
            <div className="hero-right">
                <div className="recommendation-card">
                    <h3>
                        {todayMood.emoji}
                        {" "}
                        Today's Mood:
                        {" "}
                        {todayMood.mood}
                    </h3>
                    {
                        suggestions.length > 0 ? (
                            suggestions.map((book, index) => {
                                const content = (
                                    <>
                                        <img
                                            src={book.coverImage}
                                            alt={book.title}
                                            className="hero-book-cover"
                                        />
                                        <div className="hero-book-details">
                                            <h4>
                                                {book.title}
                                            </h4>
                                            <p>
                                                {book.author}
                                            </p>
                                        </div>
                                    </>
                                );
                                return (
                                    <div
                                        key={index}
                                        className="hero-book-wrapper"
                                    >
                                        {
                                            book._id ? (
                                                <Link
                                                    to={`/books/${book._id}`}
                                                    className="hero-book-item"
                                                >
                                                    {content}
                                                </Link>
                                            ) : book.link ? (
                                                <a
                                                    href={book.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="hero-book-item"
                                                >
                                                    {content}
                                                </a>
                                            ) : (
                                                <div className="hero-book-item">
                                                    {content}
                                                </div>
                                            )
                                        }
                                    </div>
                                );
                            })
                        ) : (
                            <p>
                                Loading recommendations...
                            </p>
                        )
                    }
                </div>
            </div>
        </section>
    );
}