import Navbar from "../components/Navbar";
import CommunityHero from "../components/CommunityHero";
import TrendingDiscussions from "../components/TrendingDiscussions";
import CommunityFavourites from "../components/CommunityFavourites";
import ReaderReviews from "../components/ReaderReviews";
import RecentlyShared from "../components/RecentlyShared";
import Footer from "../components/Footer";
export default function Community() {
    return (
        <>
            <Navbar />
            <CommunityHero />
            <TrendingDiscussions />
            <CommunityFavourites />
            <ReaderReviews />
            <RecentlyShared />
            <Footer />
        </>
    );
}