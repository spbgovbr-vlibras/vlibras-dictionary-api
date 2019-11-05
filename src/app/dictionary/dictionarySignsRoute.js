import { Router } from 'express';
import dictionarySigns from './dictionarySigns';

const dictionarySignsRouter = Router();

dictionarySignsRouter.get('/signs', dictionarySigns);

export default dictionarySignsRouter;
