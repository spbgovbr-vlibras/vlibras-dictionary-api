import express from 'express';
import { check } from 'express-validator/check';
import { downloader, regionDownloader } from '../controllers/bundleDownloader';
import toUpperCaseSanitizer from '../helpers/sanitizer';

const downloaderRouter = express.Router();

const dictVersions = ['3.3.1'];
const dictPlatforms = ['ANDROID', 'IOS', 'STANDALONE', 'WEBGL']
const dictRegions = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
	"MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
	"RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

downloaderRouter
  .get('/:version/:platform/:sign', [
    check('version').isIn(dictVersions),
    check('platform').customSanitizer(toUpperCaseSanitizer).isIn(dictPlatforms),
    check('sign').not().isEmpty().customSanitizer(toUpperCaseSanitizer)
  ], downloader)
  .get('/:version/:platform/:region/:sign', [
    check('version').isIn(dictVersions),
    check('platform').customSanitizer(toUpperCaseSanitizer).isIn(dictPlatforms),
    check('region').customSanitizer(toUpperCaseSanitizer).isIn(dictRegions),
    check('sign').not().isEmpty().customSanitizer(toUpperCaseSanitizer)
  ], regionDownloader);

export default downloaderRouter;
