import { DeleteResult, ObjectId, UpdateResult, Document } from 'mongodb'
import client from 'mongodb/client'
import { Bookmark, Workout, WorkoutComment } from './workout-model'

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
	{
		$project: {
			creator: {
				password: 0,
			},
		},
	},
]

const mapFn = (workout: any, bookmarks: Bookmark[]): Workout => {
	workout.isBookmarked = bookmarks.some(
		(b) => b.workoutId.toString() === workout._id.toString()
	)
	workout.creator = workout.creator[0]
	return workout
}

const getAggregate = async (
	pipeline: any[],
	userId: string
): Promise<Workout[]> => {
	const workouts = db.collection<Workout>('workout')
	const bookmarks = await db
		.collection<Bookmark>('workoutBookmark')
		.find({ userId: new ObjectId(userId) })
		.toArray()

	return await workouts
		.aggregate<Workout>(pipeline)
		.map((workout) => mapFn(workout, bookmarks))
		.toArray()
}

export async function getAllWorkouts(userId: string): Promise<Workout[]> {
	const aggregate = await getAggregate(pipeline, userId)
	return aggregate
}

export async function getWorkoutById(
	userId: string,
	id: string | ObjectId
): Promise<Workout | null> {
	const aggregate = await getAggregate(
		[...pipeline, { $match: { _id: new ObjectId(id) } }],
		userId
	)
	return aggregate.length ? aggregate[0] : null
}

export async function getWorkoutsByCreatorId(
	userId: string,
	creatorId: string
): Promise<Workout[]> {
	const aggregate = await getAggregate(
		[...pipeline, { $match: { userId: new ObjectId(creatorId) } }],
		userId
	)
	return aggregate
}

export async function addWorkout(workout: Workout): Promise<ObjectId> {
	const workouts = db.collection<Workout>('workout')

	const { insertedId } = await workouts.insertOne({ ...workout })

	return insertedId
}

export async function updateWorkoutById(
	id: string | ObjectId,
	workout: Workout
): Promise<Document> {
	const workouts = db.collection<Workout>('workout')

	return await workouts.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{
			$set: {
				title: workout.title,
				description: workout.description,
				exercises: workout.exercises,
				thumbnailUrl: workout.thumbnailUrl,
			},
		}
	)
}

export async function deleteWorkoutById(
	id: string | ObjectId
): Promise<DeleteResult> {
	const workouts = db.collection<Workout>('workout')

	return await workouts.deleteOne({
		_id: new ObjectId(id),
	})
}

export async function bookmarkWorkout(bookmark: Bookmark): Promise<ObjectId> {
	const bookmarks = db.collection<Bookmark>('workoutBookmark')

	const { insertedId } = await bookmarks.insertOne({ ...bookmark })

	return insertedId
}

export async function deleteBookmark(
	bookmark: Bookmark
): Promise<DeleteResult> {
	const bookmarks = db.collection<Bookmark>('workoutBookmark')

	return await bookmarks.deleteOne({ ...bookmark })
}

export async function getWorkoutComments(
	id: ObjectId | string
): Promise<Comment[]> {
	const comments = db.collection<Comment>('workoutComment')

	return await comments
		.aggregate<Comment>([{ $match: { workoutId: id } }])
		.toArray()
}

export async function addWorkoutComment(
	comment: WorkoutComment
): Promise<ObjectId> {
	const comments = db.collection<WorkoutComment>('workoutComment')

	const { insertedId } = await comments.insertOne({ ...comment })
	return insertedId
}
