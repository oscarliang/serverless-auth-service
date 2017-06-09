var sqlHelper = require('../util/SqlHelper.js');
var resellerService = require('./ResellerService.js');
var _ = require('lodash');
var async = require('async');

exports.getUser = (dbClient, email, callback) => {
    dbClient.query(sqlHelper.getUserSql(email), (err, data) => {
        if (err)
            return callback(err);
        return callback(null, data);
    });
}

/**
 * get the user's user level Object
 */
exports.getUserLevelObjByUserID = (dbClient, userID, callback) => {
    let userLevelOjb = {
        "level": "user",
        "customerIDs": [],
        "resellerIDs": []
    }

    dbClient.query(sqlHelper.getAccountByUserIdSql(userID), (err, userCustomerObjs) => {
        if (err)
            return callback(err);

        async.forEachSeries(userCustomerObjs, (userCustomerObj, seriesCallBack) => {
            if (userCustomerObj.level === 'admin') {
                userLevelOjb.level = 'admin';

                async.waterfall([
                    (seriesCallBack) => {
                        resellerService.getALLCustomers(dbClient, (err, customerIDs) => {
                            if (err)
                                return callback(err);
                            userLevelOjb.customerIDs = _.concat(userLevelOjb.customerIDs, customerIDs);
                            return seriesCallBack(null, userLevelOjb);
                        })
                    },
                    (userLevelOjb, seriesCallBack) => {
                        resellerService.getALLResellers(dbClient, (err, resellerIDs) => {
                            if (err)
                                return callback(err);
                            userLevelOjb.resellerIDs = _.concat(userLevelOjb.resellerIDs, resellerIDs);
                            return seriesCallBack(null, userLevelOjb);
                        })
                    }
                ],
                    (err, userLevelOjb) => {
                        if (err)
                            return callback(err);
                        return seriesCallBack();
                    });
            }

            if (userCustomerObj.level === 'reseller') {
                resellerService.getCustomerListByResellerID(dbClient, userCustomerObj.customerID, (err, customerIDs) => {
                    if (err)
                        return callback(err);
                    if (userLevelOjb.level === 'reseller')
                        userLevelOjb.customerIDs = _.concat(userLevelOjb.customerIDs, customerIDs);
                    if (userLevelOjb.level === 'user' || userLevelOjb.level === 'customer') {
                        userLevelOjb.level = 'reseller';
                        userLevelOjb.customerIDs = customerIDs;
                    }
                    userLevelOjb.resellerIDs = _.concat(userLevelOjb.resellerIDs, userCustomerObj.customerID);
                    // userLevelOjb.resellerIDs = userCustomerObj.customerID;
                    return seriesCallBack();
                });
            }

            if (userCustomerObj.level === 'customer') {
                userLevelOjb.customerIDs = _.concat(userLevelOjb.customerIDs, userCustomerObj.customerID);
                userLevelOjb.resellerIDs = _.concat(userLevelOjb.resellerIDs, userCustomerObj.resellerID);
                userLevelOjb.level = 'customer';
                return seriesCallBack();
            }

            if (userCustomerObj.level === 'user') {
                userLevelOjb.customerIDs = _.concat(userLevelOjb.customerIDs, userCustomerObj.customerID);
                userLevelOjb.resellerIDs = _.concat(userLevelOjb.resellerIDs, userCustomerObj.resellerID);
                return seriesCallBack();
            }
        },
            (err) => {
                if (err)
                    return callback(err);
                // console.log(userLevelOjb);
                return callback(null, userLevelOjb);
            });

    });
}