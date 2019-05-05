import express from 'express';
import { check } from 'express-validator/check';
import { downloader, regionDownloader } from '../controllers/bundleDownloader';
import { DICT_VERSIONS, DICT_PLATFORMS, DICT_REGIONS } from '../config/dictionary/parameters';
import toUpperCaseSanitizer from '../helpers/sanitizer';

const downloaderRouter = express.Router();

downloaderRouter
  .get('/:version/:platform/:sign', [
    check('version').isIn(DICT_VERSIONS),
    check('platform').customSanitizer(toUpperCaseSanitizer).isIn(DICT_PLATFORMS),
    check('sign').not().isEmpty().customSanitizer(toUpperCaseSanitizer)
  ], downloader)
  .get('/:version/:platform/:region/:sign', [
    check('version').isIn(DICT_VERSIONS),
    check('platform').customSanitizer(toUpperCaseSanitizer).isIn(DICT_PLATFORMS),
    check('region').customSanitizer(toUpperCaseSanitizer).isIn(DICT_REGIONS),
    check('sign').not().isEmpty().customSanitizer(toUpperCaseSanitizer)
  ], regionDownloader);

export default downloaderRouter;
