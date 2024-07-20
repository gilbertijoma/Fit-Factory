import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react'
import WorkoutsList from './workouts-list/WorkoutsList'
import { Workout } from 'shared/models/workout'
import { environment } from 'environment/environment'
import Spinner from 'shared/components/Spinner/Spinner'
import styles from './Workouts.module.css'
import { NavLink } from 'react-router-dom'
import { getClassNames } from 'shared/utils/utils'
import { Filter } from './models/workout-filter'
import WorkoutsFilter from './workouts-filter/WorkoutsFilter'
import { User } from 'shared/models/user'
import CreatorsList from './creators-list/CreatorsList'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import WorkoutCard from './workout-card/WorkoutCard'
import WorkoutService from '../../shared/services/WorkoutService'

interface WorkoutsProps {
	showWorkouts?: boolean
	showCreators?: boolean
}

const { baseUrl } = environment

const CreatorsTab: FunctionComponent = () => {
	const [filteredCreators, setFilterdCreators] = useState<User[]>([])
	const [unFileteredCreators, setUnFileteredCreators] = useState<User[]>([])

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getAllCreators()
			.then((creators) => {
				setUnFileteredCreators([...creators])
				setFilterdCreators([...creators])
			})
			.catch((err) => console.log('Error fetching', err))
			.finally(() => setLoading(false))
	}, [])

	const handleCreatorsSearch = (ev: ChangeEvent<HTMLInputElement>) => {
		const { value } = ev.currentTarget

		const result = unFileteredCreators.filter((c) => {
			const normalizedFname = c.fname.toLowerCase()
			const normalizedLname = c.lname.toLowerCase()
			const normalizedValue = value.toLowerCase()

			return normalizedFname.includes(normalizedValue) || normalizedLname.includes(normalizedValue)
		})

		setFilterdCreators(result)
	}

	if (loading) {
		return <Spinner />
	}

	return (
		<>
			<div className={styles['header'] + ' ' + styles['creator']}>
				<div className={styles['search-bar'] + ' input'}>
					<MagnifyingGlassIcon />
					<input
						type='text'
						name='search'
						id=''
						placeholder='e.g, Dwayne Johnson'
						onChange={handleCreatorsSearch}
					/>
				</div>
			</div>
			<div className={styles['creators']}>
				<CreatorsList creators={filteredCreators} />
			</div>
		</>
	)
}

const WorkoutsTab: FunctionComponent = () => {
	const [loading, setLoading] = useState(true)

	const [searchValue, setSearchValue] = useState('')

	const [filters, setFilters] = useState<Filter[]>([])
	const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([])
	const [unFilteredWorkouts, setUnFilteredWorkouts] = useState<Workout[]>([])

	useEffect(() => {
		WorkoutService.getAllWorkouts()
			.then((workouts: Workout[]) => {
				setUnFilteredWorkouts([...workouts])
				setFilteredWorkouts([...workouts])
			})
			.catch((err) => console.log('Error fetching', err))
			.finally(() => setLoading(false))
	}, [])

	const onFiltersApplied = (filters: Filter[]) => {
		setFilters([...filters])

		setFilteredWorkouts(
			unFilteredWorkouts
				.filter((w) => {
					return w.title.toLowerCase().includes(searchValue.toLowerCase())
				})
				.filter((workout) => {
					return filters.every((f) => f.filterFn(workout))
				})
		)
	}

	const handleWorkoutsSearch = (ev: ChangeEvent<HTMLInputElement>) => {
		const { value } = ev.currentTarget

		const normalizedValue = value.toLowerCase()

		const arr = unFilteredWorkouts
			.filter((workout) => {
				return filters.every((f) => f.filterFn(workout))
			})
			.filter((w) => {
				return w.title.toLowerCase().includes(normalizedValue)
			})

		console.log(arr)

		setFilteredWorkouts(arr)
		setSearchValue(value)
	}

	if (loading) {
		return (
			<div className={styles['workouts']}>
				<Spinner />
			</div>
		)
	}

	return (
		<>
			<div className={styles['header']}>
				<div className={styles['search-bar'] + ' input'}>
					<MagnifyingGlassIcon />
					<input
						type='text'
						name='search'
						id=''
						placeholder='e.g, Dwayne Johnson'
						onChange={handleWorkoutsSearch}
						value={searchValue}
					/>
				</div>
				<WorkoutsFilter onFiltersApplied={onFiltersApplied} />
			</div>
			<div className={styles['workouts']}>
				<WorkoutsList workouts={filteredWorkouts} />
			</div>
		</>
	)
}

const Workouts: FunctionComponent<WorkoutsProps> = ({ showCreators, showWorkouts }) => {
	return (
		<div className={styles['container']}>
			{showWorkouts && <WorkoutsTab />}
			{showCreators && <CreatorsTab />}
		</div>
	)
}

export default Workouts

function getAllCreators(): Promise<User[]> {
	return fetch(baseUrl + '/creators/all', { credentials: 'include' }).then((res) => res.json())
}
