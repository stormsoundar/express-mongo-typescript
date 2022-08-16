import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from '../constants/http_status';
import Book from '../models/Book';
import ErrorResponse from '../utils/errorResponse';

/**
 *  @desc   Create Book
 *  @route  POST /api/v1/Books
 *  @access Private
 */
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const isExistingBook = await Book.findOne({ title: req.body.title });

  if (isExistingBook)
    return next(new ErrorResponse('Book Already Exists!', httpStatus.CONFLICT));

  const createBook = await Book.create(req.body);

  return res
    .status(httpStatus.CREATED)
    .send({ success: true, data: createBook });
};

/**
 *  @desc   Get all Books
 *  @route  GET /api/v1/Books
 *  @access Public
 */
const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.OK).send({
    success: true,
    data: await Book.find().populate('author').select('-__v'),
  });
};

/**
 *  @desc   Get one Book
 *  @route  GET /api/v1/Books/:id
 *  @access Private
 */
const getBook = async (req: Request, res: Response, next: NextFunction) => {
  const BookExists = await Book.findOne({ _id: req.params.id })
    .populate('author')
    .select('-__v');

  if (!BookExists)
    return next(new ErrorResponse('Book not found!', httpStatus.CONFLICT));

  return res.status(httpStatus.OK).send({ success: true, data: BookExists });
};

/**
 *  @desc   Update Book
 *  @route  PATCH /api/v1/Books/:id
 *  @access Private
 */
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const allowedUpdates = ['title', 'author'];
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

  const updatedBook = await Book.findOneAndUpdate({ _id: id }, req.body, {
    runValidators: true,
    new: true,
  });

  if (!updatedBook)
    return next(new ErrorResponse('Book not found', httpStatus.NOT_FOUND));

  return res.status(httpStatus.OK).send({ success: true, data: updatedBook });
};

/**
 *  @desc   Delete Book
 *  @route  DELETE /api/v1/Books/:id
 *  @access Private
 */
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/))
    return next(new ErrorResponse('Invalid id', httpStatus.BAD_REQUEST));

  const deletedBook = await Book.findOneAndDelete({ _id: id });

  if (!deletedBook)
    return next(new ErrorResponse('Book not found', httpStatus.NOT_FOUND));

  return res.status(httpStatus.OK).send({ success: true, data: deletedBook });
};

export default {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
};
