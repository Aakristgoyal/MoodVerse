import { useRef } from "react";
import {FiChevronLeft,FiChevronRight} from "react-icons/fi";
import BookCard from "./BookCard";
import "../styles/recommendationRow.css";

export default function RecommendationRow({
    title,
    subtitle,
    books = []
}) {

    const scrollRef = useRef(null);

    const scroll = (direction) => {

        if (!scrollRef.current) return;

        const amount = 330;

        scrollRef.current.scrollBy({
            left:
                direction === "left"
                    ? -amount
                    : amount,
            behavior: "smooth"
        });

    };

    if (!books.length) return null;

    return (
        <section className="recommendation-row">
            <div className="recommendation-header">
                <div>
                    <h2>
                        {title}
                    </h2>
                    {
                        subtitle && (
                            <p>
                                {subtitle}
                            </p>
                        )
                    }
                </div>
                <div className="recommendation-controls">
                    <button
                        onClick={() =>
                            scroll("left")
                        }
                    >
                        <FiChevronLeft />
                    </button>
                    <button
                        onClick={() =>
                            scroll("right")
                        }
                    >
                        <FiChevronRight />
                    </button>
                </div>
            </div>
            <div
                className="recommendation-books"
                ref={scrollRef}
            >
                {
                    books.map((book, index) => (
                        <BookCard
                            key={
                                book._id ||
                                book.link ||
                                index
                            }
                            _id={book._id}
                            title={book.title}
                            author={book.author}
                            image={book.coverImage}
                            link={book.link}
                            source={book.source}
                            category={book.source}
                        />

                    ))
                }

            </div>

        </section>

    );

}