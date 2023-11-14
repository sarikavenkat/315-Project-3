import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./managerstyle.css";

const Manager = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const managerName = state && state.managerName;

    const handleLogout = () => {
        navigate('/emplogin'); 
      };

    return (
        <div>
        <h1>
            Welcome, Manager: {managerName} 
        </h1>
        <button onClick={handleLogout}>Logout</button>
        </div>
    )
};

export default Manager;
