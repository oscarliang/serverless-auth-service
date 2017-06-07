"use strict";

var responseUtil = require('../util/ResponseUtil.js');
var Q = require('q');

/**
 * Authentication service
 */
class AuthService {
    constructor(mysqlClient, sqlQuery, config, event) {
        this.sqlQuery = sqlQuery;
        this.config = config;
        this.event = event;
        this.dbClient = mysqlClient.client;
    }

    _authQueryHandler(err, results, event, envconfig) {
        let config = envconfig;
        if (err) {
            console.error("Server Error: " + err);

            //enable the input request log to the response if needed
            let errorObj = config.event ? { errorMessage: "500 Internal Server Error", input: event } : { errorMessage: "500 Internal Server Error" };
            return responseUtil.errorHandler(500, errorObj);
        }
        let messageObj = config.event ? { data: results, input: event } : { data: results };
        return responseUtil.responseHandler(200, messageObj);
    }

    getUserListFromDb(cb) {
        var self = this;
        let deferred = Q.defer();
        this.dbClient.query(this.sqlQuery, (err, results) => {
            if (err) {
                console.error(err);
                deferred.resolve(responseUtil.errorHandler(500, {errorMessage: "Error Establishing A Database Connection"}));
            }
            let response = self._authQueryHandler(err, results, self.event, self.config);
            deferred.resolve(response);
            // this.dbClient.end();
        });
        return deferred.promise.nodeify(cb);
    }
}

module.exports = AuthService;