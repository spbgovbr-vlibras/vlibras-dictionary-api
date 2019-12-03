import { Router } from 'express';
import { signsListValidationRules, checkValidation } from '../middlewares/validator';
import dictionarySigns from './dictionarySigns';

const dictionarySignsRouter = Router();

dictionarySignsRouter.get('/signs',
  signsListValidationRules,
  checkValidation,
  dictionarySigns);

export default dictionarySignsRouter;
