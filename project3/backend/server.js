const express = require("express");
const { Pool } = require("pg");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "csce315_970_03user",
  host: "csce-315-db.engr.tamu.edu",
  database: "csce315_970_03db",
  password: "fourfsd",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

app.get("/api/items", async (req, res) => {
  try {
    const client = await pool.connect();
    const query = "SELECT * FROM items";
    const result = await client.query(query);
    const menuItems = result.rows.map((row) => {
      return {
        ...row,
        price: parseFloat(row.price)
      }
    });
    client.release();

    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/order", async (req, res) => {

  try {
    const client = await pool.connect();

    const cartItems = req.body;
    let totalPrice = 0;

    for(let i = 0; i < cartItems.length; ++i){
      totalPrice += cartItems[i]['totalPrice'];
    }

    let currentTime = new Date().toISOString();


    // const cartItems = [
    //   {
    //     name: "Item 1",
    //     price: 10.99,
    //     quantity: 2,
    //     totalPrice: 21.98,
    //   },
    // ];

    // console.log(cartItems);
    // console.log(req.query.name);
    


    // let customerIdQueryStart = "SELECT id FROM customers WHERE name = '";
    // let customerIdQuery = customerIdQueryStart.concat(req.query.name + "'");
    // let timeString =
    //   currentTime.getMonth() +
    //   1 +
    //   "/" +
    //   currentTime.getDate() +
    //   "/" +
    //   currentTime.getFullYear() +
    //   " " +
    //   currentTime.getHours() +
    //   currentTime.getMinutes() +
    //   currentTime.getSeconds();


    // console.log(customerIdQuery)

    // pool.query(customerIdQuery).then((query_res) => {
    //   var customerId = query_res_rows[0];
    // });

    let calories = 501;

    let insertQuery =
      "INSERT INTO orders (orderdatetime, customerid, price, calories) values (" +
      currentTime +
      ", " +
      11111 +
      ", " +
      totalPrice +
      ", " +
      calories +
      ")";

      // let query = `INSERT INTO orders (orderdatetime, customerid, price, calories) VALUES ('2023-11-01 11:58:13', 11111, 62.50, 2500);`;
      let customerid = 11112;

      const query = `INSERT INTO orders (orderdatetime, customerid, price, calories) VALUES ('${currentTime}', ${customerid}, ${totalPrice}, ${calories});`;

      pool.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
      } else {
        console.log('Query results:', results.rows);
      }
    
      // Release the client back to the pool
      pool.end();
    });

    // console.log(insertQuery)
    // pool.query(insertQuery).then((query_res) => {});
    // pool.query('SELECT order_id FROM orders ORDER BY ID DESC LIMIT 1').then(query_res=>{ let orderId = query_res_rows[0]});
    // for(let i=0; i<cartItems.length;i++){
    //   let itemName = cartItems[i].name;
    //   let quantity = cartItems[i].quantity;
    //   let insertItemQuery = 'INSERT INTO orderitems (order_id, item_name, quantity) VALUES (' +
    //   orderId + ', ' + itemName + ', '+ quantity + ')';
    //   pool.query(insertItemQuery).then((query_res) => {});

    // }

    // client.release();
  } catch (error) {
    console.error("Error making order", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
