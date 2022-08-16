import express from 'express';
import AuthController from '../../../controllers/AuthorController';
import validate from '../../../middleware/validate';
import authorSchema from '../../../validations/authorValidation';

const router = express.Router();

router.post(
  '/',
  validate(authorSchema.author.create),
  AuthController.createAuthor
);
router.get('/', AuthController.getAllAuthors);
router.get('/:id', AuthController.getAuthor);
router.patch(
  '/:id',
  validate(authorSchema.author.update),
  AuthController.updateAuthor
);
router.delete('/:id', AuthController.deleteAuthor);

export default router;
