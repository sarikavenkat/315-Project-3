const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'csce315_970_03user',
  host: 'csce-315-db.engr.tamu.edu',
  database: 'csce315_970_03db',
  password: 'fourfsd',
  port: 5432,
  ssl: {rejectUnauthorized: false}
});

app.get('/api/items', async (req, res) => {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM items';
      const result = await client.query(query);
      const menuItems = result.rows;
      client.release();
  
      res.json(menuItems);
    } catch (error) {
      console.error('Error fetching menu items', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});