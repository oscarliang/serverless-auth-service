var sqlHelper = require('../util/SqlHelper.js');
var _ = require('lodash');

exports.getALLCustomers = (dbClient, callback) => {
    dbClient.query(sqlHelper.getALLCustomersSql(), (err, customerList) => {
        if (err)
            return callback(err);

        let customerIDs = []
        _.forEach(customerList, (customer) => {
            customerIDs.push(customer.customerID);
        })
        return callback(null, customerIDs);
    });
}

exports.getALLResellers = (dbClient, callback) => {
    dbClient.query(sqlHelper.getAllResellerList(), (err, customerList) => {
        if (err)
            return callback(err);

        let customerIDs = []
        _.forEach(customerList, (customer) => {
            customerIDs.push(customer.customerID);
        })
        return callback(null, customerIDs);
    });
}

exports.getCustomerListByResellerID = (dbClient, resellerID, callback) => {
    dbClient.query(sqlHelper.getCustomerListByResellerID(resellerID), (err, customerList) => {
        if (err)
            return callback(err);

        let customerIDs = []
        _.forEach(customerList, (customer) => {
            customerIDs.push(customer.customerID);
        })
        return callback(null, customerIDs);
    });
}