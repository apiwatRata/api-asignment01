'use strict';
const { Model } = require('sequelize');
const dayjs = require('dayjs');

module.exports = (sequelize, DataTypes) => {
    class Content extends Model {
        static associate(models) {
            Content.hasMany(models.UserWatchHistory, { foreignKey: 'content_id' });
        }

        static getBoost(created_at){
            const current_time = Date.now()
            const days_since_creation = dayjs(current_time).diff(dayjs(created_at), 'day');
            return 1.0 / (1.0 + days_since_creation / 365.0)
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
        timestamps: false
    });

    return Content;
};