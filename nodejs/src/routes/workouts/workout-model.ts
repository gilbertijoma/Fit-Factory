import { user as User } from '@routes/users/users-model'
import { ObjectId } from 'mongodb'

export interface Workout {
	_id: ObjectId
	title: string
	description: string
	creatorId: ObjectId | string
	creator?: User
	exercises: Exercise[]
	isBookmarked?: boolean
	thumbnailUrl?: string
}

export interface Bookmark {
	_id?: ObjectId
	userId: ObjectId | string
	workoutId: ObjectId | string
}

export interface Exercise {
	id: number
	title: string
	reps: number
	sets: number
	type: ExerciseType
}

export enum ExerciseType {
	GYM = 'Gym',
	HOME = 'Home',
}

export interface WorkoutComment {
	_id: ObjectId
	workoutId: ObjectId | string
	user: string
	content: string
	createdAt: Date
}
