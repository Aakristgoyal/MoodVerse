import "../styles/discoverSearchBar.css";

export default function DiscoverSearchBar({
  searchTerm,
  setSearchTerm,
  mood,
  setMood,
  genre,
  setGenre,
  sort,
  setSort,
  onSearch,
}) {
  return (
    <section className="search-section">

      <div className="search-container">

        <input
          type="text"
          placeholder="Search books, authors or genres..."
          className="search-input"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <div className="filters-row">

          <select
            value={mood}
            onChange={(e) =>
              setMood(e.target.value)
            }
          >
            <option value="">
              All Moods
            </option>

            <option value="happy">
              Happy
            </option>

            <option value="motivated">
              Motivated
            </option>

            <option value="calm">
              Calm
            </option>

            <option value="romantic">
              Romantic
            </option>

            <option value="adventurous">
              Adventurous
            </option>

            <option value="sad">
              Sad
            </option>

            <option value="suspense">
              Suspense
            </option>

            <option value="thoughtful">
              Thoughtful
            </option>

          </select>

          <select
            value={genre}
            onChange={(e) =>
              setGenre(e.target.value)
            }
          >
            <option value="">
              All Genres
            </option>

            <option value="fantasy">
              Fantasy
            </option>

            <option value="romance">
              Romance
            </option>

            <option value="thriller">
              Thriller
            </option>

            <option value="mystery">
              Mystery
            </option>

            <option value="self help">
              Self Help
            </option>

            <option value="biography">
              Biography
            </option>

            <option value="psychology">
              Psychology
            </option>

            <option value="sci-fi">
              Sci-Fi
            </option>

          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >
            <option value="popular">
              Popular
            </option>

            <option value="newest">
              Newest
            </option>

            <option value="highest-rated">
              Highest Rated
            </option>

            <option value="a-z">
              A-Z
            </option>

          </select>

        </div>

        <button className="discover-search-btn" onClick={onSearch}>
          Search Books
        </button>

      </div>

    </section>
  );
}