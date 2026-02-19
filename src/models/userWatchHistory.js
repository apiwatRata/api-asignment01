'use strict';
const { Model, Sequelize} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserWatchHistory extends Model {
        static associate(models) {
            UserWatchHistory.belongsTo(models.User, { foreignKey: 'user_id' });
            UserWatchHistory.belongsTo(models.Content, { foreignKey: 'content_id' });
        }

        static async genrePerferences() {
            const genre_counts =  await sequelize.models.UserWatchHistory.findAll({
                include:[{
                    model: sequelize.models.Content,
                    attributes:[]
                }],
                attributes:[
                    [Sequelize.col('Content.genre'),'genre'],
                    [Sequelize.fn('COUNT',Sequelize.col('Content.id')), 'watcher']
                ],
                group:['Content.genre'],
                raw: true
            });
            let total_watches =  0;
            genre_counts.map(genre => {total_watches += Number(genre.watcher);});
            const result = genre_counts.reduce((acc, item) => {
                console.log('acc',acc,item);
                acc[item.genre] = Number(item.watcher)/total_watches; // แปลง watcher เป็น number
                return acc;
            }, {});

            return result;
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