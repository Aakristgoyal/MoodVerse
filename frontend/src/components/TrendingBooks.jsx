import { useRef } from "react";
import BookCard from "./BookCard";
import "../styles/trendingBooks.css";

const trendingBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Improvement",
    image:
      "https://books.google.com/books/content?id=AmEqDwAAQBAJ&printsec=frontcover&img=1&zoom=1"
  },

  {
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    image:
      "https://books.google.com/books/content?id=SlU4DAAAQBAJ&printsec=frontcover&img=1&zoom=1"
  },

  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Adventure",
    image:
      "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg"
  },

  {
    title: "Ikigai",
    author: "Héctor García",
    category: "Personal Growth",
    image:
      "https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg"
  }
];

export default function TrendingBooks() {

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -350,
      behavior: "smooth"
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 350,
      behavior: "smooth"
    });
  };

  return (
    <section className="trending-section">

      <div className="trending-header">

        <span>🔥 Trending This Week</span>

        <h2>Popular Among Readers</h2>

        <p>
          Discover the books that readers
          are currently enjoying the most.
        </p>

      </div>

      <div className="carousel-controls">

        <button onClick={scrollLeft}>
          ←
        </button>

        <button onClick={scrollRight}>
          →
        </button>

      </div>

      <div
        className="books-container"
        ref={scrollRef}
      >
        {trendingBooks.map((book) => (
          <BookCard
            key={book.title}
            {...book}
          />
        ))}
      </div>

    </section>
  );
}