
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String },
  type: { 
    type: String, 
    enum: ['announcement', 'update', 'event'],
    default: 'update'
  }
});

module.exports = mongoose.model('News', newsSchema);
