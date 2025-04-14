import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./pages/Header";
import HeroSection from "./pages/HeroSection";
import Features from "./pages/Features";
import About from "./pages/About";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AudioQuiz from './pages/AudioQuiz';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<AudioQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
