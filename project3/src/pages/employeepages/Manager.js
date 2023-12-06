import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./managerstyle.css";
import Layout from '../../Layout';

/**A module representing the HTML for Sweet Paris' home page.
 * @module Manager
 * @returns HTML for Manager page
*/
const Manager = () => {
  const [employee, setEmployee] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredEmployeeData, setFilteredData] = useState([]);
  const [orderList, setOrderList] = useState([]);
  // const [deleteOrderNumber, setDeleteOrderNumber] = useState(0);
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const managerName = state && state.managerName;

  useEffect(() => {
    fetchEmployees();
    fetchOrders();
  }, []);

  /**Fetches record of orders from Postgres database
   * @alias module:Manager.fetchOrders
   */
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

  /** Fetches list of employees from Postgres database
   * @alias module:Manager.fetchEmployees
   */
  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/employees");
      if (response.ok) {
        console.log("fetchemployees");
        const data = await response.json();
        setEmployee(data);
      } else {
        throw new Error("Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };
  /** Fetches details for each employee's next work day from the Postgres database
   * @alias module:Manager.handleCheckEmployeeSchedules
  */
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

  /** Views 20 of the orders from the orders database
   * @alias module:Manager.handleViewOrderHistory
   */
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
  /** Removes an order from the postgres database
   * @alias module:Manager.handleDeleteOrderItems
   * @param {int} orderId - Specifies which order to remove
   */
  const handleDeleteOrderItems = async (orderId) => {
    
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/removeorder/${orderId}`, {
  //       method: 'DELETE',
  //     });
  //     console.log("try");

  //     if (response.ok) {
  //       console.log("if");
  //       console.log('Order removed successfully');
  //       fetchOrders();
  //     } else if (response.status === 404) {
  //       console.log("else if");
  //       console.log('Order not found');
  //     } else {
  //       console.log("else");
  //       throw new Error('Failed to remove order');
  //     }
  //   } catch (error) {
  //       console.log("error");
  //       console.error('Error removing order', error);
  //   }
  // };

  // const handleAppendToOrderHistory = () => {

  //   console.log("Appending order specifics to order history");
  // };

  const [productUsageData, setProductUsageData] = useState([]);
  const [PRODstartDate, setPRODStartDate] = useState('');
  const [PRODendDate, setPRODEndDate] = useState('');
  const [showProd, setshowProd] = useState(false)

  const processProductUsageChart = () => {
    if (PRODstartDate && setPRODStartDate) {
      fetch(`http://localhost:5000/api/product-usage-chart?start=${PRODstartDate}&end=${PRODendDate}`)
        .then(response => response.json())
        .then(data => setProductUsageData(data))
        .catch(error => console.error('Error:', error));
    }
  };

  const handleProductUsageChart = () => {
    setshowProd(!showProd)
    setShowInventory(false)
    setShowOrderHistory(false)
    setShowEmployeeTable(false)
    setshowPop(false)
    setshowTrend(false)
    setshowExcessReport(false)
    setshowRestock(false)
    setshowSalessRep(false)
    setshowItems(false)
  };
    

  /** Navigates back to employeelogin, thus "logging out"
   *  @alias module:Manager.handleLogout
   */
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
    setshowPop(false)
    setshowTrend(false)
    setshowExcessReport(false)
    setshowRestock(false)
    setshowSalessRep(false)
    setshowProd(false)
    setshowItems(false)
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
    setShowOrderHistory(false)
    setShowEmployeeTable(false)
    setShowInventory(false)
    setshowPop(false)
    setshowTrend(false)
    setshowExcessReport(false)
    setshowRestock(false)
    setshowProd(false)
    setshowItems(false)
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
    setShowOrderHistory(false)
    setShowEmployeeTable(false)
    setShowInventory(false)
    setshowPop(false)
    setshowTrend(false)
    setshowRestock(false)
    setshowSalessRep(false)
    setshowProd(false)
    setshowItems(false)
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
    setShowOrderHistory(false)
    setShowEmployeeTable(false)
    setShowInventory(false)
    setshowPop(false)
    setshowTrend(false)
    setshowExcessReport(false)
    setshowSalessRep(false)
    setshowProd(false)
    setshowItems(false)
  }

  const processRestockReport = () => {
    fetch('http://localhost:5000/api/restock-report')
      .then(response => response.json())
      .then(data => setRestockData(data))
      .catch(error => console.error('Error:', error));
  };

  const [items, setItems] = useState([]);
  const [showItems, setshowItems] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    containsWheat: false,
    containsMilk: false,
    containsEggs: false,
    containsAlcohol: false,
    price: 0,
    calories: 0,
    drink: false,
    food: false,
  });

  const fetchItems = () => {
    fetch('http://localhost:5000/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpdateItems = () => {
    // Implement functionality to update items
    setshowItems(!showItems)
    setShowOrderHistory(false)
    setShowEmployeeTable(false)
    setShowInventory(false)
    setshowPop(false)
    setshowTrend(false)
    setshowExcessReport(false)
    setshowRestock(false)
    setshowSalessRep(false)
    setshowProd(false)
  };

  const handleAddItem = () => {
    fetch('http://localhost:5000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then(response => response.json())
      .then(() => {
        fetchItems(); // Refresh the items after adding a new one
        setNewItem({
          name: '',
          containsWheat: false,
          containsMilk: false,
          containsEggs: false,
          containsAlcohol: false,
          price: 0,
          calories: 0,
          drink: false,
          food: false,
        });
      })
      .catch(error => console.error('Error:', error));
  };

  const handleDeleteItem = (name) => {
    fetch(`http://localhost:5000/api/items/${name}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        fetchItems(); // Refresh the items after deleting one
      })
      .catch(error => console.error('Error:', error));
  };
  const [trendReportData, setTrendReportData] = useState([]);
  const [PAIRstartDate, setPAIRStartDate] = useState('');
  const [PAIRendDate, setPAIREndDate] = useState('');
  const [showTrend, setshowTrend] = useState(false)

  const handleTrendReport = () => {
    setshowTrend(!showTrend)
    setShowOrderHistory(false)
    setShowEmployeeTable(false)
    setShowInventory(false)
    setshowPop(false)
    setshowExcessReport(false)
    setshowRestock(false)
    setshowSalessRep(false)
    setshowProd(false)
    setshowItems(false)
  }

  const processTrendReport = () => {
    if (PAIRstartDate && PAIRendDate) {
      fetch(`http://localhost:5000/api/trend-report?start=${PAIRstartDate}&end=${PAIRendDate}`)
        .then(response => response.json())
        .then(data => setTrendReportData(data))
        .catch(error => console.error('Error:', error));
    }
  };

  const [popularityData, setPopularityData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showPop, setshowPop] = useState(false)

  const processPopularityAnalysis = () => {
    if (startDate && endDate) {
      fetch(`http://localhost:5000/api/popularity-analysis?start=${startDate}&end=${endDate}`)
        .then(response => response.json())
        .then(data => setPopularityData(data))
        .catch(error => console.error('Error:', error));
    }
  };

  const handlePopularityAnalysis = () => {
    setshowPop(!showPop)
    setshowTrend(false)
    setShowOrderHistory(false)
    setShowEmployeeTable(false)
    setShowInventory(false)
    setshowExcessReport(false)
    setshowRestock(false)
    setshowSalessRep(false)
    setshowProd(false)
    setshowItems(false)
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
                setshowPop(false)
                setShowInventory(false)
                setshowExcessReport(false)
                setshowRestock(false)
                setshowSalessRep(false)
                setshowProd(false)
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
                setshowPop(false)
                setShowInventory(false)
                setShowOrderHistory(!showOrderHistory);
                setshowExcessReport(false)
                setshowRestock(false)
                setshowSalessRep(false)
                setshowProd(false)
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
              What Sells Together
            </button>
          </div>

          <div className="PopularityAnalysis">
            <button
              onClick={() => {
                handlePopularityAnalysis();
              }}
            >
              Menu Items Popularity Analysis
            </button>
          </div>
          
        </div>

        {showOrderHistory && (
        <div>
          <h2>Order History</h2>
          {/* <button onClick={() => setIndex((prevIndex) => prevIndex - 20)}>
            Previous Orders
          </button>
          <button
            onClick={() => {
              setIndex((prevIndex) => prevIndex + 20);
            }}>
            Next Orders
          </button> */}
        </div>
      )}

            {showEmployeeTable && !showOrderHistory && (
              <div className="">
                <h2>Employee Schedules</h2>
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
                    <th>Action</th>
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
                      <td>
                        <button onClick={() => handleDeleteOrder(orders.orderid)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

      {showInventory && (
        <div>
          <h2>Inventory: </h2>
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

      {showProd && (
        <div>
        <h2>Product Usage Chart</h2>
  
        <label htmlFor="startDateInput">Start Date:</label>
        <input
          type="date"
          id="startDateInput"
          value={PRODstartDate}
          onChange={(e) => setPRODStartDate(e.target.value)}
        />
  
        <label htmlFor="endDateInput">End Date:</label>
        <input
          type="date"
          id="endDateInput"
          value={PRODendDate}
          onChange={(e) => setPRODEndDate(e.target.value)}
        />
  
        <button onClick={processProductUsageChart}>Generate Chart</button>
  
        {productUsageData.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Total Sold</th>
                </tr>
              </thead>
              <tbody>
                {productUsageData.map(item => (
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

      {showTrend && (
        <div>
        <h2>What Sells Together</h2>
  
        <label htmlFor="startDateInput">Start Date:</label>
        <input
          type="date"
          id="startDateInput"
          value={PAIRstartDate}
          onChange={(e) => setPAIRStartDate(e.target.value)}
        />
  
        <label htmlFor="endDateInput">End Date:</label>
        <input
          type="date"
          id="endDateInput"
          value={PAIRendDate}
          onChange={(e) => setPAIREndDate(e.target.value)}
        />
  
        <button onClick={processTrendReport}>Generate Report</button>
  
        {trendReportData.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item 1</th>
                  <th>Item 2</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {trendReportData.map(item => (
                  <tr key={`${item.item1}-${item.item2}`}>
                    <td>{item.item1}</td>
                    <td>{item.item2}</td>
                    <td>{item.pair_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )} 

      {showPop && (
        <div>
        <h2>Menu Items Popularity Analysis</h2>
  
        <label htmlFor="startDateInput">Start Date:</label>
        <input
          type="date"
          id="startDateInput"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
  
        <label htmlFor="endDateInput">End Date:</label>
        <input
          type="date"
          id="endDateInput"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
  
        <button onClick={processPopularityAnalysis}>Generate Analysis</button>
  
        {popularityData.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Total Sold</th>
                </tr>
              </thead>
              <tbody>
                {popularityData.map(item => (
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

      {showItems && (
        <div>
        <h2>Update Items</h2>
  
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contains Wheat</th>
              <th>Contains Milk</th>
              <th>Contains Eggs</th>
              <th>Contains Alcohol</th>
              <th>Price</th>
              <th>Calories</th>
              <th>Drink</th>
              <th>Food</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.itemid}>
                <td>{item.name}</td>
                <td>{item.containsWheat ? 'Yes' : 'No'}</td>
                <td>{item.containsMilk ? 'Yes' : 'No'}</td>
                <td>{item.containsEggs ? 'Yes' : 'No'}</td>
                <td>{item.containsAlcohol ? 'Yes' : 'No'}</td>
                <td>{item.price}</td>
                <td>{item.calories}</td>
                <td>{item.drink ? 'Yes' : 'No'}</td>
                <td>{item.food ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleDeleteItem(item.name)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <h2>Add New Item</h2>
        <label htmlFor="nameInput">Name:</label>
        <input
          type="text"
          id="nameInput"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
  
        <label htmlFor="containsWheatInput">Contains Wheat:</label>
        <input
          type="checkbox"
          id="containsWheatInput"
          checked={newItem.containsWheat}
          onChange={() => setNewItem({ ...newItem, containsWheat: !newItem.containsWheat })}
        />
  
        <label htmlFor="containsMilkInput">Contains Milk:</label>
        <input
          type="checkbox"
          id="containsMilkInput"
          checked={newItem.containsMilk}
          onChange={() => setNewItem({ ...newItem, containsMilk: !newItem.containsMilk })}
        />
  
        <label htmlFor="containsEggsInput">Contains Eggs:</label>
        <input
          type="checkbox"
          id="containsEggsInput"
          checked={newItem.containsEggs}
          onChange={() => setNewItem({ ...newItem, containsEggs: !newItem.containsEggs })}
        />
  
        <label htmlFor="containsAlcoholInput">Contains Alcohol:</label>
        <input
          type="checkbox"
          id="containsAlcoholInput"
          checked={newItem.containsAlcohol}
          onChange={() => setNewItem({ ...newItem, containsAlcohol: !newItem.containsAlcohol })}
        />
  
        <label htmlFor="priceInput">Price:</label>
        <input
          type="number"
          id="priceInput"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
  
        <label htmlFor="caloriesInput">Calories:</label>
        <input
          type="number"
          id="caloriesInput"
          value={newItem.calories}
          onChange={(e) => setNewItem({ ...newItem, calories: e.target.value })}
        />
  
        <label htmlFor="drinkInput">Drink:</label>
        <input
          type="checkbox"
          id="drinkInput"
          checked={newItem.drink}
          onChange={() => setNewItem({ ...newItem, drink: !newItem.drink })}
        />
  
        <label htmlFor="foodInput">Food:</label>
        <input
          type="checkbox"
          id="foodInput"
          checked={newItem.food}
          onChange={() => setNewItem({ ...newItem, food: !newItem.food })}
        />
  
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      )}
            
          {/* </div> */}
    </Layout>
  );
};

export default Manager;