var AuthService = require('./service/AuthService.js');
var SessionService = require('./service/SessionService.js');
var Config = require('./conf/Config.js');
var MysqlClient = require('./util/MysqlClient.js');
var responseUtil = require('./util/ResponseUtil.js');
var _ = require('lodash');
var async = require('async');
var RedisClient = require('./util/RedisClient.js');
var ValidatorUtil = require('./util/ValidatorUtil.js');
var RedisKeys = require('./util/RedisKeys.js');


module.exports.login = (event, context, callback) => {
  let data = _.isObject(event.body) ? event.body : JSON.parse(event.body);
  const config = new Config();

  async.waterfall([
    /**
     * Validate the input
     */
    (callback) => {
      try {
        if (ValidatorUtil.validate(data.email, data.pin))
          callback(null, data.email);
      } catch (exception) {
        callback(exception);
      }
    },
    /**
     * get the data from the Mysql DB
     */
    (email, callback) => {
      const mysqlClient = new MysqlClient(config);
      let getUserSql = "SELECT email, pin, r.role, r.roleID, u.userID, active, term, logo, status FROM user as u " +
        "inner join user_role as ur on  ur.userID = u.userID " +
        "inner join role as r on r.roleID = ur.roleID " +
        "WHERE lower(u.email) = ";
      getUserSql += "'" + email + "'";

      var authService = new AuthService(mysqlClient, getUserSql, config, event);

      //get the user data from the MySQL DB
      authService.getUserListFromDb().then((user) => {
        callback(null, user);
      }).catch((err) => {
        callback(err);
      }).finally(() => {
        mysqlClient.closeConnection();
        console.info("Close MySQL Connection");
      });
    },
    /**
     * create session in the Redis
     */
    (userResponse, callback) => {
      let redisClient = new RedisClient(config);
      let redisKeys = new RedisKeys(config);
      let sessionService = new SessionService(redisClient, config, redisKeys);
      let userObj = JSON.parse(userResponse.body).data[0];

      //create a session in the redis
      sessionService.createNewUserSession(userObj);

      //close the redis connection
      redisClient.client.quit();

      //return the response to client
      callback(null, userResponse);
    }
  ], (err, response) => {
    if (err)
      callback(null, responseUtil.errorHandler(err.stateCode, { errorMessage: err.errorMessage }));
    callback(null, response);
  });

};
