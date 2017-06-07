var sha1 = require('sha1');

/**
 * Util class for handling session service
 */
class SessionService {
    constructor(redisClient, config, redisKeys){
        this.redisClient = redisClient.client;
        this.config = config.conf;
        this.redisKeys = redisKeys;
    }

    createSession(sessionKey, data) {
        this.redisClient.setex(sessionID, 3600, JSON.stringify(data));
    }

    createNewUserSession(user){
        //sha1 the key
        let token = sha1(user.email + new Date());
        this.redisClient.setex(this.redisKeys.getNewUserSessionPrefix(token), this.config.redis.defaultExpireTime, JSON.stringify(user));
    }
}

module.exports = SessionService;