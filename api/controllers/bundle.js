/**
 * Author: Wesnydy Lima Ribeiro
 * Email: wesnydy@lavid.ufpb.br
 */

'use strict';

/**
 * Required libs.
 */
var fs = require('fs')
    , path = require('path')
//    , shortid = require('shortid')
    , error = require('../helpers/error')
    , http = require("http")
    , requester = require('request')
    , db = require('../models/request')
    , indexer = require('../controllers/indexer')
    , settings = require('../config/settings');

exports.download = function (req, res, next) {
    if (!req.params.id)
        return error.badRequest('Bundle not specified.', next);

    if (!req.params.version)
        return error.badRequest('Unity Version not specified.', next);

    if (!req.params.platform)
        return error.badRequest('Platform not specified.', next);

    processBundle(req, res, next);
};

exports.regionDownload = function (req, res, next) {
    if (!req.params.id)
        return error.badRequest('Bundle not specified.', next);

    if (!req.params.version)
        return error.badRequest('Unity Version not specified.', next);

    if (!req.params.region)
        return error.badRequest('Region not specified.', next);

    if (!req.params.platform)
        return error.badRequest('Platform not specified.', next);

    processRegionalBundle(req, res, next);
};

function processRegionalBundle(req, res, next) {
    var hitOrMiss = true;

    var bundleVersion = path.join(settings.config.bundlesDir, req.params.version);

    var bundlePlatformDir = path.join(bundleVersion, req.params.platform);

    var bundleRegionDir = path.join(bundlePlatformDir, req.params.region);

    var bundleFile = path.join(bundleRegionDir, req.params.id);

    ensureDirectoryExistence(bundleFile);
    if (!fs.existsSync(bundleFile)) {
        var dic = settings.config.mainDic;
        var port = settings.config.dicPort;
        var url = 'http://' + dic + ':' + port + '/' + req.params.version + '/' + req.params.platform + '/' + req.params.region + '/' +req.params.id;
        downloadBundle(url, bundleFile, function (callbackerror) {
            if (callbackerror) {
                hitOrMiss = false;
                saveRequest(req.params.region+" "+req.params.id, hitOrMiss, req.header('x-forwarded-for') || req.connection.remoteAddress);
                processBundle(req, res, next);
            }
            saveRequest(req.params.id, hitOrMiss, req.header('x-forwarded-for') || req.connection.remoteAddress);
            res.download(bundleFile, function (err) {
                if (err)
                    processBundle(req, res, next);
            });
        });
    }
    else {
        saveRequest(req.params.id, hitOrMiss, req.header('x-forwarded-for') || req.connection.remoteAddress);
        res.download(bundleFile, function (err) {
            if (err)
                processBundle(req, res, next);
        });
    }
    indexer.load();
}

function processBundle(req, res, next) {


    var hitOrMiss = true;

    var bundleVersion = path.join(settings.config.bundlesDir, req.params.version);

    var bundlePlatformDir = path.join(bundleVersion, req.params.platform);

    var bundleFile = path.join(bundlePlatformDir, req.params.id);

    ensureDirectoryExistence(bundleFile);
    if (!fs.existsSync(bundleFile)) {
        var dic = settings.config.mainDic;
        var port = settings.config.dicPort;
        var url = 'http://' + dic + ':' + port + '/' + req.params.version + '/' + req.params.platform + '/' + req.params.id;
        downloadBundle(url, bundleFile, function (callbackerror) {
            if (callbackerror) {
                hitOrMiss = false;
                saveRequest(req.params.id, hitOrMiss, req.header('x-forwarded-for') || req.connection.remoteAddress);
                res.status(404);
                return error.notFound('Can\'t find any content for this version and bundle.', next);
            }
            saveRequest(req.params.id, hitOrMiss, req.header('x-forwarded-for') || req.connection.remoteAddress);
            res.download(bundleFile, function (err) {
                if (err)
                    return error.notFound('Can\'t find any content for this version and bundle.', next);
            });
        });
    }
    else {
        saveRequest(req.params.id, hitOrMiss, req.header('x-forwarded-for') || req.connection.remoteAddress);
        res.download(bundleFile, function (err) {
            if (err)
                return error.notFound('Can\'t find any content for this version and bundle.', next);
        });
    }
    indexer.load();
}

function saveRequest(bun, hitOrMiss, ip) {
    const request = new db.Request({
        bundle: bun,
        hit: hitOrMiss,
        requester: ip
    });

    request.save();
};

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

const downloadBundle = (url, dest, cb) => {
   
    const sendReq = requester.get(url);

    // verify response code
    sendReq.on('response', (response) => {
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }
        const file = fs.createWriteStream(dest);
        sendReq.pipe(file);

        // close() is async, call cb after close completes
        file.on('finish', () => file.close(cb));

        file.on('error', (err) => { // Handle errors
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            return cb(err.message);
        });
    });

    // check for request errors
    sendReq.on('error', (err) => {
        fs.unlinkSync(dest);
        return cb(err.message);
    });

};

var getBundle = function (url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function (response) {
        if(err)
        response.pipe(file);
        file.on('finish', function () {
            console.log("Baixou");
            file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest, (err) => {
            if (err) {
                console.log("failed to delete local image:" + err);
            } else {
                console.log('successfully deleted local image');
            }
        }); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
};