import express from 'express';
import { check } from 'express-validator/check';
import { downloader, regionDownloader } from '../controllers/bundleDownloader';

const downloaderRouter = express.Router();

const dictVersions = ['3.3.1'];
const dictPlatforms = ['ANDROID', 'IOS', 'STANDALONE', 'WEBGL']
const dictRegions = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
	"MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
	"RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const toUpperCaseSanitize = function(value) {
  return typeof value === 'string' ? value.toUpperCase() : value;
}

downloaderRouter
  .get('/:version/:platform/:sign', [
    check('version').isIn(dictVersions),
    check('platform').customSanitizer(toUpperCaseSanitize).isIn(dictPlatforms),
    check('sign').not().isEmpty().customSanitizer(toUpperCaseSanitize)
  ], downloader)
  .get('/:version/:platform/:region/:sign', [
    check('version').isIn(dictVersions),
    check('platform').customSanitizer(toUpperCaseSanitize).isIn(dictPlatforms),
    check('region').customSanitizer(toUpperCaseSanitize).isIn(dictRegions),
    check('sign').not().isEmpty().customSanitizer(toUpperCaseSanitize)
  ], regionDownloader);

export default downloaderRouter;
