
const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  colors: {
    primary: { type: String, default: '#4f46e5' },
    secondary: { type: String, default: '#e0e7ff' },
    background: { type: String, default: '#f9fafb' },
    text: { type: String, default: '#1f2937' }
  },
  isActive: { type: Boolean, default: false }
});

module.exports = mongoose.model('Theme', themeSchema);
