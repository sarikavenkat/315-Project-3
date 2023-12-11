const express = require("express");

//const authRoutes = require("./auth-routes");
//const passportSetup = require('./passport');
//const mongoose = require('mongoose');
//const keys = require('./keys');
//const cookieSession = require('cookie-session');
const { Pool } = require("pg");

const app = express();
const cors = require("cors");

/*
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: keys.auth0.clientSecret,
  baseURL: 'http://localhost:3000',
  clientID: keys.auth0.clientID,
  issuerBaseURL: keys.auth0.baseURL
};

app.use(cors());
app.use(express.json());
*/

////const app = express();

app.use(cors());
app.use(express.json()); 

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://www.pauljwbae.com'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});



/*app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(keys.mongodb.dbURI, ()=>{
  console.log("connected to mongodb");
});
app.use("/auth",authRoutes);*/



// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

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

app.post('/api/employees', async (req, res) => {
  try {
    const {
      name,
      id,
      position,
      next_work_day,
      start_time,
      end_time,
      // Add other properties as needed
    } = req.body;

    const client = await pool.connect();
    const query = `
      INSERT INTO employees (name, id, position, next_work_day, start_time, end_time, phone_number, hourly_pay, manager, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    await client.query(query, [name, id, position, next_work_day, start_time, end_time, '1234567890', 12.25, 'Katharina Johnson', '11111']);
    client.release();

    res.json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/employees/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const { position, password } = req.body;

  try {
    if (position) {
      // Convert position to lowercase before updating
      console.log('Employee ID:', employeeId);
      console.log('New Position:', position);

      const query = 'UPDATE employees SET position = LOWER($1) WHERE id = $2';
      console.log('SQL Query:', query);

      const result = await pool.query(query, [position, employeeId]);
      console.log('Employee position updated successfully');
    }

    if (password) {
      // Update the password if provided
      const passwordQuery = 'UPDATE employees SET password = $1 WHERE id = $2';
      await pool.query(passwordQuery, [password, employeeId]);
      console.log('Employee password updated successfully');
    }

    res.json({ message: 'Employee details updated successfully' });
  } catch (error) {
    console.error('Error updating employee details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const client = await pool.connect();
    const query = "SELECT * FROM orders order by orderid desc";
    const result = await client.query(query);
    client.release();

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/api/orders/:orderid', async (req, res) => {
  const orderid = req.params.orderid;
  try {
    const client = await pool.connect();
    console.log(orderid)
    await client.query(`DELETE FROM orders WHERE orderid = ${orderid}`);
    res.send('Item deleted successfully');
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
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

app.get('/api/ingredients', async (req, res) => {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM ingredients;';  
    const result = await client.query(query);
    res.send(result.rows);
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.delete('/api/ingredients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM ingredients WHERE name = $1', [id]);
    res.send({ message: `Deleted ingredient with ID: ${id}` });
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post('/api/ingredients', async (req, res) => {
  try {
    const {
      name,
      quantity,
      // Add other properties as needed
    } = req.body;

    const client = await pool.connect();
    const query = `
      INSERT INTO ingredients (name, quantity)
      VALUES ($1, $2)
    `;
    await client.query(query, [name, quantity]);
    client.release();

    res.json({ message: 'ingredient added successfully' });
  } catch (error) {
    console.error('Error adding ingredient:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/ingredients/:id', async (req, res) => {
  const { name, quantity } = req.body;

  try {
    const ingredient = await ingredient.findByName(name);

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    // Update the properties
    ingredient.quantity = quantity;

    const query = 'UPDATE ingredients SET quantity = $1 WHERE name = $2';
    const result = await pool.query(query, [quantity, name]);

    res.json(ingredient);
  } catch (error) {
    console.error('Error editing ingredient:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/api/trend-report', async (req, res) => {
  const { start, end } = req.query;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT t1.item_name AS item1, t2.item_name AS item2, COUNT(*) AS pair_count
       FROM orderitems t1
       JOIN orderitems t2 ON t1.order_id = t2.order_id AND t1.item_name < t2.item_name
       JOIN orders o1 ON t1.order_id = o1.orderid
       JOIN orders o2 ON t2.order_id = o2.orderid
       WHERE o1.orderdatetime BETWEEN '${start} 00:00:00' AND '${end} 23:59:59'
       AND o2.orderdatetime BETWEEN '2022-01-01 00:00:00' AND '2023-10-10 23:59:59'
       GROUP BY t1.item_name, t2.item_name
       ORDER BY pair_count DESC`
    );
    res.send(result.rows);
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/api/popularity-analysis', async (req, res) => {
  const { start, end } = req.query;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT orderitems.item_name, SUM(orderitems.quantity) AS total_sold
       FROM orders
       INNER JOIN orderitems ON orders.orderid = orderitems.order_id
       WHERE orders.orderdatetime BETWEEN $1 AND $2
       GROUP BY orderitems.item_name
       ORDER BY total_sold DESC`,
      [`${start} 00:00:00`, `${end} 23:59:59`]
    );
    res.send(result.rows);
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM items');
    res.send(result.rows);
    client.release();
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post('/api/items', async (req, res) => {
  const newItem = req.body;
  try {
    const client = await pool.connect();
    await client.query(
      `INSERT INTO items (name, containsWheat, containsMilk, containsEggs, containsAlcohol, price, calories, drink, food)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        newItem.name,
        newItem.containsWheat,
        newItem.containsMilk,
        newItem.containsEggs,
        newItem.containsAlcohol,
        newItem.price,
        newItem.calories,
        newItem.drink,
        newItem.food,
      ]
    );
    res.send('Item added successfully');
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.delete('/api/items/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const client = await pool.connect();
    console.log(name)
    await client.query(`DELETE FROM items WHERE name = '${name}'`);
    res.send('Item deleted successfully');
    client.release();
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

app.delete('/api/employees/:employeeId', async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Use a SQL DELETE query to delete the employee
    const query = 'DELETE FROM employees WHERE id = $1';
    const result = await pool.query(query, [employeeId]);

    console.log('Employee deleted successfully');

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});