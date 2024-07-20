import { Router } from 'express'
import * as workoutDB from './workout-db'
import { Bookmark, Workout, WorkoutComment } from './workout-model'
import sessionAuthMiddleware from 'middleware/session-auth'
import { ObjectId } from 'mongodb'

const router = Router()

router.use('*', sessionAuthMiddleware)

/* Middleware for checking id length */
/* router.use('/*/ /*', (req, res, next) => {
    const { id } = req.params

    if(id.length != 24){
        console.log('Id length not 24');
        
        res.sendStatus(400)
        return
    }

    next()
}) */

router.get('/all', async (req, res) => {
	console.log('Getting all workouts')

	workoutDB
		.getAllWorkouts(res.locals.userId)
		.then((workouts) => {
			console.log('All workouts', workouts)

			res.json(workouts)
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
})

router.get('/:id', async (req, res) => {
	const { id } = req.params

	console.log('Getting workout with id: ', id)

	workoutDB
		.getWorkoutById(res.locals.userId, id)
		.then((workout) => {
			if (workout) {
				res.json(workout)
			} else {
				res.sendStatus(404)
			}
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
})

router.get('/creator/:id', async (req, res) => {
	const { id } = req.params

	console.log('Getting workout with user id: ', id)

	workoutDB
		.getWorkoutsByCreatorId(res.locals.userId, id)
		.then((workouts) => {
			console.log(workouts)

			if (workouts) {
				res.json(workouts)
			} else {
				res.sendStatus(404)
			}
		})
		.catch((err) => {
			console.log(err)

			res.sendStatus(500)
		})
})

router.delete('/delete/:id', async (req, res) => {
	const { id } = req.params

	console.log('Deleting workout with id: ', id)

	try {
		const { deletedCount } = await workoutDB.deleteWorkoutById(id)

		if (deletedCount == 0) {
			res.sendStatus(401)
			return
		}

		res.sendStatus(204)
	} catch (err) {
		console.log(err)

		res.sendStatus(500)
	}
})

router.put('/update/:id', async (req, res) => {
	const { id } = req.params
	const workout: Workout = req.body

	console.log('Updating workout with id: ', id)

	workoutDB
		.updateWorkoutById(id, workout)
		.then((result) => {
			console.log(result)

			if (!result.ok) {
				res.sendStatus(404)
				return
			}

			res.sendStatus(204)
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
})

router.post('/add', async (req, res) => {
	const workout: Workout = req.body
	workout.creatorId = res.locals.userId

	console.log('Adding workout: ', workout)

	workoutDB
		.addWorkout(workout)
		.then((id) => {
			console.log('Added workout id', id)
			res.json({ id })
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
})

router.post('/:workoutId', async (req, res) => {
	const { workoutId } = req.params
	const { userId } = res.locals

	const bookmark: Bookmark = {
		userId: new ObjectId(userId),
		workoutId: new ObjectId(workoutId),
	}

	console.log('Adding new bookmark: ', bookmark)

	workoutDB
		.bookmarkWorkout(bookmark)
		.then((id) => {
			console.log('Added bookmark with id', id)

			res.sendStatus(204)
		})
		.catch((err) => {
			console.log(err)

			res.sendStatus(500)
		})
})

router.delete('/:workoutId', async (req, res) => {
	const { workoutId } = req.params
	const { userId } = res.locals

	const bookmark: Bookmark = {
		userId: new ObjectId(userId),
		workoutId: new ObjectId(workoutId),
	}

	console.log('Removing bookmark: ', bookmark)

	workoutDB
		.deleteBookmark(bookmark)
		.then(() => {
			console.log('Deleted bookmark')
			res.sendStatus(204)
		})
		.catch((err) => {
			console.log(err)

			res.sendStatus(500)
		})
})

router.get('/:workoutId/comments', async (req, res) => {
	const { workoutId } = req.params
	console.log('Getting comments for workout', workoutId)

	workoutDB
		.getWorkoutComments(workoutId)
		.then((comments) => {
			res.json(comments)
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(400)
		})
})

router.post('/:workoutId/addComment', async (req, res) => {
	const { workoutId } = req.params

	const comment: WorkoutComment = req.body
	comment.workoutId = workoutId

	console.log('Adding comment: ', comment)

	workoutDB
		.addWorkoutComment(comment)
		.then((id) => {
			res.json({ id })
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(400)
		})
})

export default router
