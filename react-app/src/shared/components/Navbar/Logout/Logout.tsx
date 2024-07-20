import { FunctionComponent } from 'react'

import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
interface LogoutProps {}

const Logout: FunctionComponent<LogoutProps> = () => {
	const navigate = useNavigate()
	function handleLogout() {
		const authToken = { authToken: localStorage.getItem('AUTHTOKEN') }
		const jsonData = JSON.stringify(authToken)

		axios
			.post('http://localhost:5000/api/users/logout', jsonData, {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			})
			.then((res) => {
				localStorage.removeItem('AUTHTOKEN')
				console.log('successfully logged out!')
				navigate('/')
			})
			.catch((error) => {
				console.error(error)
			})
	}

	return <button onClick={handleLogout} type='button'>Log Out</button>
}

export default Logout
