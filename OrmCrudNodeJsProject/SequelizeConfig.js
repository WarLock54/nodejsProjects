const SequelConfig = require('./sequelize');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(SequelConfig.DB, SequelConfig.USER, SequelConfig.PASSWORD, {

    host: SequelConfig.HOST,
        dialect: SequelConfig.dialect,
        port: 5432 

});
module.exports = sequelize;