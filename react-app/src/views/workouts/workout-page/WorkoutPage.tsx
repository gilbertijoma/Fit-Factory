import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from 'react'
import styles from './WorkoutPage.module.css'
import { NavLink, useParams } from 'react-router-dom'
import { environment } from 'environment/environment'
import { ExerciseType, Workout } from 'shared/models/workout'
import Spinner from 'shared/components/Spinner/Spinner'
import { UserContext } from 'App'
import {
	AvatarIcon,
	BookmarkFilledIcon,
	BookmarkIcon,
	PaperPlaneIcon,
	Pencil1Icon,
	Share1Icon,
	TrashIcon,
} from '@radix-ui/react-icons'
import Avatar from 'react-avatar'
import { WorkoutComment } from 'shared/models/workout'
import { User } from 'shared/models/user'
import EmptyIllustration from 'assets/illustrations/Empty'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import WorkoutService from '../../../shared/services/WorkoutService'
TimeAgo.addDefaultLocale(en)

interface WorkoutPageProps {}

interface CommentsProps {
	id: string
	user: User
	workoutComments: WorkoutComment[]
}

const { baseUrl } = environment

const Comments: FunctionComponent<CommentsProps> = ({ id, user, workoutComments }) => {
	const [comment, setComment] = useState<string>('')
	const [comments, setComments] = useState<WorkoutComment[]>(workoutComments)
	const [error, setError] = useState(false)
	const timeAgo = new TimeAgo('en-US')

	useEffect(() => {
		WorkoutService.getComments(id)
			.then((comments) => setComments(comments))
			.catch(() => setError(true))
	}, [])

	if (error) {
		return (
			<div className={styles['placeholder']}>
				<p>😲 Uh Oh! Looks like an error occured</p>
			</div>
		)
	}

	if (!comments) {
		return (
			<div className={styles['placeholder']}>
				<Spinner />
			</div>
		)
	}

	const handleCommentChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const { value } = ev.currentTarget
		setComment(value)
	}

	const addComment = () => {
		const newComment: WorkoutComment = {
			user: user.fname + ' ' + user.lname,
			content: comment,
			createdAt: new Date().toISOString(),
			workoutId: id!,
		}

		WorkoutService.postNewComment(newComment).then(({ id }) => {
			newComment._id = id
			setComment('')
			setComments([...comments, newComment])
		})
	}

	return (
		<div className={styles['section'] + ' ' + styles['comments']}>
			<h3 className={styles['title'] + ' subtitle'}>Comments</h3>
			<div className='card'>
				<ul>
					{comments.length > 0 &&
						comments.map(({ content, createdAt, user }, idx) => (
							<li className={styles['comment']} key={idx}>
								<p>
									<b>{user}</b>
									<span className='subtitle'> commented {timeAgo.format(new Date(createdAt))}</span>
								</p>
								<p className={styles['content']}>{content}</p>
							</li>
						))}
					{!comments.length && (
						<div className={styles['placeholder']}>
							<EmptyIllustration id={styles['empty']} />
							<p>Nothing Yet!</p>
						</div>
					)}
				</ul>
				{user.type === 'regular' && (
					<div id={styles['write-comment']}>
						<input
							type='text'
							name='comment-input'
							placeholder='Add a comment...'
							value={comment}
							onChange={handleCommentChange}
						/>
						<button
							className='btn-primary'
							type='submit'
							id={styles['submit-comment']}
							onClick={addComment}
							disabled={!comment.length}>
							<PaperPlaneIcon />
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

const WorkoutPage: FunctionComponent<WorkoutPageProps> = () => {
	const { id } = useParams()
	const userContext = useContext(UserContext)

	const [error, setError] = useState(false)
	const [showExercises, setShowExercises] = useState(true)
	const [workout, setWorkout] = useState<Workout | undefined>(undefined)
	const [comments, setComments] = useState<WorkoutComment[]>([])
	const user = userContext?.user

	useEffect(() => {
		WorkoutService.getWorkoutById(id)
			.then((workout) => setWorkout(workout))
			.catch(() => setError(true))

		WorkoutService.getComments(id)
			.then((comments) => setComments(comments))
			.catch(() => setError(true))
	}, [])

	if (error) {
		return (
			<div className={styles['placeholder']}>
				<p>😲 Uh Oh! Looks like an error occured</p>
			</div>
		)
	}

	if (!workout) {
		return (
			<div className={styles['placeholder']}>
				<Spinner />
			</div>
		)
	}

	const bookmarkWorkout = () => {
		const promise = workout.isBookmarked
			? WorkoutService.removeWorkoutBookmark(id!)
			: WorkoutService.bookmarkWorkout(id!)

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

	const changeTab = (ev: ChangeEvent<HTMLInputElement>) => {
		const { value } = ev.currentTarget
		setShowExercises(value === 'exercises')
	}

	const { title, description, creator, exercises, isBookmarked, thumbnailUrl } = workout

	const { host, protocol } = window.location
	const workoutEditUrl = `${protocol}//${host}/workouts/${workout._id}/edit`

	return (
		<div className={styles['workout'] + ' card'}>
			{/* <div className={styles['section']}>
                <Avatar src={thumbnailUrl} size='256'/>
            </div> */}
			<div className={styles['section']}>
				<div className={styles['header']}>
					<h1>{title}</h1>
					<div>
						{user?.type === 'regular' && (
							<>
								<button className='btn-secondary' onClick={bookmarkWorkout}>
									{isBookmarked ? <BookmarkFilledIcon id={styles['bookmark']} /> : <BookmarkIcon />}
								</button>
								<button className='btn-secondary'>
									<Share1Icon />
									Share
								</button>
							</>
						)}
						{creator._id === user?._id && (
							<NavLink className='btn-secondary' to={workoutEditUrl}>
								<Pencil1Icon />
								Edit
							</NavLink>
						)}
						{creator._id === user?._id && (
							<button className='btn-secondary' id={styles['delete']}>
								<TrashIcon />
								Delete
							</button>
						)}
					</div>
				</div>
				<p className={styles['description'] + ' subtitle'}>{description}</p>
				<div className={styles['created-by']}>
					<NavLink to={`/creators/${creator._id}`}>
						<Avatar name={creator.fname + ' ' + creator.lname} size='48' round />
					</NavLink>
					<div>
						<p>
							{creator.fname} {creator.lname}
						</p>
						<p className='subtitle'>{creator.email}</p>
					</div>
				</div>
			</div>

			<div className={styles['tabs']}>
				<div>
					<input
						type='radio'
						name='tabs'
						id='exercises'
						value='exercises'
						onChange={changeTab}
						checked={showExercises}
						hidden
					/>
					<label htmlFor='exercises'>Exercises</label>
				</div>
				<div>
					<input
						type='radio'
						name='tabs'
						id='comments'
						value='comments'
						onChange={changeTab}
						checked={!showExercises}
						hidden
					/>
					<label htmlFor='comments'>Comments</label>
				</div>
			</div>
			{showExercises && (
				<div className={styles['section'] + ' ' + styles['exercises']}>
					<h3 className={styles['title'] + ' subtitle'}>Exercises ({exercises.length})</h3>
					<ul className='card'>
						<li className={styles['exercise']}>
							<p>
								<b>Title</b>
							</p>
							<p>
								<b>Reps</b>
							</p>
							<p>
								<b>Sets</b>
							</p>
							<p>
								<b>Type</b>
							</p>
						</li>
						{exercises.map(({ title, reps, sets, type }, idx) => {
							return (
								<li className={styles['exercise']} key={idx}>
									<p>{title}</p>
									<p>{reps}</p>
									<p>{sets}</p>
									<p>{type === ExerciseType.GYM ? 'At The Gym' : 'At Home'}</p>
								</li>
							)
						})}
					</ul>
				</div>
			)}
			{!showExercises && <Comments id={id!} user={user!} workoutComments={comments} />}
		</div>
	)
}

export default WorkoutPage
