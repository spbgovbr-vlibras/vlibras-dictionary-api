import createError from 'http-errors';
import fs from 'fs';
import path from 'path';
import env from '../../config/environments/environment';
import signsUpdate from '../util/signsUpdate';
import Sign from './Sign';
import { VALIDATION_VALUES } from '../../config/validation';
import { DICTIONARY_ERROR } from '../../config/error';

const signsDownloader = async function signsDownloaderController(req, res, next) {
  try {
    let signFile = path.join(
      env.DICTIONARY_DIR,
      req.params.version,
      req.params.platform,
      req.params.sign,
    );

    return fs.access(signFile, fs.F_OK, async (err) => {
      const signUpdateData = {
        query: {
          $and: [
            { name: req.params.sign },
            { region: VALIDATION_VALUES.defaultDictionaryRegion },
          ],
        },
        update: {
          name: req.params.sign,
          region: VALIDATION_VALUES.defaultDictionaryRegion,
          available: true,
          $inc: { hits: 1 },
          requester: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        },
        options: { upsert: true },
      };

      if (err) {
        try {
          signFile = await signsUpdate(
            req.params.version,
            req.params.platform,
            req.params.sign,
          );
          res.download(signFile);
        } catch (signUpdateError) {
          signUpdateData.update.available = false;
          next(createError(404, DICTIONARY_ERROR.signNotFound));
        } finally {
          try {
            await Sign.findOneAndUpdate(
              signUpdateData.query,
              signUpdateData.update,
              signUpdateData.options,
            );
          } catch (databaseUpdateError) { /* empty */ }
        }
      } else {
        res.download(signFile);
        try {
          await Sign.findOneAndUpdate(
            signUpdateData.query,
            signUpdateData.update,
            signUpdateData.options,
          );
        } catch (databaseUpdateError) { /* empty */ }
      }
    });
  } catch (error) {
    return next(error);
  }
};

const regionSignsDownloader = async function regionSignsDownloaderController(req, res, next) {
  try {
    let signFile = path.join(
      env.DICTIONARY_DIR,
      req.params.version,
      req.params.platform,
      req.params.region,
      req.params.sign,
    );

    fs.access(signFile, fs.F_OK, async (err) => {
      const signUpdateData = {
        query: {
          $and: [
            { name: req.params.sign },
            { region: req.params.region },
          ],
        },
        update: {
          name: req.params.sign,
          region: req.params.region,
          available: true,
          $inc: { hits: 1 },
          requester: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        },
        options: { upsert: true },
      };

      if (err) {
        try {
          signFile = await signsUpdate(
            req.params.version,
            req.params.platform,
            req.params.sign,
            req.params.region,
          );
          res.download(signFile);
        } catch (error) {
          signUpdateData.update.available = false;
          try {
            await signsDownloader(req, res, next);
          } catch (signsDownloaderError) {
            next(signsDownloaderError);
          }
        } finally {
          try {
            await Sign.findOneAndUpdate(
              signUpdateData.query,
              signUpdateData.update,
              signUpdateData.options,
            );
          } catch (databaseUpdateError) { /* empty */ }
        }
      } else {
        res.download(signFile);
        try {
          await Sign.findOneAndUpdate(
            signUpdateData.query,
            signUpdateData.update,
            signUpdateData.options,
          );
        } catch (databaseUpdateError) { /* empty */ }
      }
    });
  } catch (error) {
    next(error);
  }
};

export {
  signsDownloader,
  regionSignsDownloader,
};
