import React, { useState, useEffect } from "react";
import Layout from '../Layout';
import "./menustyle.css";

/** A module representing the HTML for Sweet Paris' menu page.
 *  @module Menu
 *  @returns HTML for Menu page
 */
const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  /** Fetches menu items from postgres database, which the site then displays
   * @alias module:Menu.fetchMenuItems
  */
  const fetchMenuItems = async () => {
    try {
      const response = await fetch("http://3.17.222.225:5000/api/items");
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        throw Error("Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching menu items", error);
    }
  };

  const foodItems = menuItems.filter((item) => item.food);
  const drinkItems = menuItems.filter((item) => item.drink);
  const nonFoodItems = menuItems.filter((item) => item.drink === false && item.food === false);
  const seasonalItems = menuItems.filter((item) => item.itemid > 26);

  return (
    <Layout>
      <div className="menu">
        <h1>Menu</h1>
        <div className="menu-columns">
          <div className="menu-column">
            <h2>Food</h2>
            {foodItems.map((item, index) => (
              <div key={index} className="menu-item">
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Calories: {item.calories}</p>
              </div>
            ))}
          </div>

          <div className="menu-column">
            <h2>Drink</h2>
            {drinkItems.map((item, index) => (
              <div key={index} className="menu-item">
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Calories: {item.calories}</p>
              </div>
            ))}
          </div>

          <div className="menu-column">
            <h2>Non-Food</h2>
            {nonFoodItems.map((item, index) => (
              <div key={index} className="menu-item">
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Calories: {item.calories}</p>
              </div>
            ))}
          </div>

          <div className="menu-column">
            <h2>Seasonal</h2>
            {seasonalItems.map((item, index) => (
              <div key={index} className="menu-item">
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Calories: {item.calories}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
