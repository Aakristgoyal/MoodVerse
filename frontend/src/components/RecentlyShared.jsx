import "../styles/recentlyShared.css";

export default function RecentlyShared() {

    const sharedBooks = [
        {
            title: "Atomic Habits Summary",
            author: "Priya S.",
            time: "2h ago"
        },
        {
            title: "Deep Work Notes",
            author: "Rahul M.",
            time: "Yesterday"
        },
        {
            title: "The Psychology of Money",
            author: "Ananya K.",
            time: "3d ago"
        },
        {
            title: "Ikigai Highlights",
            author: "Vikram R.",
            time: "5d ago"
        },
        {
            title: "The Alchemist Review",
            author: "Neha P.",
            time: "1w ago"
        }
    ];

    return (
        <section className="shared-section">

            <div className="shared-header">

                <span className="shared-tag">
                    📚 Recently Shared
                </span>

                <h2>
                    Fresh From The Community
                </h2>

            </div>

            <div className="shared-container">

                {sharedBooks.map((book, index) => (

                    <div
                        key={index}
                        className="shared-card"
                    >

                        <h4>
                            {book.title}
                        </h4>

                        <span>
                            by {book.author}
                        </span>

                        <small>
                            {book.time}
                        </small>

                    </div>

                ))}

            </div>

        </section>
    );
}