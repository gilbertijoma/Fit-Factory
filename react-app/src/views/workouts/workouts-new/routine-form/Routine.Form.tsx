import { ArrowLeftIcon, ArrowRightIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { ChangeEvent, FunctionComponent, useState } from 'react'
import { FormStepProps } from '../NewWorkout'
import defaults from '../NewWorkout.module.css'
import styles from './Routine.module.css'
import { Exercise, ExerciseType } from 'shared/models/workout'

interface ExerciseItem extends FormStepProps {
	exercise: Exercise
}

const RoutineForm: FunctionComponent<FormStepProps> = (props) => {
	const { setCurrStep, currStep, newWorkoutForm, setNewWorkoutForm } = props
	const { exercises } = newWorkoutForm

	const newExercise = () => {
		const ex: Exercise = {
			id: exercises.reduce((id, s) => Math.max(id, s.id), 0) + 1,
			title: 'New Exercise',
			reps: 0,
			sets: 0,
			type: ExerciseType.HOME,
		}

		setNewWorkoutForm((prev) => {
			return { ...prev, exercises: prev.exercises.concat(ex) }
		})
	}

	return (
		<div className={defaults['form']} id={styles['routine-form']}>
			<div className={defaults['header']}>
				<p className={defaults['title']}>Daily Exercises.</p>
				<p className='subtitle'>Let's add some daily exercises that members can do at home or at the gym.</p>
			</div>
			<div className={defaults['section']} id={styles['exercises']}>
				<h2>At least one exercise is required.</h2>
				<button className='btn-primary' onClick={newExercise}>
					Add Exercise
				</button>
			</div>
			<hr />
			{exercises.length === 0 ? (
				'Add an Exercise to get started.'
			) : (
				<ul className={styles['routines']}>
					{exercises.map((e, idx) => (
						<RoutineListItem {...props} key={idx} exercise={e} />
					))}
				</ul>
			)}

			<div className={defaults['actions']}>
				<button className='btn-secondary' onClick={() => setCurrStep(currStep - 1)}>
					<ArrowLeftIcon />
					Back
				</button>
				<button
					className='btn-primary'
					disabled={exercises.length < 1}
					onClick={() => setCurrStep(currStep + 1)}>
					Next
					<ArrowRightIcon />
				</button>
			</div>
		</div>
	)
}

const RoutineListItem: FunctionComponent<ExerciseItem> = (props) => {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const { title, sets, reps } = props.exercise
	return (
		<li className={styles['routine'] + ' ' + (isCollapsed ? styles['collapsed'] : '')}>
			<div className={styles['routine-header']}>
				<p className={styles['ex-title']}>{title}</p>
				<p className={styles['ex-sets']}>
					<b>sets:</b> {sets}
				</p>
				<p className={styles['ex-reps']}>
					<b>reps:</b> {reps}
				</p>
				<ChevronUpIcon onClick={() => setIsCollapsed(!isCollapsed)} />
			</div>
			<NewExercise {...props} />
		</li>
	)
}

const NewExercise: FunctionComponent<ExerciseItem> = ({ exercise, setNewWorkoutForm }) => {
	const [showConfirmation, setShowConfirmation] = useState(false)

	const isGymWorkout = exercise.type === ExerciseType.GYM
	const isHomeWorkout = exercise.type === ExerciseType.HOME

	const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const data = exercise as { [key: string]: any }

		//Radio buttons
		if (ev.target.type === 'radio') {
			ev.target.name = ev.target.name.split('_')[0]
		}

		data[ev.target.name] = ev.target.value

		setNewWorkoutForm((prev) => {
			let exercises = [...prev.exercises]

			const idx = exercises.findIndex((e) => e.id === exercise.id)
			exercises[idx] = { ...exercise, ...data }

			return { ...prev, exercises }
		})
	}

	const removeExercise = () => {
		setNewWorkoutForm((prev) => {
			const exercises = prev.exercises.filter((e) => e.id !== exercise.id)
			return { ...prev, exercises }
		})

		setShowConfirmation(false)
	}

	const confirmation = (
		<div className={styles['confirm-remove']}>
			<p>Are you sure?</p>
			<button
				type='button'
				className={styles['cancel'] + ' btn-secondary'}
				onClick={() => setShowConfirmation(false)}>
				No, Cancel
			</button>
			<button type='button' className={styles['remove'] + ' btn-secondary'} onClick={removeExercise}>
				Yes, Remove
			</button>
		</div>
	)

	const removeBtn = (
		<button
			className={styles['remove-btn'] + ' btn-secondary'}
			type='button'
			onClick={() => setShowConfirmation(true)}>
			Remove
		</button>
	)

	return (
		<form className={defaults['form'] + ' ' + styles['new-exercise']}>
			<div className={defaults['section']}>
				<label htmlFor='title'>Title</label>
				<input
					required
					type='text'
					name='title'
					id='title'
					placeholder='e.g, 3 Sets of Squats'
					value={exercise.title}
					onChange={handleChange}
				/>
			</div>

			<div id={styles['rep-set-count']}>
				<div className={defaults['section']}>
					<label htmlFor='reps'>Rep Count</label>
					<input
						required
						type='number'
						name='reps'
						id='reps'
						value={exercise.reps}
						min='0'
						onChange={handleChange}
					/>
				</div>
				<div className={defaults['section']}>
					<label htmlFor='sets'>Set Count</label>
					<input
						required
						type='number'
						name='sets'
						id='sets'
						value={exercise.sets}
						min='0'
						onChange={handleChange}
					/>
				</div>
			</div>

			<div className={defaults['section']} id={styles['ex-type']}>
				<label htmlFor='ex-title'>Exercise Type</label>
				<label
					htmlFor={`at-gym_${exercise.id}`}
					className={styles['exercise-type'] + ' ' + (isGymWorkout ? styles['active'] : '')}>
					Gym
					<input
						type='radio'
						name={`type_${exercise.id}`}
						id={`at-gym_${exercise.id}`}
						hidden
						value={ExerciseType.GYM}
						checked={isGymWorkout}
						onChange={handleChange}
					/>
				</label>

				<label
					htmlFor={`at-home_${exercise.id}`}
					className={styles['exercise-type'] + ' ' + (isHomeWorkout ? styles['active'] : '')}>
					Home
					<input
						type='radio'
						name={`type_${exercise.id}`}
						id={`at-home_${exercise.id}`}
						hidden
						value={ExerciseType.HOME}
						checked={isHomeWorkout}
						onChange={handleChange}
					/>
				</label>
			</div>

			<div className={defaults['section']} id={styles['remove']}>
				{showConfirmation ? confirmation : removeBtn}
			</div>
		</form>
	)
}

export default RoutineForm
