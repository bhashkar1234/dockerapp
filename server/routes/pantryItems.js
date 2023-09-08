const express = require('express');
const router = express.Router();
const PantryItem = require('../models/PantryItem');

// Create a pantry item
router.post('/add-item', async (req, res) => {
  try {
    const { pantryId, basketKey, payload } = req.body;

    const pantryItem = new PantryItem({
      pantryId,
      basketKey,
      payload,
    });

    await pantryItem.save();
    res.json(pantryItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read a pantry item by Pantry ID and basket key
router.get('/get-item/:pantryId/:basketKey', async (req, res) => {
  try {
    const { pantryId, basketKey } = req.params;
    const pantryItem = await PantryItem.findOne({ pantryId, basketKey });
    if (!pantryItem) {
      return res.status(404).json({ error: 'Pantry item not found' });
    }
    res.json(pantryItem.payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all baskets under a specified Pantry using the Pantry ID and filter by name
router.get('/list-baskets/:pantryId', async (req, res) => {
  try {
    const { pantryId } = req.params;
    const nameFilter = req.query.name;

    let pantryItems;
    if (nameFilter) {
      pantryItems = await PantryItem.find({ pantryId, 'payload.name': nameFilter });
    } else {
      pantryItems = await PantryItem.find({ pantryId });
    }

    const basketKeys = pantryItems.map((item) => item.basketKey);
    res.json(basketKeys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a pantry item by Pantry ID and basket key
router.put('/update-item/:pantryId/:basketKey', async (req, res) => {
  try {
    const { pantryId, basketKey } = req.params;
    const { payload } = req.body;

    const pantryItem = await PantryItem.findOneAndUpdate(
      { pantryId, basketKey },
      { payload },
      { new: true }
    );

    if (!pantryItem) {
      return res.status(404).json({ error: 'Pantry item not found' });
    }

    res.json(pantryItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a pantry item by Pantry ID and basket key
router.delete('/delete-item/:pantryId/:basketKey', async (req, res) => {
  try {
    const { pantryId, basketKey } = req.params;
    await PantryItem.findOneAndRemove({ pantryId, basketKey });
    res.json({ message: 'Pantry item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
