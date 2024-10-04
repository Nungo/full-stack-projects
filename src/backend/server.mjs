import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

// Load environment variables from .env
dotenv.config();

const { Pool } = pg;

// Set up the database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://admin:KpM6wT7B8x1Icb1ELmFHYk8gKZCCLR2V@dpg-crkjfnu8ii6s7380q5c0-a.frankfurt-postgres.render.com/nungo_rajd',
  ssl: {
    rejectUnauthorized: false, // Set to false for Render to avoid SSL issues
  },
  connectionTimeoutMillis: 20000, // 20 seconds connection timeout
  idleTimeoutMillis: 60000,       // 60 seconds idle timeout
});

// Connect to the database and handle errors
pool.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => {
    console.error('Database connection error', err.message);
    process.exit(1); // Exit the app if the database connection fails
  });

// Initialize Express
const app = express();

// Set up custom CORS for development (localhost) or production (my frontend URL)
const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow credentials like cookies
  optionsSuccessStatus: 200, // For legacy browsers that don't accept 204
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json()); // For parsing application/json

// POST route for registration
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);

    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error executing query', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST route for login
app.post('/api/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Retrieve the user by username or email
    const result = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [usernameOrEmail, usernameOrEmail]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      // Compare provided password with the stored hashed password
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        res.json({ message: 'Login successful!' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error executing query', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// CRUD routes for managing dashboard items

// Get all dashboard items
app.get('/api/dashboard-items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dashboard_items');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching dashboard items', error.message);
    res.status(500).json({ message: 'Error fetching dashboard items' });
  }
});

// Add a new item to the dashboard
app.post('/api/dashboard-items', async (req, res) => {
  const { name, quantity } = req.body; // Use 'name' for the item name

  // Check if both name and quantity are provided
  if (!name || quantity === undefined) {
    return res.status(400).json({ message: 'Name and quantity are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO dashboard_items (name, quantity) VALUES ($1, $2) RETURNING *',
      [name, quantity] // Use 'name' for the item name
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding item', error.message);
    res.status(500).json({ message: 'Error adding item' });
  }
});

// Update an item on the dashboard
app.put('/api/dashboard-items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body; // Use 'name' for the item name

  try {
    const result = await pool.query(
      'UPDATE dashboard_items SET name = $1, quantity = $2 WHERE id = $3 RETURNING *',
      [name, quantity, id] // Use 'name' for the item name
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating item', error.message);
    res.status(500).json({ message: 'Error updating item' });
  }
});

// Delete an item from the dashboard
app.delete('/api/dashboard-items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM dashboard_items WHERE id = $1', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item', error.message);
    res.status(500).json({ message: 'Error deleting item' });
  }
});

// Test route for checking API status
app.get('/', (req, res) => {
  res.send('Welcome to the Kota Shop API!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});


















