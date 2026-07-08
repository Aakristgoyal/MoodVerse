import { useState, useEffect } from "react";
import axios from "axios";
import {
    FiMenu,
    FiPlus,
    FiSend,
    FiChevronDown,
    FiUser
} from "react-icons/fi";
import BookCard from "./BookCard";
import "../styles/aiWorkspace.css";

export default function AIWorkspace() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:3000";

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/conversations`,
                {
                    withCredentials: true
                }
            );
            setConversations(res.data);
            if (res.data.length > 0) {
                loadConversation(
                    res.data[0]._id
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loadConversation = async (id) => {
        try {
            const res = await axios.get(
                `${API_URL}/api/conversations/${id}`,
                {
                    withCredentials: true
                }
            );
            setActiveChat(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    const createNewChat = async () => {
        try {
            const res = await axios.post(
                `${API_URL}/api/conversations/new`,
                {},
                {
                    withCredentials: true
                }
            );
            setConversations(prev => [
                res.data,
                ...prev
            ]);
            setActiveChat(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const sendMessage = async (
        customMessage = null
    ) => {
        const query = customMessage || message;
        if (
            !query.trim() ||
            !activeChat
        ) {
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(
                `${API_URL}/api/conversations/${activeChat._id}/chat`,
                {
                    query
                },
                {
                    withCredentials: true
                }
            );
            setActiveChat(res.data);
            setConversations(prev =>
                prev.map(chat =>
                    chat._id === res.data._id
                        ? res.data
                        : chat
                )
            );
            setMessage("");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="workspace-section">
            <div className="workspace-container">
                <aside
                    className={
                        sidebarOpen
                            ? "assistant-sidebar open"
                            : "assistant-sidebar"
                    }
                >
                    <div className="sidebar-header">
                        <button
                            className="menu-btn"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                        >
                            <FiMenu />
                        </button>
                        <h3>
                            MoodVerse
                        </h3>
                    </div>
                    <button
                        className="new-chat-btn"
                        onClick={createNewChat}
                    >
                        <FiPlus />
                        <span>
                            New Chat
                        </span>
                    </button>
                    <div className="recent-chats">
                        <h4>
                            Recent Chats
                        </h4>
                        {
                            conversations.map(
                                chat => (
                                    <button
                                        key={chat._id}
                                        onClick={() =>
                                            loadConversation(
                                                chat._id
                                            )
                                        }
                                    >
                                        {
                                            chat.title ||
                                            "New Chat"
                                        }
                                    </button>
                                )
                            )
                        }
                    </div>
                    <div className="sidebar-profile">
                        <button className="profile-btn">
                            <div className="profile-left">
                                <div className="avatar">
                                    <FiUser />
                                </div>
                                <span>
                                    User
                                </span>
                            </div>
                            <FiChevronDown />
                        </button>
                    </div>
                </aside>
                <div className="chat-area">
                    {
                        !sidebarOpen && (
                            <div className="chat-header">
                                <button
                                    className="menu-btn"
                                    onClick={() =>
                                        setSidebarOpen(true)
                                    }
                                >
                                    <FiMenu />
                                </button>
                            </div>
                        )
                    }
                    <div className="chat-window">
                        <div className="assistant-intro">
                            <span>
                                ✨ Welcome to MoodVerse AI
                            </span>
                        </div>
                        {
                            !activeChat ||
                                activeChat.messages.length === 0 ? (
                                <>
                                    <div className="welcome-message">
                                        <h2>
                                            Hello 👋
                                        </h2>
                                        <p>
                                            How are you feeling today?
                                        </p>
                                    </div>
                                    <div className="mood-chips">
                                        <button
                                            onClick={() =>
                                                sendMessage(
                                                    "Recommend happy books"
                                                )
                                            }
                                        >
                                            😊 Happy
                                        </button>
                                        <button
                                            onClick={() =>
                                                sendMessage(
                                                    "Recommend calm books"
                                                )
                                            }
                                        >
                                            😌 Calm
                                        </button>
                                        <button
                                            onClick={() =>
                                                sendMessage(
                                                    "Recommend books for sadness"
                                                )
                                            }
                                        >
                                            😔 Low
                                        </button>
                                        <button
                                            onClick={() =>
                                                sendMessage(
                                                    "Recommend motivational books"
                                                )
                                            }
                                        >
                                            🔥 Motivated
                                        </button>
                                        <button
                                            onClick={() =>
                                                sendMessage(
                                                    "Recommend thoughtful books"
                                                )
                                            }
                                        >
                                            🤔 Thoughtful
                                        </button>
                                        <button
                                            onClick={() =>
                                                sendMessage(
                                                    "Recommend books for stress"
                                                )
                                            }
                                        >
                                            🌧️ Stressed
                                        </button>
                                    </div>
                                </>
                            ) : (
                                activeChat.messages.map((msg, index) => {

                                    console.log(msg);

                                    const hasText =
                                        msg.text &&
                                        msg.text.trim() !== "";

                                    const hasBooks =
                                        msg.books &&
                                        msg.books.length > 0;

                                    if (!hasText && !hasBooks) {
                                        return null;
                                    }

                                    return (

                                        <div
                                            key={index}
                                            className={
                                                msg.sender === "user"
                                                    ? "user-message"
                                                    : "bot-message"
                                            }
                                        >

                                            {hasText && (
                                                <p>
                                                    {msg.text}
                                                </p>
                                            )}

                                            {hasBooks && (

                                                <div className="chat-books-row">

                                                    {
                                                        msg.books.map((book, bookIndex) => {

                                                            console.log("AI BOOK:", book);

                                                            return (
                                                                <BookCard
                                                                    key={book.link || `${book.title}-${bookIndex}`}
                                                                    _id={book._id}
                                                                    title={book.title}
                                                                    author={book.author || "Unknown"}
                                                                    image={book.coverImage}
                                                                    category={book.source || "Book"}
                                                                    link={book.link}
                                                                    source={book.source}
                                                                />
                                                            );

                                                        })
                                                    }

                                                </div>

                                            )}

                                        </div>

                                    );

                                })
                            )
                        }
                    </div>
                    <div className="chat-input-container">
                        <input
                            type="text"
                            placeholder="Share what's on your mind..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />
                        <button
                            className="send-btn"
                            onClick={() => sendMessage()}
                            disabled={loading}
                        >
                            <FiSend />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}