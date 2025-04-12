import express from "express";
import path from 'path';
import "dotenv/config"
import { app } from "./app";

const port = 3000;

const publicPath = path.join(process.cwd(), 'public'); 
app.use('/public', express.static(publicPath));

app.listen(port, () => {
    console.log(`servidor aberto na porta ${port}`);
})