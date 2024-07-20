import { Workout } from 'shared/models/workout'

export interface Filter {
	name: string
	filterFn(workout: Workout): boolean
	displayValue: string
}
