import { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Workout } from 'shared/models/workout'
import styles from './Dashboard.module.css'
import Spinner from 'shared/components/Spinner/Spinner'
import { getClassNames } from 'shared/utils/utils'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import CoachIllustration from 'assets/illustrations/Coach'
import { NavLink } from 'react-router-dom'
import WorkoutsList from 'views/workouts/workouts-list/WorkoutsList'
import { UserContext } from 'App'
import WorkoutService from 'shared/services/WorkoutService'

const Dashboard: FunctionComponent = () => {
	const userContext = useContext(UserContext)
	const [workouts, setWorkouts] = useState<Workout[]>([])
	const [loading, setloading] = useState(true)
	const [isError, setIsError] = useState(false)

	useEffect(() => {
		WorkoutService.getAllWorkouts()
			.then((workouts: Workout[]) => setWorkouts(workouts))
			.catch(() => setIsError(true))
			.finally(() => setloading(false))
	}, [])

	const sectionStyles = getClassNames({
		section: styles['section'],
		loading: loading ? styles['loading'] : ' ',
		error: isError ? styles['error'] : '',
	})

	const callToAction = (
		<div id={styles['cta']}>
			<CoachIllustration className={styles['illustration']} />
			<h2></h2>
			<p className='subtitle'>
				Everyone's fitness journey starts from somewhere.
				<br />
				Help your fellow members get started on theirs.
			</p>
			<NavLink to='/workouts/new' className='btn-secondary' id={styles['get-started']}>
				Create A New Workout Plan
				<ArrowRightIcon />
			</NavLink>
		</div>
	)

	const analytics = (
		<div className={sectionStyles + ' card'}>
			<h2 className={styles['title']}>Your Analytics</h2>
			<p className='subtitle'>Here are your stats over the past few days.</p>
			<p>Nothing to Show.</p>
		</div>
	)

	const mainContent = (
		<>
			{loading && !isError && <Spinner message='Loading Workouts...' />}
			{!loading && !isError && <WorkoutsList workouts={workouts} />}
			{isError && (
				<p id={styles['err-msg']}>
					😧 Uh-Oh! Looks like there was an error on the server.
					<br />
					Please wait a few moments before trying again.
				</p>
			)}
		</>
	)

	const user = userContext?.user

	return (
		<div className={styles['container'] + ' ' + styles[user?.type!]}>
			{user?.type === 'trainer' && callToAction}

			{user?.type === 'trainer' && analytics}

			<main className={styles['main'] + ' card'}>
				<div className={sectionStyles} id={styles['workouts']}>
					<p className={styles['title']}>Recommended Workouts</p>
					<p className={'subtitle'}>Based on your recent activity, we think you'll enjoy these workouts.</p>
					{mainContent}
				</div>
			</main>
		</div>
	)
}

export default Dashboard
