import { useRef, useEffect, useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import "../styles/trendingBooks.css";
import API_URL from "../config/api";

export default function TrendingBooks() {

  const scrollRef = useRef(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedBookIds, setSavedBookIds] = useState([]);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
        try {
          const res =
            await axios.get(
              `${API_URL}/api/search?query=bestseller`
            );
          const combinedBooks = [
            ...(res.data.openLibraryBooks || []),
            ...(res.data.googleBooks || [])
          ];
          setBooks(
            combinedBooks.slice(0, 12)
          );
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
    fetchTrendingBooks();
  }, []);

  useEffect(() => {
    async function fetchSavedBooks() {
      try {
        const res =
          await axios.get(
            `${API_URL}/api/saved-books`,
            {
              withCredentials: true
            }
          );
        if (res.data.success) {
          setSavedBookIds(
            res.data.books.map(
              book => book.bookId
            )
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchSavedBooks();
  }, []);

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

  const handleSave = async (book) => {
    try {
      console.log("Saving book:", book);
      const res = await axios.post(
        `${API_URL}/api/saved-books`,
        book,
        {
          withCredentials: true
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnsave = async (bookId) => {
    try {
      console.log("Unsaving book:", bookId);
      const res = await axios.delete(
        `${API_URL}/api/saved-books/${bookId}`,
        {
          withCredentials: true
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="trending-section">
      <div className="trending-header">
        <span>
          🔥 Trending This Week
        </span>
        <h2>
          Popular Among Readers
        </h2>
        <p>
          Discover books readers are
          currently exploring.
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
      <div className="books-container" ref={scrollRef}>
        {loading
          ? (
            <p>
              Loading...
            </p>
          )
          : (
            books.map(
              (book, index) => (
                <BookCard
                  key={book._id || `${book.title}-${index}`}
                  _id={book._id}
                  title={book.title}
                  author={book.author || "Unknown"}
                  image={book.coverImage}
                  category={book.source || "Trending"}
                  link={book.link}
                  source={book.source}
                  onSave={handleSave}
                  onUnsave={handleUnsave}
                  saved={savedBookIds.includes(book._id || book.link)}
                />
              )
            )
          )
        }
      </div>
    </section>
  );
}