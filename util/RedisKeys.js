/**
 * Utils class for handle redis keys
 */

class RedisKeys {
    constructor(config) {
        this.config = config.conf;
        this.prefix = this.config.redis.prefix + ":" + this.config.env;
    }

    getNewUserSessionPrefix(token) {
        return this.prefix + ":api:session:" + token;
    }

    removePrefix(redisKey) {
        if (redisKey.indexOf(this.prefix) !== 0)
            return redisKey; // nothing to do

        return redisKey.substr(this.prefix.length + 1);
    }

    addPrefix(redisKey) {
        return this.prefix + ":" + redisKey;
    }
}

module.exports = RedisKeys;