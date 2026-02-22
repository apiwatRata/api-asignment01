const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});


client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

(async () => {
    await client.connect();
    console.log('Redis connected successfully');
})();


module.exports = {
    set: async (key, value, expireSeconds = 600) => {
        if (expireSeconds) {
            await client.set(key, value, { EX: expireSeconds });
        } else {
            await client.set(key, value);
        }
    },

    get: async (key) => {
        return await client.get(key);
    },

    del: async (key) => {
        return await client.del(key);
    },

    findKeyUserId: async (user_id) => {
        let cursor = "0";
        let keys = [];

        do {
            const reply = await client.scan(cursor, {
                MATCH: `rec:user:${user_id}:limit:*`,
                COUNT: 100
            });
            cursor = parseInt(reply.cursor);
            keys = keys.concat(reply.keys);
        } while (cursor !== 0);

        return keys;
    },

    client
};