import Navbar from "../components/Navbar";
import DiscoverHero from "../components/DiscoverHero";
import DiscoverSearchBar from "../components/DiscoverSearchBar";
import PersonalizedRecommendations from "../components/PersonalizedRecommendations";
import ReadingDashboard from "../components/ReadingDashboard";
import DiscoverResults from "../components/DiscoverResults";
import Footer from "../components/Footer";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function Discover() {
  const isLoggedIn = false;
  const [searchParams] = useSearchParams();
  const selectedMood = searchParams.get("mood") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [mood, setMood] = useState("");
  const [submittedMood, setSubmittedMood] = useState("");
  const [genre, setGenre] = useState("");
  const [submittedGenre, setSubmittedGenre] = useState("");
  const [sort, setSort] = useState("popular");
  const [submittedSort, setSubmittedSort] = useState("popular");
  const handleSearch = () => {

    setSubmittedSearch(searchTerm);
    setSubmittedMood(mood);
    setSubmittedGenre(genre);
    setSubmittedSort(sort);

    setTimeout(() => {
      document.getElementById("discover-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

    }, 200);

  };

  return (
    <>
      <Navbar />
      <DiscoverHero />
      <DiscoverSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        mood={mood}
        setMood={setMood}
        genre={genre}
        setGenre={setGenre}
        sort={sort}
        setSort={setSort}
        onSearch={handleSearch}
      />
      <PersonalizedRecommendations />
      {isLoggedIn && <ReadingDashboard />}
      <DiscoverResults
        selectedMood={selectedMood}
        searchTerm={submittedSearch}
        mood={submittedMood}
        genre={submittedGenre}
        sort={submittedSort}
      />
      <Footer />
    </>
  );
}