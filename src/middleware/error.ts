import ErrorResponse from '../utils/errorResponse';
import { NextFunction, Request, Response } from 'express';
import Logging from '../library/Logging';

const errorHandler: any = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  Logging.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Provided id ${err.value} is Invalid Object Id`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) =>
      val.message ? val.message : val
    );
    error = new ErrorResponse(message, 400);
  }

  return res.status(err.statusCode || 500).send({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
