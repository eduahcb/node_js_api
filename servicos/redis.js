const redis = require('redis');

function createRedisConnection(){
    return redis.createClient();
}

module.exports = () => createRedisConnection;