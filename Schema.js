const mongoose = require('mongoose');

// Define the schema for the menu item
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
});

// Create the model for the menu item
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;