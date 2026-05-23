import "../styles/moodCard.css";

export default function MoodCard({
  emoji,
  title,
  description
}) {
  return (
    <div className="mood-card">

      <div className="mood-emoji">
        {emoji}
      </div>

      <h3 className="mood-title">
        {title}
      </h3>

      <p className="mood-description">
        {description}
      </p>

    </div>
  );
}