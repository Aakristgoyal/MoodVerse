import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LibraryHero from "../components/library/LibraryHero";
import LibraryStats from "../components/library/LibraryStats";
import ContinueReading from "../components/library/ContinueReading";
import LibraryTabs from "../components/library/LibraryTabs";
import "../styles/library.css";

export default function Library() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "books"
  );
  const [continueBook, setContinueBook] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const tab =
      searchParams.get("tab") || "books";

    setActiveTab(tab);

    if (tab === "upload") {
      setTimeout(() => {
        document
          .getElementById("library-tabs")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
      }, 100);
    }

  }, [searchParams]);
  useEffect(() => {
    async function fetchContinueReading() {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/continue-reading",
          {
            withCredentials: true
          }
        );

        console.log(
          "Continue Reading API:",
          res.data
        );
        if (
          res.data.success &&
          res.data.progress
        ) {
          const p =
            res.data.progress;
          setContinueBook({
            title: p.book.title,
            author: p.book.author,
            progress: p.progress,
            currentPage: p.currentPage,
            totalPages: p.totalPages,
            bookId: p.book._id
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchContinueReading();
  }, []);

  return (
    <>
      <Navbar />

      <main className="library-page">
        <LibraryHero
          onUpload={() => navigate("/library?tab=upload")}
        />
        <LibraryStats />
        <ContinueReading
          book={continueBook}
          onContinue={() => {
            if (
              continueBook?.bookId
            ) {
              navigate(
                `/books/${continueBook.bookId}/read`
              );

            }

          }}
        />
        <div id="library-tabs">
          <LibraryTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}