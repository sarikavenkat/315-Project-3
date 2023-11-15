import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./managerstyle.css";

const Manager = () => {
  const [employee, setEmployee] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredEmployeeData, setFilteredData] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const managerName = state && state.managerName;

  useEffect(() => {
    fetchEmployees();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      if (response.ok) {
        console.log("fetchorders");
        const data = await response.json();
        setOrders(data);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/employees");
      if (response.ok) {
        console.log("fetchemployees");
        const data = await response.json();
        setEmployee(data);
      } else {
        throw new Error("Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching menu items", error);
    }
  };

  const handleCheckEmployeeSchedules = () => {
    const filteredEmployee = [];
    employee.forEach((element) => {
      filteredEmployee.push({
        name: element.name,
        id: element.id,
        next_work_day: element.next_work_day.slice(0, -14),
        start_time: element.start_time,
        end_time: element.end_time,
      });
    });
    setFilteredData(filteredEmployee);
    console.log("Tracking employee work schedule");
  };

  const handleViewOrderHistory = () => {
    const subsetStartIndex = index;
    const subsetEndIndex = index + 20;
    const tempOrderList = [];

    if (subsetEndIndex < orders.length && subsetStartIndex >= 0) {
      for (let i = subsetStartIndex; i < subsetEndIndex; i++) {
        tempOrderList.push({
          orderid: orders[i].orderid,
          orderdatetime:
            orders[i].orderdatetime.slice(0, -14) +
            " " +
            orders[i].orderdatetime.slice(-13, -5),
          customerid: orders[i].customerid,
          price:"$" +orders[i].price,
          calories: orders[i].calories
        });
      }
      setOrderList(tempOrderList);
    }

    console.log(orderList);
    console.log(orders.length);
    console.log("Viewing order history");
  };

  const handleRemoveOrderItems = () => {
    console.log("Removing order items from the database");
  };

  const handleAppendToOrderHistory = () => {
    console.log("Appending order specifics to order history");
  };

  const handleLogout = () => {
    navigate("/emplogin");
  };

  const [showEmployeeTable, setShowEmployeeTable] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  return (
    <div>
      <h1>Welcome, Manager: {managerName}</h1>

      <div className="employee-times">
        <button
          onClick={() => {
            handleCheckEmployeeSchedules();
            setShowEmployeeTable(!showEmployeeTable);
          }}
        >
          Check Employee Schedules
        </button>
      </div>
      <div className="OrderHistory">
        <button
          onClick={() => {
            handleViewOrderHistory();
            setShowOrderHistory(!showOrderHistory);
          }}
        >
          View Order History
        </button>
      </div>

      <button onClick={handleRemoveOrderItems}>Remove Order Items</button>
      <button onClick={handleAppendToOrderHistory}>
        Append to Order History
      </button>

      <button onClick={() => setIndex((prevIndex) => prevIndex - 20)}>
        
        Previous Orders
      </button>
      <button onClick={() => {
      setIndex((prevIndex) => prevIndex + 20);
      }
      }>
        
        Next Orders
      </button>

      {/* Display the table only when showTable is true */}
      {showEmployeeTable && !showOrderHistory && (
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
            {filteredEmployeeData.map((employee, index) => (
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

      {showOrderHistory && !showEmployeeTable && (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>customer ID</th>
              <th>Date/Time</th>
              <th>Price</th>
              <th>Calories</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((orders, index) => (
              <tr key={index}>
                <td>{orders.orderid}</td>
                <td>{orders.customerid}</td>
                <td>{orders.orderdatetime}</td>
                <td>{orders.price}</td>
                <td>{orders.calories}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Manager;
