var AuthService = require('./service/AuthService.js');
var Config = require('./conf/Config.js');
var MysqlClient = require('./util/MysqlClient.js');
var responseHelper = require('./util/ResponseHelper.js');
var _ = require('lodash');
var async = require('async');
var ValidatorUtil = require('./util/ValidatorUtil.js');



module.exports.login = (event, context, callback) => {
  let data = _.isObject(event.body) ? event.body : JSON.parse(event.body);

  async.waterfall([
    (callback) => {
      try {
        if (ValidatorUtil.validate(data.email, data.pin))
          callback(null, data.email);
      } catch (exception) {
        callback(exception);
      }
    },
    (email, callback) => {

      const config = new Config();
      const mysqlClient = new MysqlClient(config);
      let getUserSql = "SELECT email, pin, r.role, r.roleID, u.userID, active, term, logo, status FROM user as u " +
        "inner join user_role as ur on  ur.userID = u.userID " +
        "inner join role as r on r.roleID = ur.roleID " +
        "WHERE lower(u.email) = ";
      getUserSql += "'" + email + "'";

      var authService = new AuthService(mysqlClient, getUserSql, config, event);
      authService.getUserListFromDb().then((response) => {
        callback(null, response);
      }).catch((err) => {
        callback(err);
      }).finally(() => {
        mysqlClient.closeConnection();
        console.info("Function ending");
      });
    }
  ], (err, response) => {
    if (err)
      callback(null, responseHelper.errorHandler(err.stateCode, { errorMessage: err.errorMessage }));
    callback(null, response);
  });

};
