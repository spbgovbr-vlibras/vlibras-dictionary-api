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
    , settings = require('../config/settings');


var trie = null;

exports.dicionario = function (req, res, next) {
    if (trie === null)
        exports.load(function (err) {
            if (err) {
                return res.status(404);
            }
            res.status(200).send(trie);
        })
    else
        res.status(200).send(trie);
};

exports.load = function (callback) {
    var spawn = require("child_process").spawn;
    var process = spawn('python', ["./indexer.py"]);
    process.stdout.on('data', function (data) {
        console.log("teste");
        console.log(data.toString());
        trie = data.toString();
    });
    if (callback)
        callback();
};
