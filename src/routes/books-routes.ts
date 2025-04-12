import { Router } from 'express';
import multer from 'multer';
import BookController from '../http/controllers/books-controller';
import { authMiddleware } from '../middlewares/auth';
import multerConfig from '../config/Multer';

const bookRouter = Router();
const upload = multer(multerConfig);

// Aplica o middleware de autenticação em todas as rotas
bookRouter.use(authMiddleware);

bookRouter.get(
    '/', 
    BookController.index
)

bookRouter.get(
    '/:id',
    BookController.show
)

bookRouter.post(
    '/', 
    upload.single('coverImage'), 
    BookController.create
)

bookRouter.put(
    '/:id', 
    upload.single('coverImage'), 
    BookController.update
)

bookRouter.delete(
    '/:id', 
    BookController.delete
)

bookRouter.get(
    '/category/:categoryId', 
    BookController.byCategory
)

export default bookRouter;