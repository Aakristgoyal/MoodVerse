import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MoodSelector from "../components/MoodSelector";
import AIWidget from "../components/AIWidget";
import TrendingBooks from "../components/TrendingBooks";
import PersonalizedCTA from "../components/PersonalizedCTA";
import Testimonials from "../components/Testimonials";
import UploadBooks from "../components/UploadBooks";
import Footer from "../components/Footer";

export default function Home() {

  const loggedIn = false;

  const featuredBooks = [
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      coverImage:
        "https://covers.openlibrary.org/b/id/10521270-L.jpg",
      openLibraryLink:
        "https://openlibrary.org"
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      coverImage:
        "https://covers.openlibrary.org/b/id/12658117-L.jpg",
      openLibraryLink:
        "https://openlibrary.org"
    }
  ];

  return (
    <>
        <Navbar />
        <Hero />
        <MoodSelector />
        <AIWidget />
        <TrendingBooks />
        <PersonalizedCTA />
        <Testimonials />
        <UploadBooks />
        <Footer /> 
    </>
  );
}