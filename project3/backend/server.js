const express = require("express");
// const session = require('express-session');
// const passport = require('passport');
// const authRoutes = require('./authRoutes');
const { Pool } = require("pg");

const cors = require("cors");
// app.use(session({ secret: oauth.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());

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



app.get("/api/employees", async (req, res) => {
  try {
    const client = await pool.connect();
    const query = "SELECT * FROM employees";
    const result = await client.query(query);
    client.release();

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching employees", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const client = await pool.connect();
    const query = "SELECT * FROM orders";
    const result = await client.query(query);
    client.release();

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.delete("/api/removeorder/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const client = await pool.connect();
    
    const checkQuery = "SELECT * FROM orders WHERE orderid = $1";
    const checkResult = await client.query(checkQuery, [orderId]);

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const deleteQuery = "DELETE FROM orders WHERE orderid = $1";
    await client.query(deleteQuery, [orderId]);

    client.release();

    res.json({ message: "Order removed successfully" });
  } catch (error) {
    console.error("Error removing order", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/api/placeorder", async (req, res) => {

  try {
    const client = await pool.connect();

    const cartItems = req.body;
    let totalPrice = 0;

    for(let i = 0; i < cartItems.length; ++i){
      totalPrice += cartItems[i]['totalPrice'];
    }

    let currentTime = new Date().toISOString();

    let calories = Math.floor(1000 + Math.random() * 2001);
    let customerid = Math.floor(10000 + Math.random() * 90000);

    let insertQuery =
      "INSERT INTO orders (orderdatetime, customerid, price, calories) values (" +
      currentTime +
      ", " +
      customerid +
      ", " +
      totalPrice +
      ", " +
      calories +
      ")";

      // let query = `INSERT INTO orders (orderdatetime, customerid, price, calories) VALUES ('2023-11-01 11:58:13', 11111, 62.50, 2500);`;
      // let customerid = 11112;

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

  } catch (error) {
    console.error("Error making order", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/login", async (req, res) => {

  const { name, id } = req.query;

  try {
    const client = await pool.connect();
    const query = `SELECT name FROM customers where name = '${name}' and id = ${id}`;
    const result = await client.query(query);
    client.release();

    res.json(result);
  } catch (error) {
    console.error("Error fetching name", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/emplogin", async (req, res) => {

  const { id, password } = req.query;

  try {
    const client = await pool.connect();
    const query = `SELECT name, position FROM employees where id = ${id} and password = '${password}'`;
    const result = await client.query(query);
    client.release();

    res.json(result);
  } catch (error) {
    console.error("Error fetching name", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});