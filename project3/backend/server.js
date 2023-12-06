const express = require("express");
const { Pool } = require("pg");

const app = express();
const cors = require("cors");

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

app.get('/api/inventory', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT items.name, inventory.quantity, items.price FROM inventory inner join items on items.itemid = inventory.itemid');
    res.send(result.rows);
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const client = await pool.connect();
    await client.query('UPDATE inventory SET quantity = $1 WHERE name = $2', [quantity, id]);
    res.send({ message: `Updated item ${id} quantity to ${quantity}` });
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/api/sales-report', async (req, res) => {
  const { start, end } = req.query;
  try {
    const client = await pool.connect();
    console.log(`SELECT orderitems.order_id, orderitems.item_name, orderitems.quantity
    FROM orderitems
    INNER JOIN orders ON orders.orderid = orderitems.order_id
    WHERE orders.orderdatetime BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'
    ORDER BY orders.orderdatetime`)
    const result = await client.query(
      `SELECT orderitems.order_id, orderitems.item_name, orderitems.quantity
       FROM orderitems
       INNER JOIN orders ON orders.orderid = orderitems.order_id
       WHERE orders.orderdatetime BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'
       ORDER BY orders.orderdatetime`
    );
    res.send(result.rows);
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/api/excess-report', async (req, res) => {
  const { thresholdDate } = req.query;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT orderitems.item_name, SUM(orderitems.quantity) AS total_sold
       FROM orders
       INNER JOIN orderitems ON orders.orderid = orderitems.order_id
       WHERE orders.orderdatetime BETWEEN '${thresholdDate} 00:00:00' AND '2023-12-18 23:59:59'
       GROUP BY orderitems.item_name
       HAVING SUM(orderitems.quantity) < 10
       ORDER BY total_sold ASC`
    );
    res.send(result.rows);
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/api/restock-report', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT items.name, inventory.quantity
       FROM inventory
       INNER JOIN items ON items.itemid = inventory.itemid
       WHERE inventory.quantity < 20`
    );
    res.send(result.rows);
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/api/product-usage-chart', async (req, res) => {
  const { start, end } = req.query;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT orderitems.item_name, SUM(orderitems.quantity) AS total_sold
       FROM orders
       INNER JOIN orderitems ON orders.orderid = orderitems.order_id
       WHERE orders.orderdatetime BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'
       GROUP BY orderitems.item_name
       ORDER BY orderitems.item_name`
    );
    res.send(result.rows);
  } catch (err) {
    res.status(500).send({ error: err.message });
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
