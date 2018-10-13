const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  database: 'nyc_safety',
  dialect: 'postgres'
});


// Create models here


module.exports = {
  // Export models
  sequelize: sequelize
};
