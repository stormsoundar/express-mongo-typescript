import { NextFunction, Request, Response } from 'express';
import httpStatus from '../constants/http_status';
import Author from '../models/Author';
import ErrorResponse from '../utils/errorResponse';

/**
 *  @desc   Create Author
 *  @route  POST /api/v1/authors
 *  @access Private
 */
const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isExistingAuthor = await Author.findOne({ name: req.body.name });

  if (isExistingAuthor)
    return next(
      new ErrorResponse('Author Already Exists!', httpStatus.CONFLICT)
    );

  const createAuthor = await Author.create(req.body);

  return res
    .status(httpStatus.CREATED)
    .send({ success: true, data: createAuthor });
};

/**
 *  @desc   Get all Authors
 *  @route  GET /api/v1/authors
 *  @access Public
 */
const getAllAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res
    .status(httpStatus.OK)
    .send({ success: true, metadata: {}, data: await Author.find() });
};

/**
 *  @desc   Get one Author
 *  @route  GET /api/v1/authors/:id
 *  @access Private
 */
const getAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const authorExists = await Author.findOne({ _id: req.params.id });

  if (!authorExists)
    return next(new ErrorResponse('Author not found!', httpStatus.CONFLICT));

  return res.status(httpStatus.OK).send({ success: true, data: authorExists });
};

/**
 *  @desc   Update Author
 *  @route  PATCH /api/v1/authors/:id
 *  @access Private
 */
const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const allowedUpdates = ['name'];
  const updates = Object.keys(req.body);

  if (!id.match(/^[0-9a-fA-F]{24}$/))
    return next(new ErrorResponse('Invalid id', httpStatus.BAD_REQUEST));

  const isUpdateValid = updates.every((update) =>
    allowedUpdates.includes(update.trim())
  );

  if (!isUpdateValid)
    return next(
      new ErrorResponse('Input field invalid', httpStatus.BAD_REQUEST)
    );

  const updatedAuthor = await Author.findOneAndUpdate({ _id: id }, req.body, {
    runValidators: true,
    new: true,
  });

  if (!updatedAuthor)
    return next(new ErrorResponse('Author not found', httpStatus.NOT_FOUND));

  return res.status(httpStatus.OK).send({ success: true, data: updatedAuthor });
};

/**
 *  @desc   Delete Author
 *  @route  DELETE /api/v1/authors/:id
 *  @access Private
 */
const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/))
    return next(new ErrorResponse('Invalid id', httpStatus.BAD_REQUEST));

  const deletedAuthor = await Author.findOneAndDelete({ _id: id });

  if (!deletedAuthor)
    return next(new ErrorResponse('Author not found', httpStatus.NOT_FOUND));

  return res.status(httpStatus.OK).send({ success: true, data: deletedAuthor });
};

export default {
  createAuthor,
  getAllAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
