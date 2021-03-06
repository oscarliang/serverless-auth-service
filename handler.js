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
var HttpException = require('./model/HttpException.js');


module.exports.login = (event, context, callback) => {
  let data = _.isObject(event.body) ? event.body : JSON.parse(event.body);
  const config = new Config();
  var mysqlClient;

  async.waterfall([
    /**
     * Validate the input
     */
    (callback) => {
      try {
        if (ValidatorUtil.validate(data.email, data.pin))
          callback(null, data);
      } catch (exception) {
        callback(exception);
      }
    },
    /**
     * get the data from the Mysql DB
     */
    (data, callback) => {
      mysqlClient = new MysqlClient(config);
      let login = data;
      var authService = new AuthService(mysqlClient, login, config, event);

      //get the user data from the MySQL DB
      authService.getUserFromDb().then((user) => {
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
    (user, callback) => {
      // let data = JSON.parse(user.body).data;
      if (!_.isUndefined(user) && user !== null) {
        let redisClient = new RedisClient(config);
        let redisKeys = new RedisKeys(config);
        let sessionService = new SessionService(redisClient, config, redisKeys);

        //create a session in the redis
        let token = sessionService.createNewUserSession(user);

        //close the redis connection
        redisClient.client.quit();

        //return the response to client
        // let response = responseUtil.responseHandler(200, { "token": token });
        user.token = token;
        callback(null, user);
      } else {
        let noUserException = new HttpException(403, "Invalid email or pin", "UNAUTHORIZED");
        callback(noUserException);
      }
    },
  ], (err, user) => {
    if (err) {
      callback(null, responseUtil.errorHandler(err.stateCode, { errorMessage: err.errorMessage, errorCode: err.code }));
    } else {
      //re-orginize response
      let response = responseUtil.responseHandler(200,
        {
          "token": user.token,
          "role": user.role,
          "level": user.level.reallevel,
          "term": user.term,
          "logo": user.log,
          "email": data.email,
          "modules": user.modules
        }
      );
      callback(null, response);
    }
  });

};
