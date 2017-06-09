var Buffer = require('buffer').Buffer;

exports.encode = (unencoded) => {
    return new Buffer(unencoded).toString('base64');
}

exports.decode = (encoded) => {
    return new Buffer(encoded, 'base64').toString('utf8');
}