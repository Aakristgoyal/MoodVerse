import "../styles/trendingDiscussions.css";

export default function TrendingDiscussions() {

    const discussions = [
        {
            title: "Which book changed your perspective on life?",
            category: "General Discussion",
            replies: 128
        },
        {
            title: "Best books for exam motivation and focus",
            category: "Student Corner",
            replies: 94
        },
        {
            title: "What's your comfort read when you're stressed?",
            category: "Mood Reads",
            replies: 76
        },
        {
            title: "Most underrated book you've ever read",
            category: "Recommendations",
            replies: 63
        },
        {
            title: "Books that helped you build better habits",
            category: "Self Growth",
            replies: 118
        },
        {
            title: "Fantasy books everyone should read once",
            category: "Fantasy Club",
            replies: 89
        }
    ];

    return (
        <section
            id="trending-discussions"
            className="trending-section"
        >

            <div className="section-header">

                <span className="section-tag">
                    🔥 Community Discussions
                </span>

                <h2>
                    Trending Conversations
                </h2>

                <p>
                    Join discussions, share your thoughts,
                    and discover what fellow readers are
                    talking about right now.
                </p>

            </div>

            <div className="discussions-grid">

                {discussions.map((discussion, index) => (

                    <div
                        key={index}
                        className="discussion-card"
                    >

                        <span className="discussion-category">
                            {discussion.category}
                        </span>

                        <h3>
                            {discussion.title}
                        </h3>

                        <div className="discussion-footer">

                            <span>
                                💬 {discussion.replies} replies
                            </span>

                            <button>
                                Join →
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
}