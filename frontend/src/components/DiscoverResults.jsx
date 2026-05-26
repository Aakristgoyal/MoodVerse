import BookCard from "./BookCard";
import "../styles/discoverResults.css";

const books = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
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
  },

  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    image:
      "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg"
  },

  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    category: "Motivation",
    image:
      "https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg"
  }
];

export default function DiscoverResults() {
  return (
    <section className="results-section">

      <div className="results-header">

        <h3>
          Showing {books.length} Books
        </h3>

      </div>

      <div className="results-grid">

        {books.map((book) => (
          <BookCard
            key={book.title}
            {...book}
          />
        ))}

      </div>

    </section>
  );
}