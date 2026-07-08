import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/profile.css";

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:3000/api/auth/me",
                    {
                        withCredentials: true
                    }
                );
                setUser(res.data.user);
            } catch (err) {
                console.log(err);
                setUser(null);
            }
        };
        fetchUser();
    }, []);
    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:3000/api/auth/logout",
                {},
                {
                    withCredentials: true
                }
            );
            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    };
    if (!user) {
        return (
            <section className="profile-page">
                <div className="profile-card">
                    <h1>
                        Profile
                    </h1>
                    <p>
                        You are not signed in.
                    </p>
                    <Link
                        to="/login"
                        className="profile-action-btn"
                    >
                        Sign In
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">
                        {user.name?.charAt(0)}
                    </div>
                    <div>
                        <h1>
                            {user.name}
                        </h1>
                        <p>
                            {user.email}
                        </p>
                    </div>
                </div>
                <div className="profile-links">
                    <Link to="/">
                        🏠 Home
                    </Link>
                    <Link to="/library">
                        📚 My Library
                    </Link>
                    <Link to="/library">
                        ❤️ Saved Books
                    </Link>
                    <Link to="/library">
                        🕒 Reading History
                    </Link>
                    <Link to="/settings">
                        ⚙️ Settings
                    </Link>
                </div>
                <button
                    className="logout-btn-profile"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </section>
    );
}