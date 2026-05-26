import "../styles/communityHero.css";

export default function CommunityHero() {
    return (
        <section className="community-hero">
            <div className="community-hero-content">
                <span className="community-tag">
                    📚 MoodVerse Community
                </span>
                <h1>
                    Discover Books Through Real Readers
                </h1>
                <p>
                    Explore honest reviews, personal recommendations,
                    reading journeys, and meaningful conversations from
                    readers around the world.
                </p>
                <button className="community-btn" onClick={() =>document.getElementById("trending-discussions")?.scrollIntoView({behavior: "smooth"})}>
                    Explore Discussions
                </button>
            </div>
        </section>
    );
}