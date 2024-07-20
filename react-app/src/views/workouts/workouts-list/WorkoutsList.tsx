import { FunctionComponent, useState } from 'react'
import { Workout } from 'shared/models/workout'
import styles from './WorkoutsList.module.css'
import { BookmarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { getClassNames } from 'shared/utils/utils'
import { NavLink } from 'react-router-dom'
import WorkoutCard from '../workout-card/WorkoutCard'

interface WorkoutsListProps {
	workouts: Workout[]
}

const paginate = (workouts: Workout[], pageSize: number) => {
	const pages: Workout[][] = []

	for (let i = 0; i < workouts.length; i += pageSize) {
		const page = workouts.slice(i, i + pageSize)
		pages.push(page)
	}

	return pages
}

const WorkoutsList: FunctionComponent<WorkoutsListProps> = (props) => {
	const { workouts } = props

	if (!workouts.length) {
		return <>Nothing to show.</>
	}

	const pages: Workout[][] = paginate(workouts, 10)
	const [currPage, setCurrPage] = useState(0)

	const pageNumbers = pages.map((_, idx) => {
		const style = getClassNames({
			pgNumber: styles['page-number'],
			active: idx === currPage ? ' ' + styles['active'] : '',
		})

		return (
			<li key={idx} className={style} onClick={() => setCurrPage(idx)}>
				{idx + 1}
			</li>
		)
	})

	const items = pages[currPage].map((w) => (
		<li key={w._id}>
			<WorkoutCard workout={w} />
		</li>
	))

	const prevPage = Math.max(0, currPage - 1)
	const nextPage = Math.min(pages.length - 1, currPage + 1)

	return (
		<div className={styles['list-container']}>
			<ul className={styles['workouts-list']}>{items}</ul>

			<ul className={styles['page-numbers']}>
				{pageNumbers.length > 1 && (
					<>
						<button
							className={styles['page-btn']}
							onClick={() => setCurrPage(prevPage)}
							disabled={currPage === 0}>
							<ChevronLeftIcon />
						</button>

						{pageNumbers}
						<button
							className={styles['page-btn']}
							onClick={() => setCurrPage(nextPage)}
							disabled={currPage === pages.length - 1}>
							<ChevronRightIcon />
						</button>
					</>
				)}
			</ul>
		</div>
	)
}

export default WorkoutsList
