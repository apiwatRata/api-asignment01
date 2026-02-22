'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.UserWatchHistory, { foreignKey: 'user_id' });
        }
    }

    User.init({
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        age: {
            type: DataTypes.NUMBER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        country: {
            type: DataTypes.STRING(2),
            allowNull: false
        },
        subscription_type: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.literal('NOW()')
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false
    });

    return User;
};