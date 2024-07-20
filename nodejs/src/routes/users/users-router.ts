import { Router } from 'express'
import * as usersDB from './users-db'
import { user } from './users-model'
import {
	createUser,
	generateAuthToken,
	getUserByEmail,
	userLogin,
	userLogout,
} from './users-db'
import sessionAuthMiddleware from 'middleware/session-auth'

const router = Router()

//Name of cookie
const COOKIE_NAME = 'auth'

router.use('/me', sessionAuthMiddleware)
router.use('/updateSocials', sessionAuthMiddleware)

/* Middleware for checking id length */
// router.use('/*/:id', (req, res, next) => {
//     const { id } = req.params

//     if(id.length != 24){
//         res.sendStatus(400)
//         return
//     }

//     next()
// })

router.get('/me', async (req, res) => {
	const userId = res.locals.userId

	const user = await usersDB.getUserById(userId)

	res.json(user)
})

//GET USER BY ID
router.get('/:id', async (req, res) => {
	const { id } = req.params

	console.log('getting user id: ', id)
	const user = await usersDB.getUserById(id)

	res.json(user)
})
//DELETE USER BY ID
router.delete('/delete/:id', async (req, res) => {
	const { id } = req.params
})
//LOGIN TO ACCOUNT
router.post('/login', async (req, res) => {
	userLogin(req.body).then(function (result) {
		console.log('sending confirmation: ' + result)
		if (result == 'xxx') {
			res.sendStatus(401)
		} else {
			res.cookie(COOKIE_NAME, result, {
				maxAge: 1000 * 60 * 60 * 24, //24 hours
				secure: true,
			}).sendStatus(201)
		}
	})
})
//LOGOUT OF ACCOUNT
router.post('/logout', async (req, res) => {
	//console.log(req.body)
	const authToken = req.body.authToken
	userLogout(authToken).then(function (result) {
		console.log('sending confirmation: ' + result)
		if (!result) {
			res.sendStatus(401)
		} else {
			res.clearCookie(COOKIE_NAME).sendStatus(201)
		}
	})
})
//Create User
router.post('/create', async (req, res) => {
	const user: user = req.body

	let result = await createUser(req.body)

	if (!result) {
		res.send(400)
		return
	}
	user._id = result.id

	res.cookie(COOKIE_NAME, result.token, {
		maxAge: 1000 * 60 * 60 * 24, //24 hours
		secure: true,
	}).json(user)
})

//check if emailexists
router.post('/accountByEmail', async (req, res) => {
	console.log('email TO SEND: ' + req.body.email)
	getUserByEmail(req.body.email).then((getEmail) => {
		console.log('Email exists? ' + getEmail)
		res.json({ getEmail })
	})
})

router.post('/updateSocials', async (req, res) => {
	const { userId } = res.locals
	const { socials } = req.body

	console.log('updating socials', userId)
	console.log('updating socials', socials)

	usersDB
		.updateUserSocial(userId, socials)
		.then(() => {
			res.sendStatus(200)
		})
		.catch(() => {
			res.sendStatus(400)
		})
})

export default router
