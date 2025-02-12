const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// MongoDB Atlas URI (replace with your own URI)
const connectionString = process.env.DB_URL; // Use the environment variable for the MongoDB URI
console.log(`Connecting to MongoDB at ${connectionString}`); // Add this line to log the connection URL

// Connect to MongoDB
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Define the schema for the menu item
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
});

// Create the model for the menu item
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// POST route to create a new menu item
app.post('/menu', async (req, res) => {
  const { name, description, price } = req.body;

  // Basic validation
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required.' });
  }

  try {
    // Create a new menu item
    const newItem = new MenuItem({ name, description, price });
    await newItem.save();

    res.status(201).json({
      message: 'Menu item created successfully!',
      item: newItem,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET route to fetch all menu items
app.get('/menu', async (req, res) => {
  try {
    // Fetch all menu items from the database
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching menu items. Please try again later.' });
  }
});

// PUT route to update an existing menu item
app.put('/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  // Validation: Ensure at least one field is provided for updating
  if (!name && !description && !price) {
    return res.status(400).json({ error: 'At least one field (name, description, price) must be provided.' });
  }

  try {
    // Find the menu item by ID and update it
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.status(200).json({
      message: 'Menu item updated successfully!',
      item: updatedItem,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error updating menu item. Please try again later.' });
  }
});

// DELETE route to remove a menu item
app.delete('/menu/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find and remove the menu item by ID
    const deletedItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.status(200).json({
      message: 'Menu item deleted successfully!',
    });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting menu item. Please try again later.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});