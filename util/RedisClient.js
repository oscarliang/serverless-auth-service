"use strict";
var IoRedis = require('ioredis');

/**
 * Util class for handling redis connection
 */
class RedisClient {

    constructor(config) {
        this.config = config.conf;

        // unhandled exceptions
        IoRedis.Promise.onPossiblyUnhandledRejection((err) => {
            // you can log the error here.
            console.error("Command %s with args %j: %s -> %s", err.command.name, err.command.args, err.name, err.message);
        });

        // we create the client
        this._redisClient = new IoRedis(this.config.redis.port, this.config.redis.address, { retryStrategy: (times) => 5000 });

        this._redisClient.on('error', (err) => { console.error("Redis error: %s -> %s", err.name, err.message) });
        this._redisClient.on('ready', () => { console.info("Redis connected") });
        this._redisClient.on('close', () => { console.info("Redis connection closed") });
        this._redisClient.on('reconnecting', (ms) => { console.info("Redis reconnecting in %d", ms) });

    }

    get client() { return this._redisClient; }

}

module.exports = RedisClient;