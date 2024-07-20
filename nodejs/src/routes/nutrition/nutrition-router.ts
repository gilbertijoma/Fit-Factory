import { Router } from 'express'
import * as nutritionDB from './nutrition-db'
import { Nutrition } from './nutrition-model'
const router = Router()

router.get('', (request, response)=>{

    //response.send("hi");
});

/* Middleware for checking id length */
router.use('/*/:id', (req, res, next) => {
	const { id } = req.params

	if (id.length != 24) {
		res.sendStatus(400)
		return
	}

	next()
})

router.get('/all', async (req, res) => {
	console.log('Getting all nutrition plans')

	nutritionDB
		.getAllNutritionPlans()
		.then((nutritionPlans) => {
			console.log(nutritionPlans)
			res.json(nutritionPlans)
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
})

router.get('/:id', async (req, res) => {
	const { id } = req.params

	console.log('Getting nutrition plan with id: ', id)

	nutritionDB
		.getNutritionById(id)
		.then((nutrition) => {
			console.log(nutrition)

			if (nutrition) {
				res.json(nutrition)
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

	console.log('Getting nutrition plan with user id: ', id)

	nutritionDB
		.getNutritionByCreatorId(id)
		.then((nutrition) => {
			console.log(nutrition)

			if (nutrition) {
				res.json(nutrition)
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

	console.log('Deleting nutrition plan with id: ', id)

	try {
		const { deletedCount } = await nutritionDB.deleteNutritionById(id)

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
	const nutrition: Nutrition = req.body

	console.log('Updating nutrition plan with id: ', id)

	nutritionDB
		.updateNutritionById(id, nutrition)
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
	const nutrition: Nutrition = req.body

	console.log('Adding nutrition plan: ', nutrition)

	nutritionDB
		.addNutrition(nutrition)
		.then((id) => {
			console.log('Added nutrition id', id)
			res.json({ id: id })
		})
		.catch((err) => {
			console.log(err)

			res.sendStatus(500)
		})
})

export default router
