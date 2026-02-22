const { User } = require('../models');

class UserRepository {
    async userContext(user_id = 0){
        return await User.findByPk(user_id,{
            attributes: ['id', 'age', 'country', 'subscription_type'],
        });
    }

    async getUsersContext(limit = 20, offset = 0){
        console.log('limit',limit,'offset',offset)
        return await User.findAll({
            attributes: ['id', 'age', 'country', 'subscription_type'],
            limit,
            offset: offset,
        })
    }

    async countUsers(){
        return await User.count({});
    }
}

module.exports = new UserRepository();