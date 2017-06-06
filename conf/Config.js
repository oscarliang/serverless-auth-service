"use strict";

var fs = require('fs');
var _ = require('lodash');

class Config {

    constructor() {

        // we determine the environment
        this.currentFolder = __dirname + "/../";

        this.env = this.determineEnv();

        console.info("Environment: '" + this.env + "'");

        try {
            this.commonConfig = this.getCommonConfig();
            this.envConfig = this.getEnvConfig(this.env);
        } catch (e) {
            console.error("Unable to read config file(s): " + e);
            throw e;
        }

        console.info("Successfully parsed common config file " + JSON.stringify(this.commonConfig).length + " bytes");
        console.info("Successfully parsed '" + this.env + "' config file " + JSON.stringify(this.envConfig).length + " bytes");

        this.envConfig.env = this.env;

        // we merge the 2 objects
        this.config = _.merge(this.commonConfig, this.envConfig);
    }

    determineEnv() {

        var env = "dev";
        try {
            env = fs.readFileSync(this.currentFolder + "env");
        } catch (e) {
            env = process.env.ENV;
            if (env === undefined) {
                env = "dev";
                console.error("Unable to determine the environment - .env file missing. Starting as '" + env + "'");
            }
        }
        // we make sure we trim the env string
        return ("" + env).trim();
    }

    getCommonConfig() {
        var commonConfig = fs.readFileSync(this.currentFolder + "conf/config.all.json");
        return JSON.parse(commonConfig);
    }

    getEnvConfig(env) {
        var envConfig = fs.readFileSync(this.currentFolder + "conf/config." + env + ".json");
        return JSON.parse(envConfig);
    }

    get conf() { return this.config; }
}

module.exports = Config;