const { User } = require('../models');

class UserRepository {
    async userContext(user_id = 0){
        return await User.findByPk(user_id,{
            attributes: ['id', 'age', 'country', 'subscription_type'],
        });
    }
}

module.exports = new UserRepository();