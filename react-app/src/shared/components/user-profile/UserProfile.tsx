import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from 'react'
import Avatar from 'react-avatar'
import { Social, User } from 'shared/models/user'
import styles from './UserProfile.module.css'
import { environment } from 'environment/environment'
import Spinner from '../Spinner/Spinner'
import { useParams } from 'react-router'
import { Workout } from 'shared/models/workout'
import WorkoutCard from 'views/workouts/workout-card/WorkoutCard'
import { UserContext } from 'App'
import WorkoutService from 'shared/services/WorkoutService'

interface UserProfileProps {}

interface SocialMediaProps {
	isEditMode: boolean
	socials: Social[]
	onSave(socials: Social[]): void
	onCancel(): void
}

const { baseUrl } = environment

const SocialMediaList: FunctionComponent<SocialMediaProps> = ({ socials, isEditMode, onCancel, onSave }) => {
	const [editedSocials, setEditedSocials] = useState([...socials])

	const instagram = editedSocials.find((s) => s.type === 'Instagram') || ({ type: 'Instagram', link: '' } as Social)
	const twitter = editedSocials.find((s) => s.type === 'Twitter') || ({ type: 'Twitter', link: '' } as Social)
	const facebook = editedSocials.find((s) => s.type === 'Facebook') || ({ type: 'Facebook', link: '' } as Social)

	const save = () => {
		onSave([instagram, twitter, facebook])
	}

	const handleChange = (ev: ChangeEvent<HTMLInputElement>, type: Social['type']) => {
		const { value } = ev.currentTarget

		switch (type) {
			case 'Facebook':
				facebook.link = value
				break
			case 'Twitter':
				twitter.link = value
				break
			case 'Instagram':
				instagram.link = value
				break
		}

		setEditedSocials([instagram, twitter, facebook])
	}

	if (isEditMode) {
		return (
			<div className={styles['social-editable']}>
				<div>
					<label htmlFor='insta'>Instagram</label>
					<input
						type='text'
						name='link'
						id='insta'
						placeholder='https://instagram.com/myprofile'
						onChange={(e) => handleChange(e, instagram.type)}
						value={instagram.link}
					/>
				</div>
				<div>
					<label htmlFor='twitter'>Twitter</label>
					<input
						type='text'
						name='link'
						id='twitter'
						placeholder='https://twitter.com/myprofile'
						onChange={(e) => handleChange(e, twitter.type)}
						value={twitter.link}
					/>
				</div>
				<div>
					<label htmlFor='twitter'>Facebook</label>
					<input
						type='text'
						name='link'
						id='facebook'
						placeholder='https://facebook.com/myprofile'
						onChange={(e) => handleChange(e, facebook.type)}
						value={facebook.link}
					/>
				</div>
				<div className={styles['save']}>
					<button className='btn-secondary' onClick={onCancel}>
						Cancel
					</button>
					<button className='btn-primary' onClick={save}>
						Save Changes
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className={styles['socials']}>
			{socials
				.filter((s) => s.link)
				.map(({ link, type }, idx) => {
					return (
						<div className={styles['social']} key={idx}>
							<a href={link} target='_blank'>
								{type}
							</a>
						</div>
					)
				})}
		</div>
	)
}

const UserProfile: FunctionComponent<UserProfileProps> = () => {
	const { id } = useParams()
	const userContext = useContext(UserContext)
	const [user, setUser] = useState<User>()
	const [workouts, setWorkouts] = useState<Workout[]>([])

	const [isEditMode, setIsEditMode] = useState(false)

	useEffect(() => {
		fetch(baseUrl + `/users/${id}`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((u) => setUser(u))

		WorkoutService.getWorkoutByCreatorId(id).then((w) => setWorkouts(w))
	}, [])

	if (!user) {
		return (
			<div className={styles['profile-container'] + ' card'}>
				<Spinner />
			</div>
		)
	}

	const { fname, lname, email, weight, hfeet, hinches, imgUrl, socials } = user

	const isEditable = userContext?.user?._id === user._id

	const updateSocials = (socials: Social[]) => {
		fetch(baseUrl + '/users/updateSocials', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ socials }),
		})
			.then((res) => (res.ok ? res.status : Promise.reject(res)))
			.then(() => {
				setUser((prev) => {
					return {
						...prev!,
						socials: socials,
					}
				})

				setIsEditMode(false)
			})
			.catch((err) => {
				console.log('Error updating socials', err)
			})
	}

	return (
		<div className={styles['profile-container'] + ' card'}>
			<Avatar src={imgUrl} name={fname + ' ' + lname} round size='96' />
			<div className={styles['header']}>
				<div>
					<h1>{fname + ' ' + lname}</h1>
					<p className='subtitle'>{email}</p>
				</div>

				<div className={styles['metrics']}>
					<p>
						<strong>Weight:</strong> {weight} lbs
					</p>
					<p>
						<strong>Height:</strong> {hfeet}'{hinches}
					</p>
				</div>
				<div className={styles['socials']}>
					<SocialMediaList
						socials={socials}
						isEditMode={isEditMode}
						onSave={updateSocials}
						onCancel={() => setIsEditMode(false)}
					/>
					{!isEditMode && isEditable && (
						<button className='btn-secondary' onClick={() => setIsEditMode(true)}>
							{socials.length ? 'Edit' : 'Add Socials'}
						</button>
					)}
				</div>
			</div>

			<div className={styles['workouts']}>
				<h1>Published Workout Plans</h1>
				<ul>
					{workouts.map((w, idx) => {
						return (
							<li key={idx}>
								<WorkoutCard workout={w} />
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}

export default UserProfile
