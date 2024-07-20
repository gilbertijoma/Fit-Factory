import React, { FunctionComponent, useEffect, useState } from 'react'
import FormProgress from 'shared/components/form-progess/FormProgress'
import styles from './NewWorkout.module.css'
import TitleDescForm from './title-desc-form/TitleDescription.Form'
import RoutineForm from './routine-form/Routine.Form'
import { Exercise, Workout } from 'shared/models/workout'
import ThumbnailForm from './thumbnail-form/Thumbnail.Form'
import SummaryForm from './summary-form/Summary.Form'
import { environment } from 'environment/environment'
import { useParams } from 'react-router-dom'
import WorkoutService from '../../../shared/services/WorkoutService'

interface NewWorkoutProps {
	editMode: boolean
}

export interface NewWorkoutForm {
	id?: string
	title: string
	description: string
	exercises: Exercise[]
	thumbnailUrl?: string
}

export interface FormStepProps {
	newWorkoutForm: NewWorkoutForm
	setNewWorkoutForm: React.Dispatch<React.SetStateAction<NewWorkoutForm>>
	currStep: number
	setCurrStep: React.Dispatch<React.SetStateAction<number>>
}

const NewWorkout: FunctionComponent<NewWorkoutProps> = ({ editMode }) => {
	const [newWorkoutForm, setNewWorkoutForm] = useState<NewWorkoutForm>({
		title: '',
		description: '',
		exercises: [],
	})
	const { id } = useParams()

	if (editMode) {
		useEffect(() => {
			WorkoutService.getWorkoutById(id)
				.then((workout: Workout) => {
					setNewWorkoutForm({
						id: workout._id,
						title: workout.title,
						description: workout.description,
						exercises: workout.exercises,
						thumbnailUrl: workout.thumbnailUrl,
					})
				})
				.catch((err) => {
					console.log('error retrieving workout', err)
				})
		}, [])
	}

	const [currStep, setCurrStep] = useState(1)

	const formSteps = ['General Information', 'Workout Routine', 'Thumbnail', 'Finish']

	/**
	 * Will return the appropriate form component given the provided step
	 * @param step Current Step
	 * @returns The appropriate form that corresponds to the step parameter
	 */
	const getCurrentStepForm = (step: number) => {
		const props: FormStepProps = {
			newWorkoutForm,
			setNewWorkoutForm,
			currStep,
			setCurrStep,
		}

		switch (step) {
			case 1:
				return <TitleDescForm {...props} />
			case 2:
				return <RoutineForm {...props} />
			case 3:
				return <ThumbnailForm {...props} />
			case 4:
				return <SummaryForm {...props} editMode={editMode} />
		}
	}

	const completedSteps = new Array(currStep - 1).fill(0).map((_, idx) => idx + 1)

	return (
		<div className={styles['container']}>
			<div id={styles['progress']}>
				<FormProgress
					steps={formSteps}
					currentStep={currStep}
					completed={completedSteps}
					onStepClicked={(e) => setCurrStep(e)}
				/>
			</div>
			{getCurrentStepForm(currStep)}
		</div>
	)
}

export default NewWorkout
