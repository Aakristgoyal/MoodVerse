import "../styles/bookCard.css";

export default function BookCard({
  title,
  author,
  image,
  category
}) {
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

        <button>
          Read More
        </button>

      </div>

    </div>
  );
}