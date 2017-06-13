"use strict";
var HttpException = require('../model/HttpException.js');
var responseUtil = require('../util/ResponseUtil.js');
var userService = require('./UserService.js');
var permissionService = require('./PermissionService.js');
var Q = require('q');
var _ = require('lodash');
var async = require('async');

/**
 * Authentication service
 */
class AuthService {
    constructor(mysqlClient, login, config, event) {
        this.config = config;
        this.login = login;
        this.event = event;
        this.dbClient = mysqlClient.client;
    }

    getUserFromDb(cb) {
        let deferred = Q.defer();
        async.waterfall([
            //get user from the db
            (callback) => {
                this.getUserProcess(this.dbClient, this.login.email, (err, user) => {
                    if (err)
                        return callback(err);
                    return callback(null, user);
                })
            },

            //get user level(permission) from db
            (user, callback) => {
                this.attachUserLevelToUserProcess(this.dbClient, user, (err, user) => {
                    if (err)
                        return callback(err);
                    return callback(null, user);
                });
            },

            //get modules from DB
            (user, callback) => {
                this.attachModuleToUserProcess(this.dbClient, user, (err, modules) => {
                    if (err)
                        return callback(err);
                    return callback(null, user);
                });
            }
        ], (err, response) => {
            if (err)
                deferred.reject(err);
            else
                deferred.resolve(response);
        });
        return deferred.promise.nodeify(cb);
    }

    getUserProcess(dbClient, email, callback) {
        userService.getUser(this.dbClient, this.login.email, (err, user) => {
            if (err) {
                return callback(err);
            }

            //if no user
            if (_.isNull(user)) {
                return callback(new HttpException(403, "Invalid email or pin", "FORBIDDEN"));
            }

            //if no user
            if (user.length === 0) {
                return callback(new HttpException(403, "Invalid email or pin", "FORBIDDEN"));
            }

            //if is a array, only select first element
            if (_.isArray(user))
                user = user[0];

            //if the user is not actived
            if (!user.active) {
                return callback(new HttpException(401, "Account has not been activated", "UNAUTHORIZED"));
            }

            //if the user is disabled
            if (!user.status) {
                return callback(new HttpException(401, "Account has been disabled", "UNAUTHORIZED"));
            }

            return callback(null, user);
        });
    }

    attachUserLevelToUserProcess(dbClient, user, callback) {
        userService.getUserLevelObjByUserID(this.dbClient, user.userID, (err, userLevel) => {
            if (err) {
                return callback(err);
            }
            user.level = userLevel;
            return callback(null, user);
        });
    }

    attachModuleToUserProcess(dbClient, user, callback) {
        permissionService.getModuleNamesByRoleID(this.dbClient, user.roleID, (err, modules) => {
            if (err) {
                return callback(err);
            }
            if (_.indexOf(modules, "full") !== -1)
                user.level.level = 'admin';

            user.level['reallevel'] = user.level.level;

            user.modules = modules;
            return callback(null, user);
        });
    }

}

module.exports = AuthService;