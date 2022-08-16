import express from 'express';
import AuthorRoutes from './authorRoutes';
import BookRoutes from './bookRoutes';

const apiRoutes = express.Router();

apiRoutes.get('/', function (req, res, next) {
  res.send('api v1 is connected');
});

apiRoutes.use('/authors', AuthorRoutes);
apiRoutes.use('/books', BookRoutes);

export default apiRoutes;
