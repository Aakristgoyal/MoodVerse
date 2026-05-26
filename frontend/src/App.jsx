import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import AIAssistant from "./pages/AIAssistant";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/community" element={<Community />} />
        <Route path="/ai-assistant" element={<AIAssistant />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;