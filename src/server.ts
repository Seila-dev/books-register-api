import express from "express";
import path from 'path';
import "dotenv/config"
// import itemsPool from '../DBConfig'
import { app } from "./app";
import productsRoutes from "./routes/products-routes";

const port = 3000;

const publicPath = path.join(process.cwd(), 'uploads'); 
app.use('/uploads', express.static(publicPath));

app.use('/products', productsRoutes)

app.listen(port, () => {
    console.log(`servidor aberto na porta ${port}`);
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
})