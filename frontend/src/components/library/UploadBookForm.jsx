import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const INITIAL_FORM = { title: "", author: "", desc: "", moodtags: "" };
export default function UploadBookForm({
  onSuccess,
  editingBook
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {

    if (editingBook) {

      setFormData({
        title: editingBook.title || "",
        author: editingBook.author || "",
        desc: editingBook.desc || "",
        moodtags:
          editingBook.moodtags?.join(", ")
          || ""
      });

    }

  }, [editingBook]);
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const reset = () => {
    setFormData(INITIAL_FORM);
    setCoverImage(null);
    setPdfFile(null);
    setStatus("idle");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingBook && !pdfFile) {
      setErrorMsg(
        "Please attach a PDF file."
      );
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    const data = new FormData();
    Object.entries(formData)
      .forEach(([k, v]) =>
        data.append(k, v)
      );
    if (coverImage) {
      data.append(
        "coverImage",
        coverImage
      );
    }
    if (pdfFile) {
      data.append(
        "pdfFile",
        pdfFile
      );
    }
    try {
      if (editingBook) {
        await axios.put(
          `${API_URL}/api/books/${editingBook._id}`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );
      } else {
        await axios.post(
          `${API_URL}/api/books`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );
      }
      setStatus("success");
      onSuccess?.();
    } catch (err) {
      const msg =
        err.response?.data?.message
        ??
        (
          editingBook
            ? "Failed to update book."
            : "Failed to upload book."
        );
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="upload-book-form upload-success">
        <span className="upload-success-icon">✅</span>
        <h3>
          {
            editingBook
              ? "Book updated successfully!"
              : "Book uploaded successfully!"
          }
        </h3>
        <p>Your book has been added to your library and is being tagged by mood.</p>
        <button type="button" onClick={reset} className="upload-reset-btn">
          Upload another
        </button>
      </div>
    );
  }

  return (
    <form className="upload-book-form" onSubmit={handleSubmit} noValidate>
      <h2>
        {
          editingBook
            ? "Edit Book"
            : "Upload Book"
        }
      </h2>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="book-title">Book Title <span aria-hidden="true">*</span></label>
          <input
            id="book-title"
            type="text"
            placeholder="e.g. Atomic Habits"
            value={formData.title}
            onChange={handleChange("title")}
            required
            disabled={status === "loading"}
          />
        </div>

        <div className="form-field">
          <label htmlFor="book-author">Author <span aria-hidden="true">*</span></label>
          <input
            id="book-author"
            type="text"
            placeholder="e.g. James Clear"
            value={formData.author}
            onChange={handleChange("author")}
            required
            disabled={status === "loading"}
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="book-desc">Description</label>
        <textarea
          id="book-desc"
          placeholder="A short description of the book..."
          value={formData.desc}
          onChange={handleChange("desc")}
          disabled={status === "loading"}
        />
      </div>

      <div className="form-field">
        <label htmlFor="book-moods">Mood Tags</label>
        <input
          id="book-moods"
          type="text"
          placeholder="e.g. calm, inspired, melancholy"
          value={formData.moodtags}
          onChange={handleChange("moodtags")}
          disabled={status === "loading"}
        />
        <span className="field-hint">Separate tags with commas</span>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="book-cover">Cover Image</label>
          <input
            id="book-cover"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0] ?? null)}
            disabled={status === "loading"}
          />
          {coverImage && (
            <span className="field-hint file-chosen">
              {coverImage.name}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="book-pdf">
            PDF File
            {!editingBook && (
              <span aria-hidden="true">*</span>
            )}
          </label>
          <input
            id="book-pdf"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0] ?? null)}
            disabled={status === "loading"}
          />
          {pdfFile && (
            <span className="field-hint file-chosen">
              {pdfFile.name}
            </span>
          )}
        </div>
      </div>

      {errorMsg && (
        <p className="form-error" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
      >
        {
          status === "loading"
            ? (
              editingBook
                ? "Updating..."
                : "Uploading..."
            )
            : (
              editingBook
                ? "Update Book"
                : "Upload Book"
            )
        }
      </button>
    </form>
  );
}