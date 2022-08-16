import express, { Router } from 'express';
import chalk from 'chalk';
import http from 'http';
import mongoose from 'mongoose';
import connectDB from './config/db/dbConfig';
import Logging from './library/Logging';
import httpStatus from './constants/http_status';
import { config } from './loaders/config';
import mainRouter from './routes';
import errorHandler from './middleware/error';
declare global {
  var cl: any;
}

globalThis.cl = console.log;

const router = express();

/** Connect DB */
connectDB();

const startServer = () => {
  /** Log the request */
  router.use((req, res, next) => {
    /** Log the req */
    Logging.info(
      `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
      /** Log the response */
      Logging.info(
        `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  /** Rules of our API */

  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(httpStatus.OK).json({});
    }

    next();
  });

  /** Routes */
  router.use('/', mainRouter);

  /** Error Handler */
  router.use(errorHandler);

  /** Health check  */
  router.get('/health', (req, res, next) =>
    res.status(httpStatus.OK).send({ message: 'Health OK 👍' })
  );

  /** Error Handling  */
  router.use((req, res, next) => {
    const error = new Error('not found');
    Logging.error(error);

    return res.status(httpStatus.NOT_FOUND).send({ message: error.message });
  });

  http
    .createServer(router)
    .listen(config.server.PORT, () =>
      Logging.info(`Server is running on ${config.server.PORT}`)
    );
};
startServer();
