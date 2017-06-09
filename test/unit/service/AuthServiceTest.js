var AuthService = require('../../../service/AuthService.js');
var sqlHelper = require('../../../util/SqlHelper.js');
var Mysql = require('mysql');
var Config = require('../../../conf/Config.js');
var userService = require('../../../service/UserService.js');
var HttpException = require('../../../model/HttpException.js');
var permissionService = require('../../../service/PermissionService.js');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;

var MysqlClient = require('../../../util/MysqlClient.js');

var sinon = require('sinon');

describe('AuthService Test', () => {

    describe(' - Call getUserProcess function', () => {

        var mysqlMock;
        var authService;

        beforeEach(() => {
            const config = new Config();

            var mysqlConnection = Mysql.createConnection(
                {
                    host: "localhost"
                });

            var login = {
                email: "bill1@simble.io",
                pin: "11111111"
            }

            //mock up a mysql connection    
            mysqlMock = sinon.mock(mysqlConnection);

            //pass the connection to the AuthService
            var mysqlClient = { client: mysqlMock.object };

            authService = new AuthService(mysqlClient, login, config, {});

            //callsArgWith(2, null, results, fields);    is for    .query(query, params, function(error, results, fields)
        });

        it('- should return a object with account find', () => {
            let expectedResult = [{
                "email": "bill1@simble.io",
                "pin": "11111111",
                "role": "simble_user",
                "roleID": 3,
                "userID": 80,
                "active": 1,
                "status": 1
            }];

            mysqlMock.expects('query')
                .withArgs(sqlHelper.getUserSql("bill1@simble.io"))
                .callsArgWith(1, null, expectedResult);

            return authService.getUserProcess(authService.dbClient, authService.login.email, (err, user) => {
                expect(user).to.be.an('object').to.have.property('email').to.equal("bill1@simble.io");
            });
        });

        it('- should return a exception with no account find', () => {
            let expectedResult = [];

            mysqlMock.expects('query')
                .withArgs(sqlHelper.getUserSql("bill1@simble.io"))
                .callsArgWith(1, null, expectedResult);

            return authService.getUserProcess(authService.dbClient, authService.login.email, (err, user) => {
                expect(err).to.be.an('error');
            });
        });

        it('- should return a error with account not activated', () => {
            let expectedResult = [{
                "email": "bill1@simble.io",
                "pin": "11111111",
                "role": "simble_user",
                "roleID": 3,
                "userID": 80,
                "active": 0,
                "status": 1
            }];

            mysqlMock.expects('query')
                .withArgs(sqlHelper.getUserSql("bill1@simble.io"))
                .callsArgWith(1, null, expectedResult);

            return authService.getUserProcess(authService.dbClient, authService.login.email, (err, user) => {
                expect(err).to.be.an('error');
            });
        });

        it('- should return a error with account is disabled', () => {
            let expectedResult = [{
                "email": "bill1@simble.io",
                "pin": "11111111",
                "role": "simble_user",
                "roleID": 3,
                "userID": 80,
                "active": 1,
                "status": 0
            }];

            mysqlMock.expects('query')
                .withArgs(sqlHelper.getUserSql("bill1@simble.io"))
                .callsArgWith(1, null, expectedResult);

            return authService.getUserProcess(authService.dbClient, authService.login.email, (err, user) => {
                expect(err).to.be.an('error');
            });
        });

        afterEach(() => {
            mysqlMock.restore();
        });
    });

    describe(' - Call attachModuleToUserProcess function', () => {
        beforeEach(() => {
            const config = new Config();

            var mysqlConnection = Mysql.createConnection(
                {
                    host: "localhost"
                });

            var login = {
                email: "bill1@simble.io",
                pin: "11111111"
            }

            //mock up a mysql connection    
            mysqlMock = sinon.mock(mysqlConnection);

            //pass the connection to the AuthService
            var mysqlClient = { client: mysqlMock.object };

            authService = new AuthService(mysqlClient, login, config, {});

        });

        afterEach(() => {
            mysqlMock.restore();
            permissionServiceMock.restore();
        });

        it('- should return account level as "customer" without full module', () => {
            let expectedResult = ["overview", "realtime", "customer", "reseller"];

            let user = {
                "email": "bill1@simble.io",
                "pin": "11111111",
                "role": "simble_user",
                "roleID": 3,
                "userID": 80,
                "active": 0,
                "status": 1,
                "level": {
                    "level": "customer"
                }
            };

            permissionServiceMock = sinon.mock(permissionService);

            permissionServiceMock.expects('getModuleNamesByRoleID')
                .withArgs(authService.dbClient, user.roleID)
                .callsArgWith(2, null, expectedResult);

            return authService.attachModuleToUserProcess(authService.dbClient, user, (err, user) => {
                expect(user).to.be.an('object').to.have.property('level').to.have.property('level').to.equal('customer');
            });
        });

        it('- should return account level as "admin" without full module', () => {
            let expectedResult = ["overview", "realtime", "customer", "full", "reseller"];

            let user = {
                "email": "bill1@simble.io",
                "pin": "11111111",
                "role": "simble_user",
                "roleID": 3,
                "userID": 80,
                "active": 0,
                "status": 1,
                "level": {
                    "level": "customer"
                }
            };

            permissionServiceMock = sinon.mock(permissionService);

            permissionServiceMock.expects('getModuleNamesByRoleID')
                .withArgs(authService.dbClient, user.roleID)
                .callsArgWith(2, null, expectedResult);

            return authService.attachModuleToUserProcess(authService.dbClient, user, (err, user) => {
                expect(user).to.be.an('object').to.have.property('level').to.have.property('level').to.equal('admin');
            });
        });

    });
});