import "../styles/readerReviews.css";

export default function ReaderReviews() {

    const reviews = [
        {
            book: "Atomic Habits",
            review:
                "One of the most practical books I've read. The small habits approach really helped me stay consistent.",
            user: "Priya S."
        },
        {
            book: "The Alchemist",
            review:
                "A beautiful story about purpose and following your dreams. Definitely a memorable read.",
            user: "Rahul M."
        },
        {
            book: "Deep Work",
            review:
                "Helped me improve my focus and reduce distractions during study sessions.",
            user: "Ananya K."
        },
        {
            book: "The Psychology of Money",
            review:
                "Changed the way I think about money and decision making. Easy to read and highly insightful.",
            user: "Vikram R."
        }
    ];

    return (
        <section className="reviews-section">

            <div className="reviews-header">

                <span className="reviews-tag">
                    ⭐ Reader Reviews
                </span>

                <h2>
                    What Readers Are Saying
                </h2>

                <p>
                    Honest thoughts and experiences shared by the MoodVerse community.
                </p>

                <button className="review-btn">
                    Write A Review
                </button>

            </div>

            <div className="reviews-container">

                {reviews.map((review, index) => (

                    <div
                        key={index}
                        className="review-card"
                    >

                        <h3>
                            {review.book}
                        </h3>

                        <p>
                            "{review.review}"
                        </p>

                        <span>
                            — {review.user}
                        </span>

                    </div>

                ))}

            </div>

        </section>
    );
}