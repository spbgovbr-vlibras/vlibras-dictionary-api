import createError from 'http-errors';
import fs from 'fs';
import path from 'path';
import env from '../../config/environments/environment';
import { signIntensifierSanitizer, signContextSanitizer } from '../util/sanitizer';
import repositorySignRequest from '../util/repositorySignRequest';
import Sign from './Sign';
import SignsRequest from './SignsRequest';
import { DEFAULT_DICTIONARY_REGION } from '../../config/default';
import { DICTIONARY_ERROR } from '../../config/error';

const signsDownloader = async function signsDownloaderController(req, res, next) {
  try {
    let signFile = path.join(
      env.LOCAL_DICTIONARY_REPOSITORY,
      req.params.version,
      req.params.platform,
      req.params.sign,
    );

    const signUpdateData = {
      query: {
        $and: [
          { name: req.params.sign },
          { region: DEFAULT_DICTIONARY_REGION },
        ],
      },
      update: {
        name: req.params.sign,
        region: DEFAULT_DICTIONARY_REGION,
        available: true,
        $inc: { hits: 1 },
      },
      options: { upsert: true, new: true },
    };

    return fs.access(signFile, fs.F_OK, async (signNotInLocalError) => {
      if (signNotInLocalError) {
        try {
          signFile = await repositorySignRequest(
            req.params.version,
            req.params.platform,
            req.params.sign,
          );
          res.download(signFile);
        } catch (repositorySignRequestError) {
          signUpdateData.update.available = false;

          let alternativeSign = signIntensifierSanitizer(req.params.sign);
          alternativeSign = signContextSanitizer(alternativeSign);

          if (alternativeSign === req.params.sign) {
            return next(createError(404, DICTIONARY_ERROR.signNotFound));
          }

          signFile = signFile.replace(req.params.sign, alternativeSign);
          fs.access(signFile, fs.F_OK, async (alternativeSignNotInLocalError) => {
            if (alternativeSignNotInLocalError) {
              try {
                signFile = await repositorySignRequest(
                  req.params.version,
                  req.params.platform,
                  alternativeSign,
                );
                res.download(signFile);
              } catch (repositorySignRequestError2) {
                next(createError(404, DICTIONARY_ERROR.signNotFound));
              }
            } else {
              res.download(signFile);
            }
            return undefined;
          });
        } finally {
          try {
            const sign = await Sign.findOneAndUpdate(
              signUpdateData.query,
              signUpdateData.update,
              signUpdateData.options,
            );

            await SignsRequest.create({
              // eslint-disable-next-line no-underscore-dangle
              sign: sign._id,
              requester: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              available: false,
            });
          } catch (databaseUpdateError) { /* empty */ }
        }
      } else {
        res.download(signFile);
        try {
          const sign = await Sign.findOneAndUpdate(
            signUpdateData.query,
            signUpdateData.update,
            signUpdateData.options,
          );

          await SignsRequest.create({
            // eslint-disable-next-line no-underscore-dangle
            sign: sign._id,
            requester: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            available: true,
          });
        } catch (databaseUpdateError) { /* empty */ }
      }
      return undefined;
    });
  } catch (error) {
    return next(error);
  }
};

const regionSignsDownloader = async function regionSignsDownloaderController(req, res, next) {
  try {
    let signFile = path.join(
      env.LOCAL_DICTIONARY_REPOSITORY,
      req.params.version,
      req.params.platform,
      req.params.region,
      req.params.sign,
    );

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

    fs.access(signFile, fs.F_OK, async (signNotInLocalError) => {
      if (signNotInLocalError) {
        try {
          signFile = await repositorySignRequest(
            req.params.version,
            req.params.platform,
            req.params.sign,
          );
          res.download(signFile);
        } catch (repositorySignRequestError) {
          signUpdateData.update.available = false;

          let alternativeSign = signIntensifierSanitizer(req.params.sign);
          alternativeSign = signContextSanitizer(alternativeSign);

          if (alternativeSign === req.params.sign) {
            return next(createError(404, DICTIONARY_ERROR.signNotFound));
          }

          signFile = signFile.replace(req.params.sign, alternativeSign);
          fs.access(signFile, fs.F_OK, async (alternativeSignNotInLocalError) => {
            if (alternativeSignNotInLocalError) {
              try {
                signFile = await repositorySignRequest(
                  req.params.version,
                  req.params.platform,
                  alternativeSign,
                );
                res.download(signFile);
              } catch (repositorySignRequestError2) {
                next(createError(404, DICTIONARY_ERROR.signNotFound));
              }
            } else {
              res.download(signFile);
            }
            return undefined;
          });
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
      return undefined;
    });
  } catch (error) {
    next(error);
  }
};

export {
  signsDownloader,
  regionSignsDownloader,
};
