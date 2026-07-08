const express = require("express");
const router = express.Router();
const Book = require("../models/books");
const axios = require("axios");
require("dotenv").config();
/* =========================
   SEARCH API
========================= */
router.get("/api/search", async (req, res) => {
  let query =
    req.query.query || "";
  /* Validate Query */
  if (
    typeof query !== "string"
    || query.trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please enter a valid search term",
      localBooks: [],
      openLibraryBooks: [],
      googleBooks: [],
      nytBooks: []
    });
  }
  query = query.trim();
  /* Results */
  let localBooks = [];
  let openLibraryBooks = [];
  let googleBooks = [];
  let nytBooks = [];
  /* =========================
     LOCAL MONGODB BOOKS
  ========================= */
  try {
    localBooks =
      await Book.find({
        title: {
          $regex: query,
          $options: "i"
        }
      });
  } catch (err) {
    console.error(
      "MongoDB search error:",
      err.message
    );
  }
  /* =========================
     OPEN LIBRARY
  ========================= */
  try {
    const apiRes =
      await axios.get(
        `${process.env.OPEN_LIBRARY_BASE}/search.json?q=${encodeURIComponent(query)}&limit=10`
      );
    openLibraryBooks =
      apiRes.data.docs.map(book => ({
        title: book.title,

        author:
          book.author_name?.[0]
          || "Unknown",

        coverImage:
          book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : "",

        link:
          `https://openlibrary.org${book.key}`,

        source:
          "openlibrary"
      }));
  } catch (err) {
    console.warn("Open Library API unavailable:", err.message);
  }
  /* =========================
     GOOGLE BOOKS
  ========================= */
  try {
    const googleRes =
      await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${process.env.GOOGLE_BOOKS_API_KEY}`
      );
    googleBooks =
      (googleRes.data.items || [])
        .map(item => ({
          title:
            item.volumeInfo.title,
          author:
            (
              item.volumeInfo.authors
              || ["Unknown"]
            )[0],
          coverImage:
            item.volumeInfo.imageLinks
              ?.thumbnail || "",
          link:
            item.volumeInfo.infoLink,
          source:
            "googlebooks"
        }));
  } catch (err) {
    console.warn(
      "Google Books API unavailable:",
      err.message
    );
  }
  /* =========================
   NYT BOOKS
========================= */

  // ✅ Only verified, real NYT bestseller list names
  const NYT_MOOD_LISTS = {
    happy: "hardcover-fiction",
    sad: "trade-fiction-paperback",
    adventurous: "hardcover-fiction",
    romantic: "mass-market-paperback",
    motivated: "hardcover-nonfiction",
    curious: "science",
    stressed: "advice-how-to-and-miscellaneous",
    dark: "trade-fiction-paperback",
    children: "young-adult-hardcover",
    business: "business-books",
    default: "combined-print-and-e-book-fiction",
  };

  const nytCache = global.nytCache || (global.nytCache = new Map());

  try {
    // Safely extract string from any query type
    const nytQuery =
      typeof query === "string"
        ? query.trim().toLowerCase()
        : typeof query === "object" && query !== null
          ? (query.mood || query.genre || query.title || query.q || query.query || query.keyword || "").toLowerCase()
          : String(query ?? "").toLowerCase();

    if (nytQuery) {
      const listName = NYT_MOOD_LISTS[nytQuery] || NYT_MOOD_LISTS.default;
      const cacheKey = `nyt_${listName}`;
      const cached = nytCache.get(cacheKey);

      if (cached && Date.now() - cached.time < 10 * 60 * 1000) {
        nytBooks = cached.data;
      } else {
        const nytRes = await axios.get(
          `https://api.nytimes.com/svc/books/v3/lists/current/${listName}.json`,
          {
            params: {
              "api-key": process.env.NYT_BOOKS_API_KEY?.trim(),
            },
            timeout: 5000,
          }
        );

        const books = nytRes.data.results?.books || [];

        nytBooks = books.map(book => ({
          title: book.title || "Unknown Title",
          author: book.author || "Unknown",
          coverImage: book.primary_isbn13
            ? `https://covers.openlibrary.org/b/isbn/${book.primary_isbn13}-M.jpg`
            : "",
          link: book.amazon_product_url || "https://www.nytimes.com/books",
          rank: book.rank || null,
          weeksOnList: book.weeks_on_list || 0,
          source: "nytbooks",
        }));

        nytCache.set(cacheKey, { data: nytBooks, time: Date.now() });
      }
    }

  } catch (err) {
    const status = err.response?.status;
    if (status === 404) {
      console.warn("NYT: list not found —", err.config?.url);
    } else if (status === 429) {
      console.warn("NYT: rate limit hit, skipping");
    } else if (status === 400) {
      console.warn("NYT: bad request —", err.response?.data?.errors);
    } else {
      console.warn("NYT API unavailable:", err.message);
    }
    nytBooks = [];
  }
  /* =========================
     FINAL RESPONSE
  ========================= */
  res.json({
    success: true,
    searchTerm:
      query,
    localBooks,
    openLibraryBooks,
    googleBooks,
    nytBooks
  });
}
);
module.exports = router;
