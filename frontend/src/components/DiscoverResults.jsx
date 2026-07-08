import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

import BookCard from "./BookCard";
import "../styles/discoverResults.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

export default function DiscoverResults({
  selectedMood,
  searchTerm,
  mood,
  genre,
  sort

}) {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left:
        direction === "left"
          ? -330
          : 330,
      behavior: "smooth"
    });
  };
  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const query =
          searchTerm ||
          mood ||
          genre ||
          selectedMood ||
          "books";
        const res = await axios.get(
          `${API_URL}/api/search?query=${encodeURIComponent(query)}`
        );
        const allBooks = [
          ...(res.data.localBooks || []),
          ...(res.data.openLibraryBooks || []),
          ...(res.data.googleBooks || []),
          ...(res.data.nytBooks || [])
        ];
        let filteredBooks = [...allBooks];
        if (searchTerm.trim()) {
          const search =
            searchTerm.toLowerCase();
          filteredBooks =
            filteredBooks.filter(book =>
              book.title
                ?.toLowerCase()
                .includes(search)
              ||
              book.author
                ?.toLowerCase()
                .includes(search)
            );
        }
        if (sort === "a-z") {
          filteredBooks.sort(
            (a, b) =>
              (a.title || "")
                .localeCompare(
                  b.title || ""
                )
          );
        }
        setBooks(filteredBooks);
      }
      catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [
    selectedMood,
    searchTerm,
    mood,
    genre,
    sort
  ]);
  async function handleSave(book) {
    try {
      await axios.post(
        `${API_URL}/api/saved-books`,
        book,
        {
          withCredentials: true
        }
      );
    }
    catch (err) {
      console.log(err);
    }
  }
  async function handleUnsave(bookId) {
    try {
      await axios.delete(
        `${API_URL}/api/saved-books/${bookId}`,
        {
          withCredentials: true
        }
      );
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <section
      id="discover-results"
      className="results-section"
    >
      <div className="results-header">
        <div>
          <h2>
            {
              selectedMood
                ? `${selectedMood} Books`
                : "Recommended Books Based On Your Mood :"
            }
          </h2>
        </div>
        {
          books.length > 0 && (
            <div className="results-controls">
              <button
                onClick={() => scroll("left")}
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => scroll("right")}
              >
                <FiChevronRight />
              </button>
            </div>
          )
        }
      </div>
      {
        loading
          ?
          (
            <div className="results-loading">
              <h2>
                Loading books...
              </h2>
            </div>
          )
          :
          books.length === 0
            ?
            (
              <div className="results-loading">
                <h2>
                  No books found.
                </h2>
              </div>
            )
            :
            (
              <div
                className="results-grid"
                ref={scrollRef}
              >
                {
                  books.map((book, index) => (
                    <BookCard
                      key={
                        book._id ||
                        book.link ||
                        `${book.title}-${index}`
                      }
                      _id={book._id}
                      title={book.title}
                      author={
                        book.author ||
                        "Unknown"
                      }
                      image={
                        book.coverImage
                      }
                      category={
                        book.source ||
                        book.moodtags?.[0] ||
                        "Book"
                      }
                      source={
                        book.source
                      }
                      link={
                        book.link
                      }
                      onSave={
                        handleSave
                      }
                      onUnsave={
                        handleUnsave
                      }
                    />
                  ))
                }
              </div>
            )
      }
    </section>
  );

}