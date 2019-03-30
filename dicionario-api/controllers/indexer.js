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

function runPython(){
    var result = null
    var spawn = require("child_process").spawn;
    var process = spawn('python', ["./indexer.py"]);
    process.stdout.on('data', function (data) {
        result = data.toString();
    });
    return result;
};

function cmdPython(){
    const { exec } = require('child_process');
    exec('python ./indexer.py', {maxBuffer: 1024*10000000}, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      //console.log(stdout);
      trie = stdout;
      return stdout;
    });
};

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

exports.load = async function () {

    //await cmdPython(function(result){
    //     console.log(result);
    //     trie = result;
    //});
    const { exec } = require('child_process');
    await exec('python ./indexer.py', {maxBuffer: 1024*10000000}, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
	return;
      }
      console.log(stdout);
      trie = stdout;
    });
    //console.log("teste " + trie);
};
