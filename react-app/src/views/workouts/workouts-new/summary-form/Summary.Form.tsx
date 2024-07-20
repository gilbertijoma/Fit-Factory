import { FunctionComponent } from 'react'
import { FormStepProps, NewWorkoutForm } from '../NewWorkout'
import defaults from '../NewWorkout.module.css'
import styles from './Summary.module.css'
import { ArrowLeftIcon, UploadIcon } from '@radix-ui/react-icons'
import { environment } from 'environment/environment'
import { Edit } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import WorkoutService from 'shared/services/WorkoutService'

export interface SummaryFormProps extends FormStepProps {
	editMode: boolean
}

const SummaryForm: FunctionComponent<SummaryFormProps> = ({ newWorkoutForm, currStep, setCurrStep, editMode }) => {
	const { title, description, exercises, thumbnailUrl } = newWorkoutForm
	const navigate = useNavigate()

	const publishWorkout = () => {
		if (editMode) {
			WorkoutService.updateWorkout(newWorkoutForm)
				.then((res) => {
					if (res.ok) {
						navigate('/workouts')
					}
				})
				.catch((err) => {
					console.log(err)
				})

			return
		}

		WorkoutService.addWorkout(newWorkoutForm)
			.then((res) => {
				if (res.ok) {
					navigate('/workouts')
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return (
		<div className={defaults['form'] + ' ' + styles['summary-form']}>
			<div className={defaults['header']}>
				<p className={defaults['title']}>One Last Thing.</p>
				<p className='subtitle'>
					This is your chance to review your workout and verify that everything is in order. <br /> Once you
					click the upload button, this workout will go live for any member to access.
				</p>
			</div>

			<div className={defaults['section'] + ' ' + styles['section']}>
				<div className={styles['info']}>
					<p className='subtitle'>Thumbnail:</p>
					{thumbnailUrl ? <img src={thumbnailUrl} id={styles['img']} /> : 'No Thumbnail Uploaded.'}
				</div>
			</div>

			<div className={defaults['section'] + ' ' + styles['section']}>
				<div className={styles['info']}>
					<p className='subtitle'>Title:</p>
					<p>{title}</p>
				</div>
				<div className={styles['info']} id={styles['description']}>
					<p className='subtitle'>Description:</p>
					<textarea defaultValue={description} readOnly rows={5} cols={5}></textarea>
				</div>
			</div>

			<div className={defaults['section'] + ' ' + styles['section']} id={styles['exercises']}>
				<div className={styles['info']}>
					<p className='subtitle'>Exercises ({exercises.length}):</p>
					<ul>
						{exercises.map(({ sets, reps, title }, idx) => (
							<li className={styles['routine']} key={idx}>
								<p className={styles['ex-title']}>{title}</p>
								<p className={styles['ex-sets']}>
									<b>sets:</b> {sets}
								</p>
								<p className={styles['ex-reps']}>
									<b>reps:</b> {reps}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className={defaults['actions']}>
				<button className='btn-secondary' onClick={() => setCurrStep(currStep - 1)}>
					<ArrowLeftIcon />
					Back
				</button>
				<button className='btn-primary' id={styles['publish']} onClick={publishWorkout}>
					{editMode ? 'Submit Changes' : 'Publish'}
					<UploadIcon />
				</button>
			</div>
		</div>
	)
}

export default SummaryForm
