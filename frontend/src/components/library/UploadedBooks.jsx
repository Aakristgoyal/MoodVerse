import { Link } from "react-router-dom";
import axios from "axios";
import {Eye,Pencil,Trash2} from "lucide-react";
import API_URL from "../../config/api";
const MOOD_STYLES = {
  calm: { bg: "rgba(8,80,65,0.4)", color: "#9FE1CB" },
  inspired: { bg: "rgba(60,52,137,0.4)", color: "#CECBF6" },
  melancholy: { bg: "rgba(38,33,92,0.4)", color: "#AFA9EC" },
  happy: { bg: "rgba(59,109,17,0.4)", color: "#C0DD97" },
  anxious: { bg: "rgba(99,56,6,0.4)", color: "#FAC775" },
};

export default function UploadedBooks({
  books = [],
  setBooks,
  onEdit
}) {

  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Delete this book?"
    );

    if (!confirmed) return;

    try {

      await axios.delete(
        `${API_URL}/api/books/${id}`,
        {
          withCredentials: true
        }
      );

      if (setBooks) {
        setBooks(prev =>
          prev.filter(
            book => book._id !== id
          )
        );
      }

    } catch (err) {

      console.log(err);

      alert(
        "Failed to delete book"
      );

    }

  };

  if (!books.length) {
    return (
      <div className="books-empty">
        <span>📚</span>

        <p>
          You haven't uploaded any books yet.
          Use the <strong>Upload</strong> tab to add one.
        </p>
      </div>
    );
  }

  return (
    <div className="uploaded-books-grid">

      {books.map((book) => {

        const mood =
          MOOD_STYLES[
          book.moodtags?.[0]
          ] ?? MOOD_STYLES.calm;

        return (

          <div
            key={book._id}
            className="book-card"
          >

            <div className="book-card-cover">

              {book.coverImage ? (

                <img
                  src={book.coverImage}
                  alt={book.title}
                />

              ) : (

                "📘"

              )}

            </div>

            <div className="book-card-body">

              <h4 className="book-card-title">
                {book.title}
              </h4>

              <p className="book-card-author">
                {book.author}
              </p>

              <div className="book-card-footer">

                <span
                  className="book-mood-tag"
                  style={{
                    // background: mood.bg,
                    color: mood.color
                  }}
                >
                  {book.moodtags?.[0] || "Mood"}
                </span>

              </div>

              <div className="book-actions">

                <Link
                  to={`/books/${book._id}`}
                  className="book-view-btn"
                >
                  <Eye size={16} />
                </Link>

                <button
                  className="book-edit-btn"
                  onClick={() => onEdit(book)}
                >
                  <Pencil size={16} />
                </button>

                <button
                  className="book-delete-btn"
                  onClick={() =>
                    handleDelete(book._id)
                  }
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          </div>

        );

      })}

    </div>
  );
}