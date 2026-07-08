import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import "../styles/readBook.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ReadBook() {

  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const pdfWidth = Math.min( window.innerWidth - 40,700);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/books/${id}`
        );
        setBook(res.data.book);
      } catch (err) {
        console.log(err);
      }
    }
    fetchBook();
  }, [id]);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/progress/${id}`,
          {
            withCredentials: true
          }
        );
        if (
          res.data.success &&
          res.data.progress
        ) {
          setPageNumber(
            res.data.progress.currentPage
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchProgress();
  }, [id]);

  useEffect(() => {
    if (!numPages) return;
    async function saveProgress() {
      try {
        await axios.post(
          "http://localhost:3000/api/progress",
          {
            bookId: id,
            currentPage: pageNumber,
            totalPages: numPages
          },
          {
            withCredentials: true
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
    saveProgress();
  }, [
    pageNumber,
    numPages,
    id
  ]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  if (!book) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="reader-page">

      <h1>{book.title}</h1>

      <Document
        file={book.pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page
          pageNumber={pageNumber}
          width={pdfWidth}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      <div className="reader-controls">
        <button
          disabled={pageNumber <= 1}
          onClick={() =>
            setPageNumber(prev => prev - 1)
          }
        >
          Previous
        </button>

        <span>
          Page {pageNumber} of {numPages}
        </span>

        <button
          disabled={pageNumber >= numPages}
          onClick={() =>
            setPageNumber(prev => prev + 1)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}