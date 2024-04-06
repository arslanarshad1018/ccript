import React from "react";
import { BsBoxArrowRight } from "react-icons/bs";
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  // Handle logout button click

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/")

  };

  return (
    <nav className="navbar">
      <div className="logo">CCript</div>
      <button className="logout-button" onClick={handleLogout}>
        <BsBoxArrowRight size={30} />
      </button>
    </nav>
  );
};

export default Navbar;
