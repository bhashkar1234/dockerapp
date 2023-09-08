const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema({
  pantryId: {
    type: String,
    required: true,
  },
  basketKey: {
    type: String,
    required: true,
  },
  payload: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model('PantryItem', pantryItemSchema);
