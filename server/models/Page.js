
const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  label: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['custom', 'system'],
    default: 'custom'
  },
  blocks: { type: Array, default: [] }, // Stores PageBlock[] JSON
  isHidden: { type: Boolean, default: false },
  backgroundImage: { type: String, default: '' },
  backgroundColor: { type: String, default: '' }
});

module.exports = mongoose.model('Page', pageSchema);
