'use strict';

var config = {};
var path = require('path');

config.mainDic = "150.165.204.184";
if (process.env.DICIONARIO_URL)
    config.mainDic = process.env.DICIONARIO_URL;

config.dicPort = "8080";
if (process.env.DICIONARIO_PORT)
    config.dicPort = process.env.DICIONARIO_PORT;

config.bundlesDir = path.join(__dirname, '/bundles');
if (process.env.BUNDLES_DIR)
    config.bundlesDir = path.join(process.env.BUNDLES_DIR, '/bundles');

config.defaultVer = "3.3.1"
if (process.env.DEFAULT_VERSION)
    config.defaultVer = process.env.DEFAULT_VERSION;

module.exports.config = config;
