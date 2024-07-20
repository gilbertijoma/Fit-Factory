import { FunctionComponent, useContext, useState } from 'react'
import styles from './Profile.module.css'
import { UserContext } from 'App'
import Avatar from 'react-avatar'
import { ExitIcon, PersonIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { environment } from 'environment/environment'

interface ProfileProps {}
const { baseUrl } = environment

const Profile: FunctionComponent<ProfileProps> = () => {
	const userContext = useContext(UserContext)
	const [showDropDown, setShowDropDown] = useState(false)

	if (!userContext?.user) {
		return <p>Account</p>
	}

	const { user } = userContext
	const name = user.fname + ' ' + user.lname

	const navigate = useNavigate()
	const logout = () => {
		const authToken = { authToken: localStorage.getItem('AUTHTOKEN') }
		const jsonData = JSON.stringify(authToken)

		axios
			.post(baseUrl + '/users/logout', jsonData, {
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

	const dropDown = (
		<ul className={styles['drop-down']}>
			<NavLink className={styles['item']} to={'/profile/' + userContext.user._id}>
				<PersonIcon />
				Profile
			</NavLink>
			<li className={styles['item']} onClick={logout}>
				<ExitIcon />
				Logout
			</li>
		</ul>
	)

	return (
		<div className={styles['profile']}>
			<div
				className={styles['profile-pic'] + (showDropDown ? styles['active'] : '')}
				onClick={() => setShowDropDown(!showDropDown)}>
				<Avatar size='48' round name={name} />
			</div>

			{showDropDown && dropDown}
		</div>
	)
}

export default Profile
