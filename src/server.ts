import express from "express";
import path from 'path';
import "dotenv/config"
// import itemsPool from '../DBConfig'
import { app } from "./app";
import productsRoutes from "./routes/products-routes";
import categoriesRoutes from "./routes/categories-routes";

const port = 3000;

const publicPath = path.join(process.cwd(), 'public'); 
app.use('/public', express.static(publicPath));

app.use('/products', productsRoutes)
app.use('/categories', categoriesRoutes)

app.listen(port, () => {
    console.log(`servidor aberto na porta ${port}`);
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
})