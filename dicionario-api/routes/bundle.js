/**
 * Author: Wesnydy Lima Ribeiro
 * Email: wesnydy@lavid.ufpb.br
 */

var express = require('express')
    , router = express.Router()
    , bundleController = require('../controllers/bundle');

/**
 * Route to process gloss and create video.
 */
router
    .get('/:version/:platform/:id', bundleController.download)

module.exports = router;
