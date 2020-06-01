import createError from 'http-errors';
import { param, query, validationResult } from 'express-validator/check';
import { toUpperCaseSanitizer } from '../util/sanitizer';
import { VALIDATION_VALUES, VALIDATION_ERRORS } from '../../config/validation';

export const dictionaryValidationRules = [
  param('version')
    .isIn(VALIDATION_VALUES.dictionaryVersions)
    .withMessage(VALIDATION_ERRORS.dictionaryVersions),
  param('platform')
    .customSanitizer(toUpperCaseSanitizer)
    .isIn(VALIDATION_VALUES.dictionaryPlatforms)
    .withMessage(VALIDATION_ERRORS.dictionaryPlatforms),
  param('region')
    .optional()
    .customSanitizer(toUpperCaseSanitizer)
    .isIn(VALIDATION_VALUES.dictionaryRegions)
    .withMessage(VALIDATION_ERRORS.dictionaryRegions),
  param('sign')
    .not().isEmpty()
    .customSanitizer(toUpperCaseSanitizer)
    .withMessage(VALIDATION_ERRORS.dictionarySign),
];

export const signsListValidationRules = [
  query('version')
    .optional()
    .isIn(VALIDATION_VALUES.dictionaryVersions)
    .withMessage(VALIDATION_ERRORS.dictionaryVersions),
];

export const timestampValidationRules = query('timestamp')
  .optional()
  .isInt(VALIDATION_VALUES.dateInterval)
  .toInt()
  .withMessage(VALIDATION_ERRORS.dateInterval);


export const checkValidation = function checkRequestValidation(req, _res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return next(createError(422, { errors: extractedErrors }));
};
