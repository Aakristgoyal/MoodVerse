import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import API_URL from "../config/api";
import "../styles/profile.css";

export default function Profile() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const res = await axios.get(
                    `${API_URL}/api/auth/me`,
                    {
                        withCredentials: true
                    }
                );

                if (
                    res.data.loggedIn
                ) {
                    setUser(res.data.user);
                } else {
                    setUser(null);
                }

            } catch (err) {

                console.log(err);
                setUser(null);

            } finally {

                setLoading(false);

            }

        };

        fetchUser();

    }, []);

    const handleLogout = async () => {

        try {

            await axios.post(
                `${API_URL}/api/auth/logout`,
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

    if (loading) {

        return (

            <section className="profile-page">

                <div className="profile-card">

                    <h2>Loading Profile...</h2>

                </div>

            </section>

        );

    }

    if (!user) {

        return (

            <section className="profile-page">

                <div className="profile-card">

                    <h1>Profile</h1>

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

                        {
                            user.name
                                ?.charAt(0)
                                .toUpperCase()
                        }

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

                    <Link to="/discover">
                        🔍 Discover Books
                    </Link>

                    <Link to="/library">
                        📚 My Library
                    </Link>

                    <Link to="/library?saved=true">
                        ❤️ Saved Books
                    </Link>

                    <Link to="/library?tab=reading">
                        📖 Continue Reading
                    </Link>

                    <Link to="/ai-assistant">
                        🤖 AI Assistant
                    </Link>

                    <Link to="/discover">
                        ✨ Personalized Recommendations
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