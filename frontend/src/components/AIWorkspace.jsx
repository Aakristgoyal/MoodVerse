import { useState } from "react";
import {
    FiMenu,
    FiPlus,
    FiSend,
    FiChevronDown,
    FiUser
} from "react-icons/fi";
import "../styles/aiWorkspace.css";
export default function AIWorkspace() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
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

                        <h3>MoodVerse</h3>

                    </div>

                    <button className="new-chat-btn">
                        <FiPlus />
                        <span>New Chat</span>
                    </button>

                    <div className="recent-chats">

                        <h4>Recent Chats</h4>

                        <button>Finding Focus</button>
                        <button>Evening Reads</button>
                        <button>Feeling Stressed</button>
                        <button>Building Habits</button>
                        <button>Exam Preparation</button>
                        <button>Reading Habit</button>
                        <button>Daily Reflection</button>
                        <button>Book Discovery</button>
                        <button>Calm Evening</button>
                        <button>Focus Session</button>
                        <button>Weekend Reads</button>


                    </div>

                    <div className="sidebar-profile">

                        <button className="profile-btn">

                            <div className="profile-left">

                                <div className="avatar">
                                    <FiUser />
                                </div>

                                <span>
                                    Aakrist Goyal
                                </span>

                            </div>

                            <FiChevronDown />

                        </button>

                    </div>

                </aside>
                {/* Chat Area */}
                <div className="chat-area">
                    {!sidebarOpen && (
                        <div className="chat-header">
                            <button
                                className="menu-btn"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <FiMenu />
                            </button>
                        </div>
                    )}
                    <div className="chat-window">
                        <div className="assistant-intro">
                            <span>✨ Welcome to MoodVerse AI</span>
                        </div>
                        <div className="welcome-message">
                            <h2>
                                Hello 👋
                            </h2>
                            <p>
                                How are you feeling today?
                            </p>
                        </div>
                        <div className="mood-chips">
                            <button>
                                😊 Happy
                            </button>
                            <button>
                                😌 Calm
                            </button>
                            <button>
                                😔 Low
                            </button>
                            <button>
                                🔥 Motivated
                            </button>
                            <button>
                                🤔 Thoughtful
                            </button>
                            <button>
                                🌧️ Stressed
                            </button>
                        </div>
                    </div>
                    <div className="chat-input-container">
                        <input type="text" placeholder="Share what's on your mind..." />
                        <button
                            className="send-btn">
                            <FiSend />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}