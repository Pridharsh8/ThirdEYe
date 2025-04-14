import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">THIRD EYE</div>
      
      <div className="search">
        <input type="text" placeholder="Search Courses" />
        <button>Search</button>
      </div>
    </header>
  );
}

export default Header;
