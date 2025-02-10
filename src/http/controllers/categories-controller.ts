import { Request, Response } from 'express'
import { prisma } from '../../prisma'

export class CategoriesController {
    async create(req: Request, res: Response) {
        try {
            const { name } = req.body
            
            const categoryAlreadyExist = await prisma.categories.findUnique({
                where: { name }
            })
            

            if(categoryAlreadyExist) {
                res.status(400).json({ message: "Category already exist" })
                return
            }

            const category = await prisma.categories.create({
                data: {
                    name
                }
            })


            res.status(201).json(category)
        } catch (error) {
            res.status(400).send({ message: "Error on creating category" })
            console.log(error)
        }
    }
    async findAll(req: Request, res: Response) {
        try {
            const categories = await prisma.categories.findMany({
                orderBy: {
                    name: "asc"
                }
            })
            res.status(200).json(categories)
        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "Server Error" })
        }
    }
    
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            await prisma.categories.delete({
                where: {
                    id: Number(id)
                }
            })
            res.status(200).send({ message: "Category deleted" })
        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "Error on delete category" })
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { name } = req.body
            const categoryAlreadyExist = await prisma.categories.findFirst({
                where: { 
                    name: {
                        equals: name,
                        mode: "insensitive"
                    }
                 }
            })

            if(categoryAlreadyExist) {
                res.status(400).json({ message: "Category already exist" })
                return
            }

            const category = await prisma.categories.update({
                where: {
                    id: Number(id)
                },
                data: {
                    name
                }
            })
            res.status(200).json(category)
        } catch (error) {
            console.log(error)
            res.status(400).send({ message: "Error on update category" })
        }
    }
}