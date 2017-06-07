var AuthService = require('../../../service/AuthService.js');
var Mysql = require('mysql');
var Config = require('../../../conf/Config.js');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;

var MysqlClient = require('../../../util/MysqlClient.js');

var sinon = require('sinon');

describe('AuthService Test', function () {

    describe('Call getUserListFromDb function', function () {

        var mysqlMock;

        var expectedResult = [{
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


        var authService;

        beforeEach(function () {
            const config = new Config();

            var mysqlConnection = Mysql.createConnection(
                {
                    host: "localhost"
                });

            //mock up a mysql connection    
            mysqlMock = sinon.mock(mysqlConnection);

            //pass the connection to the AuthService
            var mysqlClient = { client: mysqlMock.object };

            authService = new AuthService(mysqlClient, "myquery", config, {});
            var expectation = mysqlMock.expects('query')
                .withArgs('myquery')
                .callsArgWith(1, null, expectedResult);
            //callsArgWith(2, null, results, fields);    is for    .query(query, params, function(error, results, fields)
        });

        it('should return a object with statusCode and body message', function () {
            return authService.getUserListFromDb().then((user) => {
                // console.log(user);
                expect(user).to.be.an('object').to.have.property('statusCode').to.equal(200);
                expect(user).to.have.property('body');
            });

            // return authService.getUserListFromDb().should.eventually.be.an('string');
        });

        afterEach(function () {
            mysqlMock.restore();
        });
    });
});