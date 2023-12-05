import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./managerstyle.css";
import Layout from '../../Layout';

const Manager = () => {
  const [employee, setEmployee] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredEmployeeData, setFilteredData] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [deleteOrderNumber, setDeleteOrderNumber] = useState(0);
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
    console.log(employee);
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
    console.log(filteredEmployee.length);
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

    //console.log(orderList);
    console.log(orders.length);
    console.log("Viewing order history");
  };


  const handleDeleteOrderItems = async (orderId) => {
    
    try {
      const response = await fetch(`http://localhost:5000/api/removeorder/${orderId}`, {
        method: 'DELETE',
      });
      console.log("try");

      if (response.ok) {
        console.log("if");
        console.log('Order removed successfully');
        fetchOrders();
      } else if (response.status === 404) {
        console.log("else if");
        console.log('Order not found');
      } else {
        console.log("else");
        throw new Error('Failed to remove order');
      }
    } catch (error) {
        console.log("error");
        console.error('Error removing order', error);
    }
  };

  const handleAppendToOrderHistory = () => {

    console.log("Appending order specifics to order history");
  };

  const handleProductUsageChart = () => {

  };
    

  const handleLogout = () => {
    navigate("/emplogin");
  };

  // TODO
  useEffect(() => {
    // Fetch inventory data on component mount
    fetch('http://localhost:5000/api/inventory')
      .then(response => response.json())
      .then(data => setInventory(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [newQuantity, setNewQuantity] = useState(0);
  const [showInventory, setShowInventory] = useState(false)
  
  const handleInventory = () => {
    setShowInventory(!showInventory)
    setShowOrderHistory(false)
    setShowEmployeeTable(false)
  }

  const handleQuantityUpdate = () => {
    // Update quantity when the button is clicked
    if (selectedItem && newQuantity !== '') {
      fetch(`http://localhost:5000/api/inventory/${selectedItem}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
          // Refresh the inventory data after updating quantity
          fetch('http://localhost:5000/api/inventory')
            .then(response => response.json())
            .then(data => setInventory(data))
            .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
    }
  };

  const [salesData, setSalesData] = useState([]);
  const [SALEstartDate, setSALEStartDate] = useState('');
  const [SALEendDate, setSALEEndDate] = useState('');
  const [showSalesRep, setshowSalessRep] = useState(false)

  const handleSalesReport = () => {
    setshowSalessRep(!showSalesRep)
  }

  const processSalesReport = () => {
    console.log(SALEstartDate, SALEendDate)
    if (SALEstartDate && SALEendDate) {
      fetch(`http://localhost:5000/api/sales-report?start=${SALEstartDate}&end=${SALEendDate}`)
        .then(response => response.json())
        .then(data => setSalesData(data))
        .catch(error => console.error('Error:', error));
    } 
  }



  const [excessData, setExcessData] = useState([]);
  const [thresholdDate, setThresholdDate] = useState('');
  const [showExcessReport, setshowExcessReport] = useState(false)

  const handleExcessReport = () => {
    setshowExcessReport(!showExcessReport)
  }

  const processExcessReport = () => {
    if (thresholdDate) {
      fetch(`http://localhost:5000/api/excess-report?thresholdDate=${thresholdDate}`)
        .then(response => response.json())
        .then(data => setExcessData(data))
        .catch(error => console.error('Error:', error));
    }
  };

  const [restockData, setRestockData] = useState([]);
  const [showRestock, setshowRestock] = useState(false)
  // TODO
  const handleRestockReport = () => {
    setshowRestock(!showRestock)
  }

  const processRestockReport = () => {
    fetch('http://localhost:5000/api/restock-report')
      .then(response => response.json())
      .then(data => setRestockData(data))
      .catch(error => console.error('Error:', error));
  };

  // TODO
  const handleUpdateItems = () => {
    
  }

  // TODO
  const handleTrendReport = () => {
    
  }

  // TODO
  const handlePopularityAnalysis = () => {
    
  }

  const [showEmployeeTable, setShowEmployeeTable] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  // const [showProductUsageChart, setshowProductUsageChart] = useState(false);

  return (
    <Layout>
      {/* <div className="components"> */}
        
        <h1>Welcome, Manager: {managerName}</h1>
        <button onClick={handleLogout}>Logout</button>
        <div className="options"> 
          <div className="employee-times">
            <button
              onClick={() => {
                handleCheckEmployeeSchedules();
                setShowEmployeeTable(!showEmployeeTable);
                setShowOrderHistory(false);
                setShowInventory(false)

              }}
            >
              Check Employee Schedules
            </button>
          </div>
          <div className="OrderHistory">
            <button
              onClick={() => {
                handleViewOrderHistory();
                setShowEmployeeTable(false);
                setShowOrderHistory(!showOrderHistory);
              }}
            >
              View Order History
            </button>
          </div>

          <div className="ProductUsageChart">
            <button
              onClick={() => {
                handleProductUsageChart();
              }}
            >
              Product Usage Chart
            </button>
          </div>

          <div className="Inventory">
            <button
              onClick={() => {
                handleInventory();
              }}
            >
              Inventory
            </button>
          </div>

          <div className="SalesReport">
            <button
              onClick={() => {
                handleSalesReport();
              }}
            >
              Sales Report
            </button>
          </div>

          <div className="ExcessReport">
            <button
              onClick={() => {
                handleExcessReport();
              }}
            >
              Excess Report
            </button>
          </div>

          <div className="RestockReport">
            <button
              onClick={() => {
                handleRestockReport();
              }}
            >
              Restock Report
            </button>
          </div>

          <div className="UpdateItems">
            <button
              onClick={() => {
                handleUpdateItems();
              }}
            >
              Update Items
            </button>
          </div>

          <div className="TrendReport">
            <button
              onClick={() => {
                handleTrendReport();
              }}
            >
              Ordering Trend Report
            </button>
          </div>

          <div className="PopularityAnalysis">
            <button
              onClick={() => {
                handlePopularityAnalysis();
              }}
            >
              Popularity Analysis
            </button>
          </div>
          
          {/* <div className="DeleteOrder">
            <label>
              Delete Orders by Number:
              <input
                type="number"
                value={deleteOrderNumber}
                id = "myInput"
                onChange={(e) => setDeleteOrderNumber(e.target.value)}
              />
              <button onClick={() =>handleDeleteOrderItems(1)}>Delete Orders</button>
            </label>
          </div> */}
        </div>

        {showOrderHistory && (
        <div>
          <button onClick={() => setIndex((prevIndex) => prevIndex - 20)}>
            Previous Orders
          </button>
          <button
            onClick={() => {
              setIndex((prevIndex) => prevIndex + 20);
            }}>
            Next Orders
          </button>
        </div>
      )}

            {showEmployeeTable && !showOrderHistory && (
              <div className="">
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
              </div>
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

      {showInventory && (
        <div>
          <label htmlFor="itemDropdown">Select Item:</label>
          <select id="itemDropdown" onChange={(e) => setSelectedItem(e.target.value)}>
            {inventory.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>

          <label htmlFor="quantityInput">Enter Quantity:</label>
          <input type="number" id="quantityInput" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} min="0" />

          <button onClick={handleQuantityUpdate}>Update Quantity</button>


          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          
        </div>
      )}

      {showSalesRep && (
        <div>
        <h2>Sales Report</h2>
  
        <label htmlFor="startDateInput">Start Date:</label>
        <input
          type="date"
          id="startDateInput"
          value={SALEstartDate}
          onChange={(e) => setSALEStartDate(e.target.value)}
        />
  
        <label htmlFor="endDateInput">End Date:</label>
        <input
          type="date"
          id="endDateInput"
          value={SALEendDate}
          onChange={(e) => setSALEEndDate(e.target.value)}
        />
  
        <button onClick={processSalesReport}>Generate Report</button>
  
        {salesData.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map(item => (
                  <tr key={item.order_id}>
                    <td>{item.order_id}</td>
                    <td>{item.item_name}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {showExcessReport && (
        <div>
        <h2>Excess Report</h2>
  
        <label htmlFor="thresholdDateInput">Threshold Date:</label>
        <input
          type="date"
          id="thresholdDateInput"
          value={thresholdDate}
          onChange={(e) => setThresholdDate(e.target.value)}
        />
  
        <button onClick={processExcessReport}>Generate Report</button>
  
        {excessData.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity Sold</th>
                </tr>
              </thead>
              <tbody>
                {excessData.map(item => (
                  <tr key={item.item_name}>
                    <td>{item.item_name}</td>
                    <td>{item.total_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {showRestock && (
        <div>
        <h2>Restock Report</h2>
  
        <button onClick={processRestockReport}>Generate Report</button>
  
        {restockData.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {restockData.map(item => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}   

            
          {/* </div> */}
    </Layout>
  );
};

export default Manager;