import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BookCard from "../BookCard";
import API_URL from "../../config/api";

export default function SavedBooks() {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedBooks();
  }, []);

  const fetchSavedBooks = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/saved-books`,
        {
          withCredentials: true
        }
      );

      if (
        res.data.success
      ) {
        setBooks(
          res.data.books
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (bookId) => {
    try {
      await axios.delete(
        `${API_URL}/api/saved-books/${encodeURIComponent(bookId)}`,
        {
          withCredentials: true
        }
      );
      setBooks(prev =>
        prev.filter(
          book =>
            book.bookId !== bookId
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="books-empty">
        <p>Loading saved books...</p>
      </div>
    );
  }

  if (books.length === 0) {

    return (
      <div className="books-empty">
        <span>🔖</span>
        <p>
          No saved books yet.
          Head to{" "}
          <Link to="/discover" className="discover-link">
            <strong>Discover</strong>
          </Link>
          {" "}to find your next read.
        </p>
      </div>
    );

  }

  return (
    <div className="saved-books-grid">
      {
        books.map(book => (
          <BookCard
            key={book._id}
            _id={
              book.source === "mongodb"
                ? book.bookId
                : null
            }
            link={
              book.source !== "mongodb"
                ? book.bookId
                : null
            }
            title={book.title}
            author={book.author}
            image={book.coverImage}
            category={
              book.source === "mongodb"
                ? "My Library"
                : book.source
            }
            source={book.source}
            saved={true}
            onUnsave={handleUnsave}
          />
        ))
      }
    </div>
  );
}