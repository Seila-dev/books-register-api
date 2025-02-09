import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";

export const app = express()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
}));

app.use(bodyParser.json());

app.use(express.json());