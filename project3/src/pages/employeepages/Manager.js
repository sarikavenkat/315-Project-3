import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./managerstyle.css";

const Manager = () => {
  const [employee, setEmployee] = useState([]);
  useEffect(() => {
    // Fetch employee data from API and update state
    // Placeholder: Replace the following line with actual API call
    // fetchEmployeeData().then(data => setEmployee(data));
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const managerName = state && state.managerName;

  // I want to be able to track employee work schedule
  const handleCheckEmployeeSchedules = (index) => {
    // Placeholder: Implement logic to track employee work schedule
    console.log("Tracking employee work schedule for index:", index);
  };

  // I want to be able to view the order history
  const handleViewOrderHistory = () => {
    // Placeholder: Implement logic to view order history
    console.log("Viewing order history");
  };

  // I want to be able to remove the order items table from the db
  const handleRemoveOrderItems = () => {
    // Placeholder: Implement logic to remove order items from the database
    console.log("Removing order items from the database");
  };

  // I want to be able to append the order specifics onto the order history
  const handleAppendToOrderHistory = () => {
    // Placeholder: Implement logic to append order specifics to order history
    console.log("Appending order specifics to order history");
  };

  const handleLogout = () => {
    navigate('/emplogin');
  };

  return (
    <div>
      <h1>
        Welcome, Manager: {managerName}
      </h1>
      <div className="employee-times">
        <p>Total Price: ${/* Add logic to calculate total price */}</p>
        <button onClick={() => handleCheckEmployeeSchedules(/* Add employee index */)}>
          Add Item to Cart
        </button>
        <button onClick={handleViewOrderHistory}>View Order History</button>
        <button onClick={handleRemoveOrderItems}>Remove Order Items</button>
        <button onClick={handleAppendToOrderHistory}>Append to Order History</button>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Manager;
