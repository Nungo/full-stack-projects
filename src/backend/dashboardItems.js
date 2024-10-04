import { pool } from './server.mjs'; // Ensure you're importing the pool connection

// Fetch inventory items from the database
export const getDashboardItems = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, quantity FROM dashboard_items');
    res.json(result.rows); // Return the fetched items as JSON
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

// Add a new item to the inventory
export const addDashboardItem = async (req, res) => {
  const { name, quantity } = req.body;
  
  try {
    await pool.query('INSERT INTO dashboard_items (name, quantity) VALUES ($1, $2)', [name, quantity]);
    res.json({ message: 'Item added successfully' });
  } catch (error) {
    console.error('Error adding item:', error.message);
    res.status(500).json({ message: 'Failed to add item' });
  }
};

// Update an item's quantity
export const updateDashboardItem = async (req, res) => {
  const { id, quantity } = req.body;
  
  try {
    await pool.query('UPDATE dashboard_items SET quantity = $1 WHERE id = $2', [quantity, id]);
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error.message);
    res.status(500).json({ message: 'Failed to update item' });
  }
};

// Delete an item from the inventory
export const deleteDashboardItem = async (req, res) => {
  const { id } = req.body;
  
  try {
    await pool.query('DELETE FROM dashboard_items WHERE id = $1', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ message: 'Failed to delete item' });
  }
};

