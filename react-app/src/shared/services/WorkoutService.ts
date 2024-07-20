import { environment } from 'environment/environment'
import { Workout, WorkoutComment } from 'shared/models/workout'
import { NewWorkoutForm } from '../../views/workouts/workouts-new/NewWorkout'

const { baseUrl } = environment

const WorkoutService = {
	async getWorkoutByCreatorId(id: string | undefined): Promise<Workout[]> {
		const res = await fetch(baseUrl + `/workouts/creator/${id}`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
		return await res.json()
	},

	async getAllWorkouts(): Promise<Workout[]> {
		return fetch(baseUrl + '/workouts/all', { credentials: 'include' }).then((res) => res.json())
	},

	async getWorkoutById(id: string | undefined): Promise<Workout> {
		return fetch(baseUrl + `/workouts/${id}`, {
			credentials: 'include',
		}).then((res) => res.json())
	},

	async getWorkoutByUserId(id: string | undefined): Promise<Workout> {
		return fetch(baseUrl + `/workouts/bookmarks/${id}`, {
			credentials: 'include',
		}).then((res) => res.json())
	},

	async addWorkout(newWorkoutForm: NewWorkoutForm): Promise<Response> {
		return fetch(baseUrl + '/workouts/add', {
			method: 'POST',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newWorkoutForm),
		})
	},

	async updateWorkout(newWorkoutForm: NewWorkoutForm): Promise<Response> {
		return fetch(baseUrl + '/workouts/update/' + newWorkoutForm.id, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newWorkoutForm),
		})
	},

	async getComments(id?: string): Promise<WorkoutComment[]> {
		const res = await fetch(baseUrl + `/workouts/${id}/comments`, {
			credentials: 'include',
		})
		return await res.json()
	},

	async postNewComment(comment: WorkoutComment): Promise<{ id: string }> {
		const res = await fetch(baseUrl + `/workouts/${comment.workoutId}/addComment`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(comment),
		})
		return await res.json()
	},

	async bookmarkWorkout(id: string): Promise<Response> {
		return await fetch(baseUrl + `/workouts/${id}`, {
			credentials: 'include',
			method: 'POST',
		})
	},

	async removeWorkoutBookmark(id: string): Promise<Response> {
		return await fetch(baseUrl + `/workouts/${id}`, {
			credentials: 'include',
			method: 'DELETE',
		})
	},
}

export default WorkoutService
