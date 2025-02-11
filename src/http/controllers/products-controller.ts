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
        // const data = req.body
        // res.status(200).json(data)
        try {
            const productsContainer = await prisma.product.findMany({
                orderBy: {
                    title: 'desc'
                },
                include: {
                    genres: true
                }
            });
            res.status(200).json(productsContainer);
        } catch (error) {
            console.log(error);
            res.status(400).send({ message: "Server Error" });
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
            const { id } = req.params;
    
            const product = await prisma.product.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    genres: true  // Inclui todos os gêneros associados ao produto
                }
            });
    
            if (!product) {
                res.status(400).send({ message: "Produto não encontrado" });
                return;
            }
    
            res.status(200).json(product.genres);  // Retorna todos os gêneros do produto
        } catch (error) {
            console.log(error);
            res.status(400).send({ message: "Erro ao buscar gêneros" });
        }
    }
    
    async addCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;  // ID do produto
            const { names } = req.body;  // Lista de nomes de gêneros a serem adicionados ao produto
    
            // Verifica se o produto existe
            const product = await prisma.product.findUnique({
                where: {
                    id: Number(id)
                }
            });
    
            if (!product) {
                res.status(400).send({ message: "Produto não encontrado" });
                return;
            }
    
            // Criar ou conectar os gêneros
            const genresToConnect = await Promise.all(
                names.map(async (name: string) => {
                    let genre = await prisma.genre.findFirst({
                        where: { name: name }
                    });
    
                    if (!genre) {
                        genre = await prisma.genre.create({
                            data: { name: name }
                        });
                    }
    
                    return genre;
                })
            );
    
            // Conectar os gêneros ao produto
            await prisma.product.update({
                where: { id: Number(id) },
                data: {
                    genres: {
                        connect: genresToConnect.map(genre => ({ id: genre.id }))
                    }
                }
            });
    
            res.status(200).send({ message: "Gêneros adicionados ao produto", genres: genresToConnect });
        } catch (error) {
            console.log(error);
            res.status(400).send({ message: "Erro ao adicionar gêneros" });
        }
    }
    
    
    
}