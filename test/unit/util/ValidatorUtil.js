var ValidatorUtil = require('../../../util/ValidatorUtil.js');
var HttpException = require('../../../model/HttpException.js');
var chai = require('chai');
var expect = chai.expect;

describe('ValidatorUtil Test', function () {
    describe('Input email', function () {

        it('should return true with correct email format', function () {
            let result = ValidatorUtil.validate("oscar@gmail.com", "11111111");
            expect(result).to.be.true;
        });

        it('should return exception with wrong email format', function () {
            expect(() =>
                ValidatorUtil.validate("oscar333@@gmail.com", "11111111")
            ).to.throw(HttpException);
        });

        it('should return exception with email length less than 8', function () {
            expect(() =>
                ValidatorUtil.validate("o@a.cn", "11111111")
            ).to.throw(HttpException);
        });
    });

    describe('Input pin', function () {

        it('should return true with correct pin format', function () {
            let result = ValidatorUtil.validate("oscar@gmail.com", "11111111");
            expect(result).to.be.true;
        });

        it('should return exception with pin length less than 6', function () {
            expect(() =>
                ValidatorUtil.validate("oscar@gmail.com", "1111")
            ).to.throw(HttpException);
        });
    });
});