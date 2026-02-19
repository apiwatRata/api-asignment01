const { Content, UserWatchHistory} = require('../models');
const { Op} = require('sequelize');
class ContentRepository  {
    async CandidateContent(user_id = 0, limit = 20){
        let subQuery =  await UserWatchHistory.findAll({
            attributes: ['content_id'],
            where: { user_id: user_id },
            raw: true
        });
        subQuery = subQuery.map(item => item.content_id)
        const result = await Content.findAll({
            attributes: ['id','title','genre','popularity_score','created_at'],
            where: {
                id: {
                    [Op.notIn]: subQuery
                }
            },
            limit: limit,
        })
        return result;
    }
}

module.exports = new ContentRepository();