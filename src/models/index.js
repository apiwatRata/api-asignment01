const env = process.env.NODE_ENV || 'development';
const config = require('../configs/config.json')[env];
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env[config.use_env_variable], config);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Content = require("./content")( sequelize , Sequelize );
db.User = require("./user")( sequelize , Sequelize );
db.UserWatchHistory = require("./userWatchHistory")( sequelize , Sequelize );

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


module.exports = db;