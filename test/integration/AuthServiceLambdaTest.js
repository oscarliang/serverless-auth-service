const LambdaTester = require('lambda-tester');
const loginHandler = require('../../handler').login;
const chai = require('chai');
const expect = chai.expect;

describe('Integration Test', function () {
    describe('- Call login function', function () {
        it('- should return a object with statusCode and body by finding an account', function () {
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

        it('- should return a object with empty body by not finding an account', function () {
            var event = {
                "body": {
                    "email": "bill111@simble.io",
                    "pin": 11111111
                }
            }

            return LambdaTester(loginHandler)
                .event(event)
                .expectResult((result) => {
                    expect(result).to.be.an('object').to.have.property('statusCode').to.equal(403);

                    let body = JSON.parse(result.body);
                    expect(body).to.have.property('errorCode').to.equal("FORBIDDEN");
                });
        });

        it('- should return a object with 403 statuscode and error message by wrong email input', function () {
            var event = {
                "body": {
                    "email": "bill111",
                    "pin": 11111111
                }
            }

            return LambdaTester(loginHandler)
                .event(event)
                .expectResult((result) => {
                    expect(result).to.be.an('object').to.have.property('statusCode').to.equal(403);

                    let body = JSON.parse(result.body);
                    expect(body).to.have.property('errorCode').to.equal("FORBIDDEN");
                });
        });

        it('- should return a object with 403 statuscode and error message by wrong pin input', function () {
            var event = {
                "body": {
                    "email": "bill1@simble.io",
                    "pin": 1111
                }
            }

            return LambdaTester(loginHandler)
                .event(event)
                .expectResult((result) => {
                    expect(result).to.be.an('object').to.have.property('statusCode').to.equal(403);

                    let body = JSON.parse(result.body);
                    expect(body).to.have.property('errorCode').to.equal("FORBIDDEN");
                });
        });

        it('- should return a customer level account with customer level login', function () {
            var anObject = {
                "body": {
                    "email": "customer@simble.io",
                    "pin": 11111111
                }
            }

            return LambdaTester(loginHandler)
                .event(anObject)
                .expectResult((result) => {
                    expect(result).to.be.an('object').to.have.property('statusCode').to.equal(200);
                    let body = JSON.parse(result.body);
                    expect(body).to.have.property('level').to.equal('customer');
                });
        });

        it('- should return a reseller level account with reseller level login', function () {
            var anObject = {
                "body": {
                    "email": "reseller@simble.io",
                    "pin": 11111111
                }
            }

            return LambdaTester(loginHandler)
                .event(anObject)
                .expectResult((result) => {
                    expect(result).to.be.an('object').to.have.property('statusCode').to.equal(200);
                    let body = JSON.parse(result.body);
                    expect(body).to.have.property('level').to.equal('reseller');
                });
        });

        it('- should return a admin level account with reseller admin login', function () {
            var anObject = {
                "body": {
                    "email": "admin@acresta.com",
                    "pin": 11111111
                }
            }

            return LambdaTester(loginHandler)
                .event(anObject)
                .expectResult((result) => {
                    expect(result).to.be.an('object').to.have.property('statusCode').to.equal(200);

                    let body = JSON.parse(result.body);
                    expect(body).to.have.property('level').to.equal('admin');
                });
        });
    });
});

