const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    maxlength: [100, 'Platform cannot exceed 100 characters']
  },
  release_year: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1950, 'Release year must be at least 1950'],
    max: [new Date().getFullYear() + 2, 'Release year cannot be in the far future']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  completed: {
    type: Boolean,
    default: false
  },
  playtime_hours: {
    type: Number,
    default: 0,
    min: [0, 'Playtime cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Game', GameSchema);