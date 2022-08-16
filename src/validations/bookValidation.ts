import Joi from 'joi';
import { IBook } from '../models/Book';

export const bookSchema = {
  book: {
    create: Joi.object<IBook>({
      author: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'Provided author id is invalid',
        }),
      title: Joi.string().required(),
    }),
    update: Joi.object<IBook>({
      author: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'Provided author id is invalid',
        }),
      title: Joi.string().required(),
    }),
  },
};

export default bookSchema;
