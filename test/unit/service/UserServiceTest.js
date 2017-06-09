
var userService = require('../../../service/UserService.js');
var resellerService = require('../../../service/ResellerService.js');
var sqlHelper = require('../../../util/SqlHelper.js');
var Mysql = require('mysql');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;

var MysqlClient = require('../../../util/MysqlClient.js');

var sinon = require('sinon');

describe('UserService Test', () => {
    describe(' - Call getUserLevelObjByUserID function', () => {

        var mysqlMock;
        var resellerServiceMock;
        var mysqlClient;

        beforeEach(() => {

            var mysqlConnection = Mysql.createConnection(
                {
                    host: "localhost"
                });

            //mock up a mysql connection    
            mysqlMock = sinon.mock(mysqlConnection);

            //pass the connection to the AuthService
            mysqlClient = { client: mysqlMock.object };

        });

        afterEach(() => {
            mysqlMock.restore();
            resellerServiceMock.restore();
        });

        it('- should return a admin level by useing admin account', () => {
            let expectedResult = [{ level: 'admin', customerID: 0, resellerID: null }];
            let expectedCustomerIDs = [4, 5, 6, 7, 22, 24, 25, 27, 28, 29];
            let expectedResellerIDs = [1, 2, 3, 13, 23];
            let userID = 1;
            let userEmail = "test@gmail.com"

            mysqlMock.expects('query')
                .withArgs(sqlHelper.getAccountByUserIdSql(userID))
                .callsArgWith(1, null, expectedResult);

            resellerServiceMock = sinon.mock(resellerService);

            resellerServiceMock.expects('getALLCustomers')
                .withArgs(mysqlMock.object)
                .callsArgWith(1, null, expectedCustomerIDs);

            resellerServiceMock.expects('getALLResellers')
                .withArgs(mysqlMock.object)
                .callsArgWith(1, null, expectedResellerIDs);

            return userService.getUserLevelObjByUserID(mysqlMock.object, userID, (err, userCustomerObjs) => {
                expect(userCustomerObjs).to.be.an('object').to.have.property('level').to.equal("admin");
                expect(userCustomerObjs).to.have.property('resellerIDs').to.have.lengthOf(5);
            });
        });

        it('- should return a reseller level by useing reseller account', () => {
            let expectedResult = [
                { level: 'reseller', customerID: 1, resellerID: 0 },
                { level: 'reseller', customerID: 2, resellerID: 0 }
            ];
            let expectedCustomer1IDs = [5, 6, 7, 22, 29];
            let expectedCustomer2IDs = [24, 25, 27]
            let userID = 1;
            let userEmail = "reseller@gmail.com"

            mysqlMock.expects('query')
                .withArgs(sqlHelper.getAccountByUserIdSql(userID))
                .callsArgWith(1, null, expectedResult);

            resellerServiceMock = sinon.mock(resellerService);

            resellerServiceMock.expects('getCustomerListByResellerID')
                .withArgs(mysqlMock.object, 1)
                .callsArgWith(2, null, expectedCustomer1IDs);

            resellerServiceMock.expects('getCustomerListByResellerID')
                .withArgs(mysqlMock.object, 2)
                .callsArgWith(2, null, expectedCustomer2IDs);

            return userService.getUserLevelObjByUserID(mysqlMock.object, userID, (err, userCustomerObjs) => {
                // console.log(userCustomerObjs);
                expect(userCustomerObjs).to.be.an('object').to.have.property('level').to.equal("reseller");
                expect(userCustomerObjs).to.have.property('customerIDs').to.have.lengthOf(8);
                expect(userCustomerObjs).to.have.property('resellerIDs').to.have.lengthOf(2);
            });
        });

        it('- should return a customer level by useing customer account', () => {
            let expectedResult = [
                { level: 'customer', customerID: 22, resellerID: 1 },
                { level: 'customer', customerID: 24, resellerID: 2 }
            ];
            let userID = 1;
            let userEmail = "customer@gmail.com"

            mysqlMock.expects('query')
                .withArgs(sqlHelper.getAccountByUserIdSql(userID))
                .callsArgWith(1, null, expectedResult);

            return userService.getUserLevelObjByUserID(mysqlMock.object, userID, (err, userCustomerObjs) => {
                // console.log(userCustomerObjs);
                expect(userCustomerObjs).to.be.an('object').to.have.property('level').to.equal("customer");
                expect(userCustomerObjs).to.have.property('customerIDs').to.have.lengthOf(2);
                expect(userCustomerObjs).to.have.property('resellerIDs').to.have.lengthOf(2);
            });
        });

        it('- should return a user level by useing user account', () => {
            let expectedResult = [{ level: 'user', customerID: 7, resellerID: 1 }];
            let userID = 1;
            let userEmail = "user@gmail.com"

            mysqlMock.expects('query')
                .withArgs(sqlHelper.getAccountByUserIdSql(userID))
                .callsArgWith(1, null, expectedResult);

            return userService.getUserLevelObjByUserID(mysqlMock.object, userID, (err, userCustomerObjs) => {
                // console.log(userCustomerObjs);
                expect(userCustomerObjs).to.be.an('object').to.have.property('level').to.equal("user");
                expect(userCustomerObjs).to.have.property('customerIDs').to.have.lengthOf(1);
                expect(userCustomerObjs).to.have.property('resellerIDs').to.have.lengthOf(1);
            });
        });
    });
});