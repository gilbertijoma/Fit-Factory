import { DeleteResult, ObjectId, UpdateResult, Document } from 'mongodb'
import client from 'mongodb/client'
import { Nutrition } from './nutrition-model'
const db = client.db()

//Pipeline for joins
const pipeline = [
	{ $addFields: { userId: { $toObjectId: '$creatorId' } } },
	{
		$lookup: {
			from: 'users',
			localField: 'userId',
			foreignField: '_id',
			as: 'creator',
		},
	},
]
//Mapping function for nutrition plans
const mapFn = (nutrition: Nutrition) => {
    const theCreator = nutrition.creator[0];
    
    // Check if theCreator is defined before trying to access its properties
    let creator;
    if (theCreator) {
        creator = {
            _id: theCreator._id,
            email: theCreator.email,
            fname: theCreator.fname,
            lname: theCreator.lname,
        }
    }
    
    return {
        _id: nutrition._id,
        title: nutrition.title,
        description: nutrition.description,
        food: nutrition.food,
        calories: nutrition.calories,
        sugar: nutrition.sugar,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        imageURL: nutrition.imageURL,
        servings: nutrition.servings,
        creator: creator, // This will be either an object with creator info or undefined
    } as Nutrition;
}


const getAggregate = async (pipeline: any[]): Promise<Nutrition[]> => {
	const nutritionPlans = db.collection<Nutrition>('nutrition')
	return await nutritionPlans
		.aggregate<Nutrition>(pipeline)
		.map(mapFn)
		.toArray()
}

export async function getAllNutritionPlans(): Promise<Nutrition[]> {
	const aggregate = await getAggregate(pipeline)
	return aggregate
}

export async function getNutritionById(
	id: string | ObjectId
): Promise<Nutrition | null> {
	const aggregate = await getAggregate([
		...pipeline,
		{ $match: { _id: new ObjectId(id) } },
	])
	return aggregate.length ? aggregate[0] : null
}

export async function getNutritionByCreatorId(
	userId: string
): Promise<Nutrition[]> {
	const aggregate = await getAggregate([
		...pipeline,
		{ $match: { userId: new ObjectId(userId) } },
	])
	return aggregate
}

export async function addNutrition(nutrition: Nutrition): Promise<ObjectId> {
	const nutritionPlans = db.collection<Nutrition>('nutrition')

	const { insertedId } = await nutritionPlans.insertOne({ ...nutrition })

	return insertedId
}

export async function updateNutritionById(
	id: string | ObjectId,
	nutrition: Nutrition
): Promise<Document> {
	const nutritionPlans = db.collection<Nutrition>('nutrition')

	return await nutritionPlans.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{
			$set: {
				title: nutrition.title,
				description: nutrition.description,
				food: nutrition.food,
				calories: nutrition.calories,
				sugar: nutrition.sugar,
				protein: nutrition.protein,
				carbs: nutrition.carbs,
				fat: nutrition.fat,
				imageURL: nutrition.imageURL,
				servings: nutrition.servings,
			},
		}
	)
}

export async function deleteNutritionById(
	id: string | ObjectId
): Promise<DeleteResult> {
	const nutritionPlans = db.collection<Nutrition>('nutrition')

	return await nutritionPlans.deleteOne({
		_id: new ObjectId(id),
	})
}
