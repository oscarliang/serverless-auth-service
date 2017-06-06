"use strict";

var mysql = require('mysql');

class MysqlClient {

	constructor(config) {
		this.config = config.conf;

		this.timeout = null;

		// we connect to mysql
		this._connectToMysql();
	}

	_connectToMysql() {

		this._timeout = null;

		console.info("Attempting connection to MySQL: " + this.config.mysql.address + ":" + this.config.mysql.port + " / db: " + this.config.mysql.db);

		var sqlClientOptions = {
			host: this.config.mysql.address,
			port: this.config.mysql.port,
			user: this.config.mysql.user,
			password: this.config.mysql.pass,
			database: this.config.mysql.db,
			multipleStatements: true
		};

		this._mysqlClient = mysql.createConnection(sqlClientOptions);

		// connecct handler
		this._mysqlClient.connect((err) => { this._connectHandler(err) });

		// error handler
		this._mysqlClient.on('error', (err) => { this._errorHandler(err) });
	}

	_connectHandler(err) {

		//DEBUG: proper error handling, try again
		if (err !== null) {
			console.error('MySQL connection error: ' + err.stack + " / retrying in 5 seconds");
			if (this._timeout === null)
				this._timeout = setTimeout(() => { this._connectToMysql(); }, 5000);
			return;
		}

		console.info("MySQL client is connected.");
	}

	_errorHandler(err) {

		if (this._timeout !== null)
			return console.error('Mysql error, reconnect already scheduled: code: ' + err.code + " / stack: " + err.stack);

		if (err.code == 'PROTOCOL_CONNECTION_LOST') {
			console.error("Connection to mysql lost, reconnecting in 5 seconds");
			if (this._timeout === null)
				this._timeout = setTimeout(() => { this._connectToMysql(); }, 5000);
			return;
		}

		if (err.fatal) {
			console.error("MySQL FATAL error: attempting reconnect in 5 seconds / code " + err.code + " / stack: " + err.stack);
			if (this._timeout === null)
				this._timeout = setTimeout(() => { this._connectToMysql(); }, 5000);
			return this._mysqlClient.destroy();
		}

		console.error('MySQL non fatal error: code: ' + err.code + " / stack: " + err.stack);
	}

	get client() { return this._mysqlClient; }

	closeConnection(){
		this._mysqlClient.end();
	}

	escape(value) {
		return this._mysqlClient.escape(value);
	}
}

module.exports = MysqlClient;