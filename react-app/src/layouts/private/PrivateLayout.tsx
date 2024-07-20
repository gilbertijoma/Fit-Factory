import { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import Navbar from 'shared/components/Navbar/Navbar'
import styles from './PrivateLayout.module.css'
import { UserContext } from 'App'
import { environment } from 'environment/environment'
import { User } from 'shared/models/user'
import { Navigate } from 'react-router-dom'

interface PrivateLayoutProps {}

const PrivateLayout: FunctionComponent<PrivateLayoutProps> = () => {
	const { baseUrl } = environment
	const userContext = useContext(UserContext)
	const [currentView, setCurrentView] = useState<any>(null)

	useEffect(() => {
		fetch(baseUrl + '/users/me', { credentials: 'include' })
			.then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
			.then((user: User) => {
				userContext?.setUser(user)
				setCurrentView(
					<div id={styles['layout']}>
						<Navbar />
						<Outlet />
					</div>
				)
			})
			.catch((status) => {
				console.log('error retreiving user', status)
				setCurrentView(<Navigate to='/login' />)
			})
	}, [])

	return currentView
}

export default PrivateLayout
