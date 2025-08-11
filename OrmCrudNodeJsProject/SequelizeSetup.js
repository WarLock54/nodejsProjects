const Sequelize = require('sequelize');
const sequelize = require('./SequelizeConfig');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modeli yükle
db.user = require('./model/user')(sequelize, Sequelize);

// Veritabanı ile senkronize et
db.sequelize.sync()
  .then(() => {
    console.log('Database synced and user table created');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

module.exports = db;