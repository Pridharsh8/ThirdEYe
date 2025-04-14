import React from "react";
import "./About.css";
import lap from '../pic/lap.png';

function About() {
  return (
    <section className="about-section">
      <div className="about-content">
        <h2>Explore Thousands of Creative Classes.</h2>
        <p>
          Dramatically supply transparent deliverables before backward comp
          internal or "organic" sources. Competently leverage other.
        </p>
        <button>Read More</button>
      </div>
      <div className="about-image">
        {/* Replace with an actual image tag in production */}
        <img src={lap} alt="Student studying" />
        
      </div>
    </section>
  );
}

export default About;
