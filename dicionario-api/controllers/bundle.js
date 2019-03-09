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
    , request = require('request')
    , settings = require('../config/settings');

exports.download = function (req, res, next) {
    if (!req.params.id)
        return error.badRequest('Bundle not specified.', next);

    if (!req.params.version)
        return error.badRequest('Unity Version not specified.', next);

    if (!req.params.platform)
        return error.badRequest('Platform not specified.', next);

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
                res.status(404);
                return error.notFound('Can\'t find any content for this version and bundle.', next);
            }
            res.download(bundleFile, function (err) {
                if (err)
                    return error.notFound('Can\'t find any content for this version and bundle.', next);
            });
        });
    }
    else {
        res.download(bundleFile, function (err) {
            if (err)
                return error.notFound('Can\'t find any content for this version and bundle.', next);
        });
    }
};

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

const downloadBundle = (url, dest, cb) => {
   
    const sendReq = request.get(url);

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
