import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../config/api";

export default function LibraryStats() {

  const [stats, setStats] = useState([
    {
      id: "uploaded",
      icon: "⬆️",
      title: "Uploaded",
      value: "0",
      sub: "Your books"
    },
    {
      id: "saved",
      icon: "🔖",
      title: "Saved",
      value: "0",
      sub: "Want to read"
    },
    {
      id: "reading",
      icon: "📖",
      title: "Reading",
      value: "0",
      sub: "Currently reading"
    },
    {
      id: "mood",
      icon: "🔥",
      title: "Top Mood",
      value: "Adventurous",
      sub: "Most selected"
    }
  ]);

  useEffect(() => {

    async function fetchStats() {

      try {

        const [booksRes, savedRes, readingRes] =
          await Promise.all([
            axios.get(
              `${API_URL}/api/my-books`,
              { withCredentials: true }
            ),
            axios.get(
              `${API_URL}/api/saved-books`,
              { withCredentials: true }
            ),
            axios.get(
              `${API_URL}/api/continue-reading`,
              { withCredentials: true }
            )
          ]);

        setStats([
          {
            id: "uploaded",
            icon: "⬆️",
            title: "Uploaded",
            value: String(
              booksRes.data.books?.length || 0
            ),
            sub: "Your books"
          },
          {
            id: "saved",
            icon: "🔖",
            title: "Saved",
            value: String(
              savedRes.data.books?.length || 0
            ),
            sub: "Want to read"
          },
          {
            id: "reading",
            icon: "📖",
            title: "Reading",
            value:
              readingRes.data.progress
                ? "1"
                : "0",
            sub: "Currently reading"
          },
          {
            id: "mood",
            icon: "🔥",
            title: "Top Mood",
            value: "Adventurous",
            sub: "Most selected"
          }
        ]);

      } catch (err) {

        console.log(err);

      }

    }

    fetchStats();

  }, []);

  return (
    <div
      className="stats-grid"
      aria-label="Library statistics"
    >
      {stats.map((item) => (
        <div
          key={item.id}
          className="stat-card"
        >
          <span
            className="stat-icon"
            aria-hidden="true"
          >
            {item.icon}
          </span>

          <p className="stat-title">
            {item.title}
          </p>

          <strong className="stat-value">
            {item.value}
          </strong>

          <p className="stat-sub">
            {item.sub}
          </p>
        </div>
      ))}
    </div>
  );
}