import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config/api";

import UploadedBooks from "./UploadedBooks";
import SavedBooks from "./SavedBooks";
import UploadBookForm from "./UploadBookForm";

const TABS = [
  { id: "books", label: "My Books" },
  { id: "saved", label: "Saved" },
  { id: "upload", label: "Upload" },
];

export default function LibraryTabs({
  activeTab,
  setActiveTab
}) {

  const [editingBook, setEditingBook] = useState(null);
  const [myBooks, setMyBooks] = useState([]);

  useEffect(() => {
    const fetchBooks =
      async () => {
        try {
          const res = await axios.get( `${API_URL}/api/my-books`,
              {
                withCredentials: true
              }
            );
          setMyBooks( res.data.books );
        } catch (err) {
          console.log(err);
        }
      };
    fetchBooks();
  }, []);

  return (
    <>
      <div
        className="library-tabs"
        role="tablist"
        aria-label="Library sections"
      >
        {TABS.map(
          ({ id, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`tabpanel-${id}`}
              className={
                activeTab === id
                  ? "tab-active"
                  : ""
              }
              onClick={() =>
                setActiveTab(id)
              }
            >
              {label}
            </button>
          )
        )}

      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
      >

        {activeTab === "books" && (

          <UploadedBooks
            books={myBooks}
            setBooks={setMyBooks}
            onEdit={(book) => {
              setEditingBook(book);
              setActiveTab("upload");
            }}
          />

        )}

        {activeTab === "saved" && (
          <SavedBooks />
        )}

        {activeTab === "upload" && (
          <UploadBookForm editingBook={editingBook} />
        )}

      </div>
    </>
  );

}