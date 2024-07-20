import { ChevronRightIcon, HomeIcon } from '@radix-ui/react-icons'
import { FunctionComponent } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'
import Profile from './profile/Profile'
import Logout from './Logout/Logout'
import { getClassNames } from 'shared/utils/utils'

const navbar: FunctionComponent = () => {
	useLocation()

	const breadCrumbs = () => {
		const { pathname } = window.location
		const paths = pathname
			.split('/')
			.filter((str) => str !== '/')
			.filter((str) => str.length)
			.map((str) => str.charAt(0).toUpperCase() + str.slice(1))

		return paths.map((str, idx) => {
			const isFirstOrLast = idx === paths.length - 1
			const activeClass = idx === paths.length - 1 ? styles['active'] : ''
			const link = [...paths].splice(0, idx + 1).join('/')

			return (
				<div key={idx}>
					<NavLink className={styles['crumb'] + ' ' + activeClass} to={link}>
						{str}
					</NavLink>
					{!isFirstOrLast && <ChevronRightIcon />}
				</div>
			)
		})
	}

	const linkClassNames = (isActive: boolean) =>
		getClassNames({
			active: isActive ? styles['active'] : '',
			link: styles['link'],
		})

	return (
		<div id={styles['container']}>
			<div id={styles['navbar']}>
				<NavLink to='/dashboard'>
					<h1>Fit-Factory</h1>
				</NavLink>
				<nav className={styles['links']}>
					<NavLink className={({ isActive }) => linkClassNames(isActive)} to='/creators'>
						Creators
					</NavLink>
					<NavLink className={({ isActive }) => linkClassNames(isActive)} to='/workouts'>
						Workouts
					</NavLink>
					<NavLink className={({ isActive }) => linkClassNames(isActive)} to='/nutrition'>
						Nutrition
					</NavLink>
					<NavLink className={({ isActive }) => linkClassNames(isActive)} to='/tracking'>
						Tracking
						<span id={styles['beta']}>BETA</span>
					</NavLink>
				</nav>
				<div id={styles['profile']}>
					<Profile />
				</div>
				<div id={styles['profile']}></div>
			</div>

			<div id={styles['breadcrumbs']}>
				<NavLink to='/dashboard'>
					<HomeIcon />
				</NavLink>
				<ChevronRightIcon />
				{breadCrumbs()}
			</div>
		</div>
	)
}

export default navbar
