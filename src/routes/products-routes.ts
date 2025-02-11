import { ProductsController } from "../http/controllers/products-controller"
import { Router } from 'express'
import multer from 'multer'

const productsRoutes = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage })

productsRoutes.post("/", upload.single('file'), new ProductsController().create)
productsRoutes.get("/", new ProductsController().findAll)
productsRoutes.get("/:id", new ProductsController().findProduct)
productsRoutes.delete("/:id", new ProductsController().delete)
productsRoutes.put("/:id", upload.single('file'), (req, res) => {
    new ProductsController().update(req, res);
})

export default productsRoutes;