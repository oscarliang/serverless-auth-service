const LambdaTester = require('lambda-tester');
const loginHandler = require('../../handler').login;
const chai = require('chai');
const expect = chai.expect;

describe('Integration Test', function () {
    describe('Call login', function () {
        it('should return a object with statusCode and body by finding an account', function () {
            var anObject = {
                "body": {
                    "email": "bill1@simble.io",
                    "pin": 11111111
                }
            }

            return LambdaTester(loginHandler)
                .event(anObject)
                .expectResult((result) => {
                    expect(result).to.be.an('object').to.have.property('statusCode').to.equal(200);
                    expect(result).to.have.property('body');
                });
        });

        it('should return a object with empty body by not finding an account', function () {
            var event = {
                "body": {
                    "email": "bill111@simble.io",
                    "pin": 11111111
                }
            }

            var resultBody = {
                "errorMessage": "Invalid email or pin",
                "errorCode": "UNAUTHORIZED"
            }

            return LambdaTester(loginHandler)
                .event(event)
                .expectResult((result) => {
                    expect(result).to.be.an('object').to.have.property('statusCode').to.equal(403);
                    expect(result).to.have.property('body').to.equal(JSON.stringify(resultBody));
                });
        });

        it('should return a object with 403 statuscode and error message by wrong email input', function () {
            var event = {
                "body": {
                    "email": "bill111",
                    "pin": 11111111
                }
            }

            var resultBody = { "errorMessage": "Please input correct username", "errorCode": "UNAUTHORIZED" };

            return LambdaTester(loginHandler)
                .event(event)
                .expectResult((result) => {
                    expect(result).to.be.an('object').to.have.property('statusCode').to.equal(403);
                    expect(result).to.have.property('body').to.equal(JSON.stringify(resultBody));
                });
        });

        it('should return a object with 403 statuscode and error message by wrong pin input', function () {
            var event = {
                "body": {
                    "email": "bill1@simble.io",
                    "pin": 1111
                }
            }

            var resultBody = { "errorMessage": "Please input correct pin", "errorCode": "UNAUTHORIZED" };

            return LambdaTester(loginHandler)
                .event(event)
                .expectResult((result) => {
                    expect(result).to.be.an('object').to.have.property('statusCode').to.equal(403);
                    expect(result).to.have.property('body').to.equal(JSON.stringify(resultBody));
                });
        });
    });
});

