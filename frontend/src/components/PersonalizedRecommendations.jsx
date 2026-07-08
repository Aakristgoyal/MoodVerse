import { useEffect, useState } from "react";
import axios from "axios";
import RecommendationRow from "./RecommendationRow";
import API_URL from "../config/api";

export default function PersonalizedRecommendations() {

    const [sections, setSections] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchRecommendations();

    }, []);

    async function fetchRecommendations() {

        try {

            const res = await axios.get(

                `${API_URL}/api/personalized`,

                {
                    withCredentials: true
                }

            );

            if (res.data.success) {

                setSections(res.data.sections);

            }

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (
            <section className="personalized-section">
                <div className="personalized-container">
                    <h2>✨ Building Your Reading Profile...</h2>
                    <p>
                        Analyzing your interests using AI...
                    </p>
                </div>
            </section>
        );
    }
    if (!sections) {
        return null;
    }
    return (
        <section className="personalized-section">
            <div className="personalized-container">
                <span className="personalized-tag">
                    ✨ Personalized For You
                </span>
                <h2>
                    Recommendations Based On Your Reading Journey
                </h2>
                <p>
                    <p>
                        MoodVerse learns from your reading history,
                        saved books, AI conversations and current reads
                        to recommend books uniquely tailored for you.
                    </p>
                </p>
            </div>
            {sections.saved?.length > 0 && (
                <RecommendationRow
                    title="📚 Because You Saved These"
                    subtitle="Books you've added to your collection."
                    books={sections.saved}
                />
            )}
            {sections.conversations?.length > 0 && (
                <RecommendationRow
                    title="💬 Inspired By Your AI Conversations"
                    subtitle="Based on your recent chats with MoodVerse AI."
                    books={sections.conversations}
                />
            )}
            {sections.continueReading?.length > 0 && (
                <RecommendationRow
                    title="📖 Continue Your Reading Journey"
                    subtitle="Books related to what you're reading right now."
                    books={sections.continueReading}
                />
            )}
            {sections.uploads?.length > 0 && (
                <RecommendationRow
                    title="📤 Similar To Your Uploads"
                    subtitle="Recommendations based on books you've shared."
                    books={sections.uploads}
                />
            )}
            {sections.ai?.length > 0 && (
                <RecommendationRow
                    title="🤖 MoodVerse AI Picks"
                    subtitle="Handpicked using your complete reading profile."
                    books={sections.ai}
                />
            )}
            {sections.explore?.length > 0 && (
                <RecommendationRow
                    title="🌍 Explore Something Different"
                    subtitle="Discover something outside your usual interests."
                    books={sections.explore}
                />
            )}
        </section>
    );
}