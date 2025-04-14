import React, { useEffect } from "react";
import "./Herosection.css";
import { useNavigate } from "react-router-dom";
import Rob from '../pic/Rob.png'; // Import your image here

const HeroSection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Speak the content when the page loads
    const speakContent = () => {
      const text = "Welcome to Your Assistant. Press Shift + A to open the virtual assistant or Shift + Z to open quiz.";
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    };

    // Call speakContent on page load
    speakContent();

    // Function to handle hotkey press (Shift + A)
    const handleHotKey = (event) => {
      if (event.shiftKey && event.code === "KeyA") {
        // Send a request to start Streamlit
        fetch("http://localhost:5000/start-streamlit")
          .then((response) => {
            if (response.ok) {
              console.log("Streamlit started successfully");
              alert("Streamlit app started!");
            } else {
              console.error("Failed to start Streamlit");
              alert("Failed to start Streamlit.");
            }
          })
          .catch((error) => console.error("Error:", error));
      }
      if (event.shiftKey && event.code === "KeyZ") {
        navigate("/quiz");
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleHotKey);

    // Clean up the event listener
    return () => {
      window.removeEventListener("keydown", handleHotKey);
    };
  }, [navigate]);

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Welcome to Your Assistant</h1>
        <p>Press Shift + A to open the virtual assistant or Shift + Z to open quiz.</p>
      </div>
      <div className="hero-image">
        <img
          src={Rob} // Use the image source
          alt="Assistant Robot"
          className="hero-image"
          style={{ width: "100%", height: "auto" }} // Set the style to adjust the size
        />
      </div>
    </div>
  );
};

export default HeroSection;
