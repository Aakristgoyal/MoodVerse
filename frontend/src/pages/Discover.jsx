import Navbar from "../components/Navbar";
import DiscoverHero from "../components/DiscoverHero";
import DiscoverSearchBar from "../components/DiscoverSearchBar";
import PersonalizedRecommendations from "../components/PersonalizedRecommendations";
import ReadingDashboard from "../components/ReadingDashboard";
import DiscoverResults from "../components/DiscoverResults";
import Footer from "../components/Footer";

export default function Discover() {
  const isLoggedIn = false;
  return (
    <>
      <Navbar />
      <DiscoverHero />
      <DiscoverSearchBar />
      <PersonalizedRecommendations />
      {isLoggedIn && <ReadingDashboard />}
      <DiscoverResults />
      <Footer />
    </>
  );
}