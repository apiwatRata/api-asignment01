'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserWatchHistory extends Model {
        static associate(models) {
            UserWatchHistory.belongsTo(models.User, { foreignKey: 'user_id' });
            UserWatchHistory.belongsTo(models.Content, { foreignKey: 'content_id' });
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
    });

    return UserWatchHistory;
};