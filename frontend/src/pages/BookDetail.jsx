import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/bookDetail.css";
import { IconEye, IconFolderOpen, IconExternalLink } from '@tabler/icons-react';

export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/books/${id}`
                );
                setBook(
                    res.data.book
                );
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);
    if (loading) {
        return (
            <h2 className="loading">
                Loading...
            </h2>
        );
    }
    if (!book) {
        return (
            <h2 className="loading">
                Book not found
            </h2>
        );
    }
    return (
        <>
            <Navbar />
            <section className="book-detail-page">
                <div className="book-detail-container">
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="detail-cover"
                    />
                    <div className="detail-content">
                        <span className="detail-tag">
                            {
                                book.moodtags?.[0]
                                || "Mood"
                            }
                        </span>
                        <h1>
                            {book.title}
                        </h1>
                        <h3>
                            by {book.author}
                        </h3>
                        <p className="detail-desc">
                            {
                                book.desc
                                || "No description available."
                            }
                        </p>
                        <div className="mood-tags">
                            {
                                book.moodtags?.map(
                                    (tag, index) => (
                                        <span
                                            key={index}
                                        >
                                            {tag}
                                        </span>
                                    )
                                )
                            }
                        </div>
                        {
                            book.pdfFile && (
                                <a
                                    href={`/books/${book._id}/read`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="read-btn"
                                >
                                    Read <IconExternalLink size={18} /> 
                                </a>
                            )
                        }
                    </div>
                </div>
            </section>
        </>
    );
}