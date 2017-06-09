var sqlHelper = require('../util/SqlHelper.js');
var _ = require('lodash');

/**
 * Get the all the modules belong to the roleID
 */
exports.getModuleNamesByRoleID = (dbClient, roleID, callback) => {
    dbClient.query(sqlHelper.getUIModulesByRoleID(roleID), (err, moduleObjList) => {
        if (err)
            return callback(err);

        let moduleNameList = []
        _.forEach(moduleObjList, (moduleObj) => {
            moduleNameList.push(moduleObj.name.split(' ')[0]);
        })
        return callback(null, moduleNameList);
    });
}