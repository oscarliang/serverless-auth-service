/**
 * Util to originise the response message
 * */
exports.responseHandler = (statusCode, bodyObj) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(bodyObj),
    };
    return response;
}


exports.errorHandler = (statusCode, bodyObj) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(bodyObj),
    };
    return response;
}