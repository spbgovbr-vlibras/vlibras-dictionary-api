import { Router } from 'express';
import { dictionaryValidationRules, checkValidation } from '../middlewares/validator';
import { signsDownloader, regionSignsDownloader } from './signsDownloader';

const signsDownloaderRouter = Router();

signsDownloaderRouter
  .get('/:version/:platform/:sign',
    dictionaryValidationRules,
    checkValidation,
    signsDownloader)
  .get('/:version/:platform/:region/:sign',
    dictionaryValidationRules,
    checkValidation,
    regionSignsDownloader);

export default signsDownloaderRouter;
