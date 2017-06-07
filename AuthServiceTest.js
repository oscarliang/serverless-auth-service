var AuthService = require('../../service/AuthService.js');
var MysqlClient = require('../../util/MysqlClient.js');
var Config = require('../../conf/Config.js');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var sinon = require('sinon');
var Q = require('q');

describe('AuthService Test', function () {

    describe('Call getUserListFromDb function', function () {

        var stub;

        function getUserListFromDbPromise() {
            return Q.fcall(function () {
                return [{
                    "email": "bill1@simble.io",
                    "pin": "11111111",
                    "role": "simble_user",
                    "roleID": 3,
                    "userID": 80,
                    "active": 1,
                    "term": 1,
                    "logo": null,
                    "status": 1
                }];
            });
        };

        var authService;

        beforeEach(function () {
            const config = new Config();
            const mysqlClient = new MysqlClient(config);

            authService = new AuthService(mysqlClient, "myquery", config, {});
            stub = sinon.stub(authService, "getUserListFromDb");
            stub.withArgs().returns(getUserListFromDbPromise());
        });

        it('call getUserListFromDb and get user', function () {
            return authService.getUserListFromDb().then((user) => {
                // console.log(user);
                expect(user).to.be.an('array').to.have.lengthOf(1);
            });

            // return authService.getUserListFromDb().should.eventually.be.an('string');
        });

        afterEach(function () {
            stub.restore();
        });
    });
});