import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'

import workoutRouter from '@routes/workouts/workout-router'
import usersRouter from '@routes/users/users-router'
import creatorRouter from '@routes/creators/creator-router'
import nutritionRouter from '@routes/nutrition/nutrition-router'
dotenv.config({ path: './env' })

const app: Express = express()
const port = process.env.PORT || 5000

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use(cookieParser())
app.use(express.json())

app.use('/api/creators', creatorRouter)
app.use('/api/workouts', workoutRouter)
app.use('/api/nutrition', nutritionRouter)
app.use('/api/users', usersRouter)

//Health check
/* app.get('/', (req, res) => {
	res.send('Server is up!')
}) */

const REACT_PATH = '../dist';

app.use(express.static(path.resolve(__dirname, REACT_PATH)));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, REACT_PATH, 'index.html'));
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
