const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Title cannot be empty' },
      len: { args: [1, 255], msg: 'Title must be between 1-255 characters' }
    }
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Platform cannot be empty' },
      len: { args: [1, 100], msg: 'Platform must be between 1-100 characters' }
    }
  },
  release_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1950], msg: 'Release year must be at least 1950' },
      max: { 
        args: [new Date().getFullYear() + 2], 
        msg: 'Release year cannot be in the far future' 
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Price cannot be negative' }
    }
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  playtime_hours: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Playtime cannot be negative' }
    }
  }
}, {
  tableName: 'games',
  timestamps: true
});

module.exports = Game;