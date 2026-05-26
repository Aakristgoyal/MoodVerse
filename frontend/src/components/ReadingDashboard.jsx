import { useState } from "react";
import "../styles/readingDashboard.css";

export default function ReadingDashboard() {

    const [activeTab, setActiveTab] =
        useState("saved");

    const savedBooks = [
        "Atomic Habits",
        "Deep Work",
        "The Alchemist",
        "Ikigai",
        "Rich Dad Poor Dad"
    ];

    const likedBooks = [
        "Can't Hurt Me",
        "Essentialism",
        "Deep Work",
        "Think And Grow Rich",
        "Atomic Habits"
    ];

    const historyBooks = [
        "The Psychology Of Money",
        "Ikigai",
        "Deep Work",
        "The Alchemist"
    ];

    const progressBooks = [
        {
            title: "Atomic Habits",
            progress: 80
        },
        {
            title: "Deep Work",
            progress: 55
        },
        {
            title: "The Alchemist",
            progress: 25
        }
    ];

    return (
        <section className="dashboard-section">

            <div className="dashboard-header">

                <span className="dashboard-tag">
                    📖 Personal Reading Dashboard
                </span>

                <h2>
                    Everything You Love To Read,
                    In One Place
                </h2>

                <p>
                    Track your reading activity,
                    revisit favorite books,
                    monitor progress and continue
                    your reading journey.
                </p>

            </div>

            <div className="dashboard-tabs">

                <button
                    className={
                        activeTab === "saved"
                            ? "active-tab"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("saved")
                    }
                >
                    📚 Saved
                </button>

                <button
                    className={
                        activeTab === "liked"
                            ? "active-tab"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("liked")
                    }
                >
                    ❤️ Liked
                </button>

                <button
                    className={
                        activeTab === "progress"
                            ? "active-tab"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("progress")
                    }
                >
                    📈 Progress
                </button>

                <button
                    className={
                        activeTab === "history"
                            ? "active-tab"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("history")
                    }
                >
                    🕒 History
                </button>

            </div>

            <div className="dashboard-content">

                {activeTab === "saved" &&
                    savedBooks.map((book) => (
                        <div
                            key={book}
                            className="dashboard-card"
                        >
                            📚 {book}
                        </div>
                    ))}

                {activeTab === "liked" &&
                    likedBooks.map((book) => (
                        <div
                            key={book}
                            className="dashboard-card"
                        >
                            ❤️ {book}
                        </div>
                    ))}

                {activeTab === "history" &&
                    historyBooks.map((book) => (
                        <div
                            key={book}
                            className="dashboard-card"
                        >
                            🕒 {book}
                        </div>
                    ))}

                {activeTab === "progress" &&
                    progressBooks.map((book) => (
                        <div
                            key={book.title}
                            className="progress-card"
                        >

                            <h4>
                                {book.title}
                            </h4>

                            <span>
                                {book.progress}% Complete
                            </span>

                            <div className="progress-bar">

                                <div
                                    className="progress-fill"
                                    style={{
                                        width:
                                            `${book.progress}%`
                                    }}
                                />

                            </div>

                        </div>
                    ))}

            </div>

        </section>
    );
}