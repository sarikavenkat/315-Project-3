import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./managerstyle.css";

const Manager = () => {
  const [employee, setEmployee] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const managerName = state && state.managerName;

    useEffect(() => {
        fetchEmployees();
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/items");
          if (response.ok) {
            console.log("fetchmenuItems");
            const data = await response.json();
            setMenuItems(data);
          } else {
            throw new Error("Failed to fetch menu items");
          }
        } catch (error) {
          console.error("Error fetching menu items", error);
        }
      };

    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/employees");
            if (response.ok) {
              console.log("fetchemployees");
              const data = await response.json();
              //console.log(data[0]);
              setEmployee(data);
              //console.log(employee)
            } else {
              throw new Error("Failed to fetch menu items");
            }
          } catch (error) {
            console.error("Error fetching menu items", error);
          }
      };

      

  // I want to be able to track employee work schedule
  const handleCheckEmployeeSchedules = (index) => {
    const filteredEmployee = [];
    employee.forEach(element => {
        filteredEmployee.push({ ['name']: element['name'], ['id']: element['id'], ['next_work_day']: element['next_work_day'].slice(0, -14), ['start_time']: element['start_time'], ['end_time']: element['end_time']}); 
    });
    setFilteredData(filteredEmployee);
    //console logs
    console.log("filtered data: ");
    console.log(filteredData);
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

  const [showTable, setShowTable] = useState(false);

  return (
    <div>
      <h1>Welcome, Manager: {managerName}</h1>
      <div className="employee-times">
        <p>Total Price: ${/* Add logic to calculate total price */}</p>
        <button onClick={() => {
          handleCheckEmployeeSchedules(/* Add employee index */);
          setShowTable(!showTable); // Show the table when the button is clicked
        }}>
          Check Employee Schedules
        </button>
        <button onClick={handleViewOrderHistory}>View Order History</button>
        <button onClick={handleRemoveOrderItems}>Remove Order Items</button>
        <button onClick={handleAppendToOrderHistory}>Append to Order History</button>
      </div>
      <button onClick={handleLogout}>Logout</button>

      {/* Display the table only when showTable is true */}
      {showTable && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Next Work Day</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name}</td>
                <td>{employee.id}</td>
                <td>{employee.next_work_day}</td>
                <td>{employee.start_time}</td>
                <td>{employee.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Manager;
