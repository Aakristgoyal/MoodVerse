import "../styles/testimonials.css";

const testimonials = [
  {
    review:
      "The mood-based recommendations helped me find books that matched exactly how I was feeling. It feels much more personal than traditional book searches.",
    name: "Ayush sharma",
    title: "Early Beta User"
  },

  {
    review:
      "I love how easy it is to discover new books. The AI suggestions introduced me to authors I would never have found otherwise.",
    name: "Ritwiz Thakur",
    title: "Community Member"
  },

  {
    review:
      "The combination of AI recommendations and mood selection makes choosing my next read effortless and enjoyable.",
    name: "Sam Curran",
    title: "MoodVerse Explorer"
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">

      <div className="testimonials-header">

        <span className="section-tag">
          💬 Reader Experiences
        </span>

        <h2>
          What Readers Are Saying
        </h2>

        <p>
          Discover why readers enjoy finding
          their next favorite book through MoodVerse.
        </p>

      </div>

      <div className="testimonial-grid">

        {testimonials.map((testimonial, index) => (
          <div
            className="testimonial-card"
            key={index}
          >

            <div className="stars">
              ⭐⭐⭐⭐⭐
            </div>

            <p className="review">
              "{testimonial.review}"
            </p>

            <div className="author">

              <h4>{testimonial.name}</h4>

              <span>{testimonial.title}</span>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}