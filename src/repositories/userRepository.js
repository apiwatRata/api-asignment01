const { User } = require('../models');

class UserRepository {
    async userContext(user_id = 0){
        const result = await User.findOne({
            attributes: ['id', 'age', 'country', 'subscription_type'],
            where: {
                id: user_id
            }
        });

        return result;
    }
}

module.exports = new UserRepository();