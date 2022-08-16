import Joi from 'joi';
import { IAuthor } from '../models/Author';

const authorSchema = {
  author: {
    create: Joi.object<IAuthor>({
      name: Joi.string().required(),
    }),
    update: Joi.object<IAuthor>({
      name: Joi.string().required(),
    }),
  },
};

export default authorSchema;
