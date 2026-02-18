'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Content extends Model {
        static associate(models) {
            Content.hasMany(models.UserWatchHistory, { foreignKey: 'content_id' });
        }
    }

    Content.init({
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        genre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        popularity_score: {
            type: DataTypes.NUMBER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.literal('NOW()')
        }
    }, {
        sequelize,
        modelName: 'Content',
        tableName: 'content',
    });

    return Content;
};