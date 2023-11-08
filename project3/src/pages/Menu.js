import React, { useState, useEffect } from "react";
import "./menustyle.css";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items");
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        throw new Error("Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching menu items", error);
    }
  };

  return (
    <div className="menu">
      <h1>Menu</h1>
      <div className="menu-items">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item">
            <h2>{item.name}</h2>
            <p>Price: ${item.price.toFixed(2)}</p>
            {/* <p>Calories: {item.calorie}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
