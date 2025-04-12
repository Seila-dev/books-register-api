import { Request, Response } from 'express';
import BookService from '../../services/book-service';
import { handleError } from '../../errors';

class BookController {
  async create(request: Request, response: Response) {
    try {
      const {
        title,
        description,
        rating,
        startDate,
        finishDate,
        categoryIds,
      } = request.body;

      // Com Cloudinary, a imagem upload já fornece a URL completa
      const coverImage = request.file ? request.file.path : undefined;
      const userId = request.user.id;

      const parsedStartDate = startDate ? new Date(startDate) : undefined;
      const parsedFinishDate = finishDate ? new Date(finishDate) : undefined;
      const parsedRating = rating ? parseInt(rating, 10) : undefined;

      const book = await BookService.createBook({
        title,
        coverImage,
        description,
        rating: parsedRating,
        startDate: parsedStartDate,
        finishDate: parsedFinishDate,
        userId,
        categoryIds: categoryIds ? JSON.parse(categoryIds) : undefined,
      });

      response.status(201).json(book);
    } catch (error) {
      if (error instanceof Error) {
        response.status(400).json({ error: error.message });
      }
      handleError(error as Error, response);
    }
  }

  async index(request: Request, response: Response) {
    try {
      const userId = request.user.id;
      const books = await BookService.getAllBooks(userId);

      response.json(books);
    } catch (error) {
      handleError(error as Error, response);
    }
  }

  async show(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user.id;

      const book = await BookService.getBookById(id, userId);

      response.json(book);
    } catch (error) {
      if (error instanceof Error) {
        response.status(404).json({ error: error.message });
      }
      handleError(error as Error, response);
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const {
        title,
        description,
        rating,
        startDate,
        finishDate,
        categoryIds,
      } = request.body;

      // Com Cloudinary, a imagem upload já fornece a URL completa
      const coverImage = request.file ? request.file.path : undefined;
      const userId = request.user.id;

      const parsedStartDate = startDate === '' 
        ? null 
        : startDate 
          ? new Date(startDate) 
          : undefined;
          
      const parsedFinishDate = finishDate === '' 
        ? null 
        : finishDate 
          ? new Date(finishDate) 
          : undefined;
          
      const parsedRating = rating !== undefined 
        ? parseInt(rating, 10) 
        : undefined;

      const book = await BookService.updateBook({
        id,
        title,
        coverImage,
        description,
        rating: parsedRating,
        startDate: parsedStartDate,
        finishDate: parsedFinishDate,
        userId,
        categoryIds: categoryIds ? JSON.parse(categoryIds) : undefined,
      });

      response.json(book);
    } catch (error) {
      if (error instanceof Error) {
        response.status(400).json({ error: error.message });
      }
      handleError(error as Error, response);
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user.id;

      await BookService.deleteBook(id, userId);

      response.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        response.status(404).json({ error: error.message });
      }
      handleError(error as Error, response);
    }
  }

  async byCategory(request: Request, response: Response) {
    try {
      const { categoryId } = request.params;
      const userId = request.user.id;

      const books = await BookService.getBooksByCategory(categoryId, userId);

      response.json(books);
    } catch (error) {
      handleError(error as Error, response);
    }
  }
}

export default new BookController();