import express from 'express';
import BookController from '../../../controllers/BookController';
import validate from '../../../middleware/validate';
import bookSchema from '../../../validations/bookValidation';

const router = express.Router();

router.post('/', validate(bookSchema.book.create), BookController.createBook);
router.get('/', BookController.getAllBooks);
router.get('/:id', BookController.getBook);
router.patch(
  '/:id',
  validate(bookSchema.book.update),
  BookController.updateBook
);
router.delete('/:id', BookController.deleteBook);

export default router;
