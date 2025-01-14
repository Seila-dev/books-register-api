import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from 'path'

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

// app.use(cors())

app.use(cors({
    origin: ['*', 'https://books-register.vercel.app', 'http://localhost:5173/'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
}));


app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `${__dirname}/public`);
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + ".jpg");
    }
})

const upload = multer({ storage }).single("file");

app.post("/upload", function (req, res) {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).send(err);
        } else if (err) {
            return res.status(500).send(err);
        }

        console.log(req.file?.filename)

        return res.status(200).send({ message: "Upload realizado com sucesso" , imagePath: req.file?.filename })
    })
});

app.get("/products", async (_, res) => {
    const products = await prisma.products.findMany({
        orderBy: {
            title: "asc"
        }
    });
    res.status(200).json(products);
})

app.post("/products", async (req, res): Promise<any> => {
    try {
        const { image, title } = req.body;

        const product = await prisma.products.findFirst({
            where: {
                title: {
                    equals: title,
                    mode: "insensitive"
                }
            }
        });

        if (product) {
            return res.status(409).send({ message: "Já existe um produto com esse nome" })
        }

        const newProduct = await prisma.products.create({
            data: {
                image,
                title
            }
        });

        res.status(200).json(newProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Houve um erro ao tentar criar o produto" });
    }
});

app.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.products.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).send("deletado com sucesso");
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Houve um erro ao tentar deletar o produto" });
    }
});

app.get("/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const detailedProduct = await prisma.products.findUnique({
            where: {
                id: Number(id)
            }
        })
        res.status(200).json(detailedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Houve um erro ao tentar buscar o produto" });
    }
});

app.put("/products/:id", async (req, res): Promise<any> => {
    const { id } = req.params;
    const data = { ...req.body };
    const { stars } = req.body;

    if (stars < 1 || stars > 5) {
        return res.status(400).send({ message: "A classificação deve estar entre 1 a 5 estrelas" });
    }

    try {
        const product = await prisma.products.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!product) {
            return res.status(404).send({ message: "Produto não encontrado" })
        }
        await prisma.products.update({
            where: {
                id: Number(id),
            },
            data
        })
        res.status(200).send({ message: "Atualizado com sucesso" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Houve um erro ao tentar atualizar o produto" });
    }
});

// module.exports.handler = serverless(app);

app.listen(port, () => {
    console.log(`servidor aberto na porta ${port}`);
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
})