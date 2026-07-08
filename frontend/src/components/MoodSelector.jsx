import MoodCard from "./MoodCard";
import { useNavigate } from "react-router-dom";
import "../styles/moodSelector.css";

const moods = [
  {
    emoji: "😊",
    title: "Happy",
    description:
      "Feel-good stories that brighten your day"
  },

  {
    emoji: "🔥",
    title: "Motivated",
    description:
      "Books to inspire growth and productivity"
  },

  {
    emoji: "😌",
    title: "Calm",
    description:
      "Relaxing reads for peaceful moments"
  },

  {
    emoji: "❤️",
    title: "Romantic",
    description:
      "Heartwarming stories full of emotion"
  },

  {
    emoji: "🚀",
    title: "Adventurous",
    description:
      "Epic journeys and thrilling discoveries"
  },

  {
    emoji: "🌧️",
    title: "Sad",
    description:
      "Comforting books when you need support"
  },

  {
    emoji: "😱",
    title: "Suspense",
    description:
      "Mysteries and plot twists that keep you hooked"
  },

  {
    emoji: "🧠",
    title: "Thoughtful",
    description:
      "Books that challenge ideas and spark reflection"
  }
];

export default function MoodSelector() {
  const navigate = useNavigate();
  return (
    
    <section className="mood-section">
      <div className="mood-header">
        <span className="section-tag">
          🎭 Mood Based Discovery
        </span>
        <h2>
          How Are You Feeling Today?
        </h2>
        <p>
          Choose your current mood and let
          MoodVerse recommend books that
          match how you feel.
        </p>
      </div>
      <div className="mood-grid">
        {moods.map((mood) => (
          <MoodCard
            key={mood.title}
            emoji={mood.emoji}
            title={mood.title}
            description={mood.description}
            onClick={() =>
              navigate(
                `/discover?mood=${encodeURIComponent(
                  mood.title
                )}`
              )
            }
          />
        ))}
      </div>
    </section>
  );
}