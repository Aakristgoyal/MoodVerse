import { Link } from "react-router-dom";
import "../styles/bookCard.css";
import { useState } from "react";

export default function BookCard({
  _id,
  title,
  author,
  image,
  category,
  link,
  source = "mongodb",
  saved = false,
  onSave,
  onUnsave
}) {

  const [isSaved, setIsSaved] = useState(saved);

  const handleSave = async () => {
    if (isSaved) {
      await onUnsave?.( _id || link );
      setIsSaved(false);
    } else {
      await onSave?.({
        bookId: _id || link,
        source,
        title,
        author,
        coverImage: image
      });
      setIsSaved(true);
    }
  };

  return (
    <div className="book-card">
      <img
        src={image}
        alt={title}
        className="book-cover"
        loading="lazy"
      />
      <div className="book-info">
        <span className="book-category">
          {category}
        </span>
        <h3>{title}</h3>
        <p>{author}</p>
        <div className="book-actions">
          {_id ? (

            <Link
              to={`/books/${_id}`}
              className="book-read-link"
            >
              <button className="book-action-btn">
                📖 View
              </button>
            </Link>

          ) : link ? (

            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="book-read-link"
            >
              <button className="book-action-btn">
                📖 View 
              </button>
            </a>

          ) : (

            <button
              disabled
              className="book-action-btn"
            >
              Unavailable
            </button>

          )}

          <button
            className={`save-book-btn ${isSaved ? "saved" : ""
              }`}
            onClick={handleSave}
            title={
              isSaved
                ? "Saved"
                : "Save Book"
            }
          >
            {isSaved ? "❤️" : "🤍"}
          </button>

        </div>

      </div>

    </div>
  );

}