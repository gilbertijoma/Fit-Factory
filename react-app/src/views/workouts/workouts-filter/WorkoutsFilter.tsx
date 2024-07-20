import { ChangeEvent, FunctionComponent, useEffect, useRef, useState } from 'react'
import styles from './WorkoutsFilter.module.css'
import { Filter } from 'views/workouts/models/workout-filter'
import { Cross1Icon, TriangleDownIcon } from '@radix-ui/react-icons'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'

export interface WorkoutsFilterProps {
	onFiltersApplied?(filters: Filter[]): void
}

interface FilterDropDownProps {
	name: string
	filterComponent: ReactJSXElement
}

interface FilterProps {
	filter: Filter
	onFilterUpdated(filter: Filter): void
}

const FilterDropDown: FunctionComponent<FilterDropDownProps> = ({ name, filterComponent }) => {
	const [dropShowing, setDropShowing] = useState(false)
	const dropDownRef = useRef<HTMLDivElement>(null)

	const handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
		setDropShowing(!dropShowing)
	}

	useEffect(() => {
		const clickHandler = (ev: MouseEvent) => {
			const node = ev.target as Node
			const clickedOutsideOf = !dropDownRef.current?.contains(node)

			if (node !== dropDownRef.current && clickedOutsideOf && dropShowing) {
				setDropShowing(false)
			}
		}

		window.addEventListener('click', clickHandler)

		return () => window.removeEventListener('click', clickHandler)
	}, [dropDownRef, dropShowing, setDropShowing])

	return (
		<div className={styles['drop-container']} ref={dropDownRef}>
			<div className={styles['header'] + ' ' + (dropShowing ? styles['active'] : '')} onClick={handleClick}>
				<p>{name}</p>
				<TriangleDownIcon />
			</div>
			{dropShowing && <div className={'card ' + styles['drop-down']}>{filterComponent}</div>}
		</div>
	)
}

const CreatedByFilter: FunctionComponent<FilterProps> = ({ filter, onFilterUpdated }) => {
	const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const { value } = ev.target

		filter.displayValue = value
		filter.filterFn = (workout) => {
			const { creator } = workout
			const fname = creator.fname.toLowerCase()
			const lname = creator.lname.toLowerCase()

			return (
				fname.includes(value.toLowerCase()) ||
				lname.includes(value.toLowerCase()) ||
				(fname + lname).includes(value.toLowerCase())
			)
		}

		onFilterUpdated({ ...filter })
	}

	return (
		<>
			<label className={'subtitle ' + styles['filter-title']} htmlFor='created-by'>
				Created By
			</label>
			<div className='input' id={styles['created-by']}>
				<p>@</p>
				<input type='text' name='created-by' value={filter.displayValue} onChange={handleChange} />
			</div>
		</>
	)
}

const ReviewsFilter: FunctionComponent<FilterProps> = ({ filter, onFilterUpdated }) => {
	const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const { value } = ev.target

		filter.displayValue = `${value}-stars`
		/* filter.filterFn = () => {
          return true
        } */
		onFilterUpdated({ ...filter })
	}

	return (
		<div id={styles['reviews']}>
			<label className={'subtitle ' + styles['filter-title']} htmlFor='reviews'>
				Member Reviews
			</label>
			<ul>
				<li className={styles['filter'] + ' ' + (filter.displayValue === '4-stars' ? styles['active'] : '')}>
					<label htmlFor='4-stars'>
						4 stars and up
						<input
							type='radio'
							name='stars'
							id='4-stars'
							hidden
							value={4}
							onChange={handleChange}
							checked={filter.displayValue === '4-stars'}
						/>
					</label>
				</li>
				<li className={styles['filter'] + ' ' + (filter.displayValue === '3-stars' ? styles['active'] : '')}>
					<label htmlFor='3-stars'>
						3 stars and up
						<input
							type='radio'
							name='stars'
							id='3-stars'
							hidden
							value={3}
							onChange={handleChange}
							checked={filter.displayValue === '3-stars'}
						/>
					</label>
				</li>
				<li className={styles['filter'] + ' ' + (filter.displayValue === '2-stars' ? styles['active'] : '')}>
					<label htmlFor='2-stars'>
						2 stars and up
						<input
							type='radio'
							name='stars'
							id='2-stars'
							hidden
							value={2}
							onChange={handleChange}
							checked={filter.displayValue === '2-stars'}
						/>
					</label>
				</li>
			</ul>
		</div>
	)
}

const WorkoutsFilter: FunctionComponent<WorkoutsFilterProps> = ({ onFiltersApplied }) => {
	const [filters, setFilters] = useState<Filter[]>([
		{
			name: 'createdBy',
			displayValue: '',
			filterFn: () => true,
		},
		{
			name: 'reviews',
			displayValue: '',
			filterFn: () => true,
		},
	])

	const onFilterUpdated = (filter: Filter) => {
		let existingFilter = filters.find((f) => f.name === filter.name)

		existingFilter = { ...filter }
		setFilters([...filters])

		if (onFiltersApplied) {
			onFiltersApplied([...filters])
		}
	}

	const removeFilter = (displayValue: string, apply: boolean) => {
		let existingFilter = filters.find((f) => f.displayValue === displayValue)

		existingFilter!.displayValue = ''
		existingFilter!.filterFn = () => true

		setFilters([...filters])

		if (onFiltersApplied && apply) {
			onFiltersApplied([...filters])
		}
	}

	const clearAllFilters = () => {
		filters.forEach((f) => removeFilter(f.displayValue, false))

		if (onFiltersApplied) {
			onFiltersApplied([...filters])
		}
	}

	const activeFilters = filters.map((f) => f.displayValue).filter((f) => !!f)

	return (
		<div id={styles['filters-header']}>
			<ul className={styles['filters']}>
				<FilterDropDown
					name='Created-By'
					filterComponent={<CreatedByFilter onFilterUpdated={onFilterUpdated} filter={filters[0]} />}
				/>
				<FilterDropDown
					name='Review Rating'
					filterComponent={<ReviewsFilter onFilterUpdated={onFilterUpdated} filter={filters[1]} />}
				/>
			</ul>
			{!!activeFilters.length && (
				<ul className={styles['active-filters']}>
					<p>Applied Filters: </p>
					{activeFilters.map((v, idx) => (
						<li key={idx}>
							<p>{v}</p>
							<button onClick={() => removeFilter(v, true)}>
								<Cross1Icon />
							</button>
						</li>
					))}
					<button id={styles['clear-all']} onClick={clearAllFilters}>
						Clear All
					</button>
				</ul>
			)}
		</div>
	)
}

export default WorkoutsFilter
