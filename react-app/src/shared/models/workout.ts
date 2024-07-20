import { User } from './user'

export interface Workout {
	_id?: string
	title: string
	description: string
	creator: User
	exercises: Exercise[]
	isBookmarked?: boolean
	thumbnailUrl?: string
	rating?: number
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
	_id?: string
	workoutId: string
	user: string
	content: string
	createdAt: string
}
