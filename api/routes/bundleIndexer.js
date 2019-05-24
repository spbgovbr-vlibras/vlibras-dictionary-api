import express from 'express';
import indexer from '../controllers/bundleIndexer';

const indexerRouter = express.Router();

indexerRouter.get('/signs', indexer);

export default indexerRouter;