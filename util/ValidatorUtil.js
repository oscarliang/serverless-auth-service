var validator = require('validator');
var HttpException =  require('../model/HttpException.js');
var _ = require('lodash');

/**
 * Util methods to validate the inputs
 */
exports.validate = (email, pin) => {
    if (_.isUndefined(email) || !validator.isEmail(email) || !validator.isLength(email, { min: 6, max: 64 }))
        throw new HttpException(400, "Please input correct username").parse();
    if (_.isUndefined(pin) || !validator.isLength(String(pin), { min: 6, max: 20 }))
        throw new HttpException(400, "Please input correct pin").parse();
    return true;
}