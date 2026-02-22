const {UserWatchHistory, Content} = require ('../models');

class UserWatchHistoryRepository {
    async watchHistory (user_id = 0, limit = 20) {
        const result = await UserWatchHistory.findAll({
            attributes: ['watched_at'],
            where: {
                user_id: user_id,
            },
            include: [{
                model: Content,
                attributes: ['id', 'genre'],
            }],
            order: [['watched_at', 'DESC']],
            limit: limit,
        });

        return result.map (item => ({
            id: item.Content.id,
            genre: item.Content.genre,
            watched_at: item.watched_at
        }))
    }

    async addWatchHistory (user_id, content_id) {
        return await UserWatchHistory.create({
            user_id: user_id,
            content_id: content_id,
        });
    }
}

module.exports = new UserWatchHistoryRepository();