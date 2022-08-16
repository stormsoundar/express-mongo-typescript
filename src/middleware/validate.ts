import { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from './asyncHandler';
import ErrorResponse from '../utils/errorResponse';
import httpStatus from '../constants/http_status';

const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (!error) next();
    else {
      const message = error.details
        .map((i) => i.message)
        .join(',')
        .replace(/['"]+/g, '');
      return next(new ErrorResponse(message, httpStatus.UNPROCESSABLE_ENTITY));
    }
  };
};

export default validate;
