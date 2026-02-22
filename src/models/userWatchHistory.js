'use strict';
const { Model, Sequelize} = require('sequelize');
const redisService = require('../services/redis');
module.exports = (sequelize, DataTypes) => {
    class UserWatchHistory extends Model {
        static associate(models) {
            UserWatchHistory.belongsTo(models.User, { foreignKey: 'user_id' });
            UserWatchHistory.belongsTo(models.Content, { foreignKey: 'content_id' });
        }

        static genrePerferences(genre_count = {}) {
            let total_watches =  0;
            Object.values(genre_count).map(count => {total_watches += Number(count);});
            Object.keys(genre_count).map(genre => {genre_count[genre] = genre_count[genre]/total_watches;});
            return genre_count;
        }
    }

    UserWatchHistory.init({
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        content_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'content',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        watched_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.literal('NOW()')
        }
    }, {
        sequelize,
        modelName: 'UserWatchHistory',
        tableName: 'user_watch_history',
        timestamps: false,
        hooks: {
            afterCreate: async (watch_log, options) => {
                const keys = await redisService.findKeyUserId(watch_log.user_id);
                keys.map(key => {
                    redisService.del(key);
                })
            },

            afterUpdate: async (watch_log, options) => {
                const keys = await redisService.findKeyUserId(watch_log.user_id);
                keys.map(key => {
                    redisService.del(key);
                })
            }

        }
    });

    return UserWatchHistory;
};