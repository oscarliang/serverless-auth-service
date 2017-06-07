class HttpException extends Error{

    constructor(stateCode, errorMessage, code = 0, source = ''){
        super();
        this.stateCode = stateCode;
        this.errorMessage = errorMessage;
        this.code = code;
        this.source = source;
    }

    parse() {
        let httpExceptionObj = {
            "stateCode" : this.stateCode,
            "errorMessage" : this.errorMessage
        }
        if (this.code !== 0) httpExceptionObj['code'] = this.code;
        if (this.source !== '') httpExceptionObj['source'] = this.source;
        return httpExceptionObj;
    }
}

module.exports = HttpException;