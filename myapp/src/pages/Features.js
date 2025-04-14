import React from "react";
import "./Features.css";
function Features() {
  const features = [
    { title: "Online Courses", description: "Access world-class materials" },
    { title: "Expert Trainer", description: "Learn from professionals" },
    { title: "Get Certificate", description: "Certification upon completion" },
    { title: "Lifetime Access", description: "Access courses anytime" },
  ];

  return (
    <section className="features-section">
      <h2>For Your Future Learning.</h2>
      <div className="features">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
