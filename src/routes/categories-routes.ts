import { CategoriesController } from "../http/controllers/categories-controller"
import { Router } from 'express'

const categoriesRoutes = Router()

categoriesRoutes.post("/", new CategoriesController().create)
categoriesRoutes.get("/", new CategoriesController().findAll)
categoriesRoutes.delete("/:id", new CategoriesController().delete)
categoriesRoutes.put("/:id", new CategoriesController().update);

export default categoriesRoutes