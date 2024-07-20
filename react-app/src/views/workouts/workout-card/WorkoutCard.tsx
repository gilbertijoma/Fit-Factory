import { FunctionComponent, useContext, useState } from 'react'
import styles from './WorkoutCard.module.css'
import { Workout } from 'shared/models/workout'
import { BookmarkFilledIcon, BookmarkIcon } from '@radix-ui/react-icons'
import { NavLink } from 'react-router-dom'
import { UserContext } from 'App'
import WorkoutService from '../../../shared/services/WorkoutService'

interface WorkoutCardProps {
	workout: Workout
}

const WorkoutCard: FunctionComponent<WorkoutCardProps> = (props) => {
	const [workout, setWorkout] = useState({ ...props.workout })
	const { creator, title, isBookmarked, _id } = workout

	const userContext = useContext(UserContext)
	const user = userContext?.user

	const bookmark = () => {
		const promise = workout.isBookmarked
			? WorkoutService.removeWorkoutBookmark(_id!)
			: WorkoutService.bookmarkWorkout(_id!)

		promise.then((res) => {
			if (res.ok) {
				setWorkout((prev) => {
					return {
						...prev!,
						isBookmarked: !prev?.isBookmarked,
					}
				})
			}
		})
	}

	return (
		<div className={styles['workout']}>
			<div className={styles['thumbnail']}>
				<img src={workout.thumbnailUrl} alt='thumbnail' />
				{user?.type === 'regular' && (
					<button className={styles['bookmark']} onClick={bookmark}>
						{isBookmarked ? <BookmarkFilledIcon /> : <BookmarkIcon />}
					</button>
				)}
			</div>
			<div className={styles['body']}>
				<div className={styles['header']}>
					<NavLink to={'/workouts/' + workout._id}>
						<h1 className={styles['title']}>{title}</h1>
					</NavLink>
				</div>
				<NavLink to={'/creators/' + creator._id} className={styles['creator']}>
					{creator.fname + ' ' + creator.lname}
				</NavLink>
			</div>
		</div>
	)
}

export default WorkoutCard
