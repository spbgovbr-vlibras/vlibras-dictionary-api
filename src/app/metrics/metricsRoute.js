import { Router } from 'express';
// import { signsListValidationRules, checkValidation } from '../middlewares/validator';
import metrics from './metrics';

const metricsRouter = Router();

metricsRouter.get('/metrics',
  // signsListValidationRules,
  // checkValidation,
  metrics);

export default metricsRouter;
