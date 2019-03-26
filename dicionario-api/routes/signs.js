'use strict';
var express = require('express');
var indexer = require('../controllers/indexer');
var router = express.Router();

/* GET users listing. */
router.get('/', indexer.dicionario);

module.exports = router;
