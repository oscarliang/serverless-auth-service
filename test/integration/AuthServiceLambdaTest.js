const LambdaTester = require('lambda-tester');
const loginHandler = require('../../handler').login;
const chai = require('chai');
const expect = chai.expect;

describe('Integration Test', function () {
    describe('Call login', function () {
        it('should return a object with statusCode and body message', function () {
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

        it('should return a object 111e', function () {
            var anObject = {
                "body": {
                    "email": "bill111@simble.io",
                    "pin": 11111111
                }
            }

            return LambdaTester(loginHandler)
                .event(anObject)
                .expectResult((result) => {
                    expect(result).to.be.an('object').to.have.property('statusCode').to.equal(200);
                    expect(result).to.have.property('body').to.equal([]);
                });
        });
    });
});

