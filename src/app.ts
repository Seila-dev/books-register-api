import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import googleAuthRouter from './routes/google-auth-routes'

export const app = express()

app.use(cors())

app.use(express.json());
app.use(googleAuthRouter)