const { Sequelize } = require('sequelize');
const path = require('path');

// ansluter till SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false
});

module.exports = sequelize;