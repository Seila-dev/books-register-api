import { Request, Response } from "express"
import path from 'path'
import { prisma } from "../../prisma"

export class ProductsController {
    async create(req: Request, res: Response) {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' })
            return
        }
        try {
            const filePath = path.join(req.file.filename)
            const { title } = req.body;

            const product = await prisma.product.create({
                data: {
                    image: filePath,
                    title
                }
            })
            res.status(201).json(product)
        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "Error on creating product" })
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const products = await prisma.product.findMany({
                orderBy: {
                    title: "asc"
                },
                include: {
                    genres: true,
                }
            })
            res.status(200).json(products)
        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "Server Error" })
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            await prisma.product.delete({
                where: {
                    id: Number(id)
                }
            })
            res.status(200).send({ message: "Product deleted" })
        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "Error on delete product" })
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { title, stars, description, startedreading, endedreading, genres } = req.body

            const updateData: any = { title, stars, description, startedreading, endedreading, genres }

            if (req.file) {
                const filePath = path.join(req.file.filename)
                updateData.image = filePath
            }

            await prisma.product.update({
                where: {
                    id: Number(id)
                },
                data: updateData 
            });

            res.status(200).send({ message: "Product updated" })
        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "Error on update product" })
        }
    }

    async findProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await prisma.product.findFirst({
                where: {
                    id: Number(id)
                }
            });
            res.status(200).json(product);
        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "Error on find product" })
        }
    }
    async findCategories(req: Request, res: Response) {
        try {
            const { id } = req.params
            const product = await prisma.product.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    genres: true
                }
            })

            if (!product) {
                res.status(400).send({ message: "Product not found" })
                return
            }

            res.status(200).json(product)
        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "Error on find categories" })
        }
    }
    async addCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { genreId } = req.body;

            const product = await prisma.product.findUnique({
                where: {
                    id: Number(id)
                }
            })
    
            if (!product) {
                res.status(400).send({ message: "Product not found" });
                return
            }
    
            const genre = await prisma.genre.findUnique({
                where: {
                    id: Number(genreId)
                }
            });
    
            if (!genre) {
                res.status(400).send({ message: "Genre not found" });
                return
            }
    
            await prisma.product.update({
                where: {
                    id: Number(id)
                },
                data: {
                    genres: {
                        connect: {
                            id: Number(genreId)
                        }
                    }
                }
            });
    
            res.status(200).send({ message: "Category added to product" });
        } catch (error) {
            console.log(error);
            res.status(400).send({ message: "Error on add category" });
        }
    }
    
}