import "../styles/discoverSearchBar.css";

export default function DiscoverSearchBar() {
  return (
    <section className="search-section">

      <div className="search-container">

        <input
          type="text"
          placeholder="Search books, authors or genres..."
          className="search-input"
        />

        <div className="filters-row">

          <select>
            <option>All Moods</option>
            <option>Happy</option>
            <option>Motivated</option>
            <option>Calm</option>
            <option>Romantic</option>
            <option>Adventurous</option>
            <option>Sad</option>
            <option>Suspense</option>
            <option>Thoughtful</option>
          </select>

          <select>
            <option>All Genres</option>
            <option>Fantasy</option>
            <option>Romance</option>
            <option>Thriller</option>
            <option>Mystery</option>
            <option>Self Help</option>
            <option>Biography</option>
            <option>Psychology</option>
            <option>Sci-Fi</option>
          </select>

          <select>
            <option>Popular</option>
            <option>Newest</option>
            <option>Highest Rated</option>
            <option>A-Z</option>
          </select>

        </div>

        <button className="discover-search-btn">
          Search Books
        </button>

      </div>

    </section>
  );
}