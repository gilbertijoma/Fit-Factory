import { Router } from 'express'
import sessionAuthMiddleware from 'middleware/session-auth'
import * as creatorDB from './creator-db'

const router = Router()

router.use('*', sessionAuthMiddleware)

router.get('/all', async (req, res) => {
	console.log('Getting all creators')

	creatorDB
		.getAllCreators()
		.then((creators) => {
			res.json(creators)
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
})

export default router
