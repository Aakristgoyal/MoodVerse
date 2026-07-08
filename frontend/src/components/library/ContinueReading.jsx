export default function ContinueReading({ book, onContinue }) {
  const {
    title = "No book in progress",
    author = "",
    emoji = "📘",
    progress = 0,
    currentPage = 0,
    totalPages = 0
  } = book ?? {};

  const timeLabel =
  totalPages > 0
    ? `Page ${currentPage} of ${totalPages}`
    : "Start reading";

  return (
    <div className="continue-reading" aria-label="Currently reading">

      <div className="continue-book-cover" aria-hidden="true">{emoji}</div>

      <div className="continue-book-info">
        <span className="reading-label">Currently Reading</span>
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{author}</p>
      </div>

      <div className="progress-section">
        <div className="progress-meta">
          <span className="progress-pct">{progress}%</span>
          <span className="time-left">{timeLabel}</span>
        </div>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <button className="continue-btn" onClick={onContinue}>
        Continue Reading
      </button>

    </div>
  );
}