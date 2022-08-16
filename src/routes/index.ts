import express from 'express';
import apiRoutes from './api/v1/index';

const mainRouter = express.Router();

mainRouter.use('/api/v1', apiRoutes);

export default mainRouter;
