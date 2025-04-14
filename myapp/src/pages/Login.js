import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Add the CSS file

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to speak the welcome message
    const speakMessage = (message) => {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    };

    // Speak the welcome message on component load
    speakMessage("Welcome to Third Eye. Press Shift Z for login.");

    // Hotkey listener for Shift + Z
    const handleHotKey = (event) => {
      if (event.shiftKey && event.code === "KeyZ") {
        // Send a request to the backend to start Streamlit
        axios
          .get("http://localhost:5001/run-streamlit")
          .then((response) => {
            console.log("Streamlit server started:", response.data);
          })
          .catch((error) => {
            console.error("Error starting Streamlit:", error);
          });
      }
    };

    window.addEventListener("keydown", handleHotKey);

    return () => {
      window.removeEventListener("keydown", handleHotKey);
    };
  }, []);

  useEffect(() => {
    // Poll the backend for successful login
    const interval = setInterval(() => {
      axios
        .get("http://localhost:5001/check-login-status")
        .then((response) => {
          if (response.data.status === "success") {
            console.log("Login successful, navigating to Home page.");
            navigate("/home"); // Redirect to the Home page
          }
        })
        .catch((error) => {
        

          console.error("Error checking login status:", error);
        });
        
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigate]);

  return (
    <div className="login-container">
      <div>
        <h1>THIRD EYE</h1>
      </div>
      <br />
      <h1 className="typewriter">
        Press Shift + Z to Start the Login Voice Assistant
      </h1>
    </div>
  );
};

export default Login;
