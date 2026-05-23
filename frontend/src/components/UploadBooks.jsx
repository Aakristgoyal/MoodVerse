import "../styles/uploadBooks.css";

export default function UploadBooks() {
  return (
    <section className="upload-section">

      <div className="upload-container">

        <div className="upload-content">

          <span className="upload-tag">
            📚 Share Knowledge
          </span>

          <h2>
            Share Your Favorite Books With The Community
          </h2>

          <p>
            Help readers discover inspiring stories,
            educational resources, and hidden gems.
            Upload books and become part of the growing
            MoodVerse reading community.
          </p>

          <div className="upload-features">

            <div className="feature-item">
              📖 Upload Books Easily
            </div>

            <div className="feature-item">
              🌍 Reach Readers Worldwide
            </div>

            <div className="feature-item">
              🤝 Contribute To The Community
            </div>

            <div className="feature-item">
              ⭐ Inspire New Readers
            </div>

          </div>

          <button className="upload-btn">
            Upload Your Own Book
          </button>

        </div>

      </div>

    </section>
  );
}