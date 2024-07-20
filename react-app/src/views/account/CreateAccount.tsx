import React, { useContext } from 'react'
import { useState } from 'react'

import { NavLink, useNavigate } from 'react-router-dom'
import { environment } from '../../environment/environment'

import axios from 'axios'
import styles from './CreateAccount.module.css'
import { EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons'
import Google from 'assets/icons/Google'
import Facebook from 'assets/icons/Facebook'
import { User } from 'shared/models/user'
import { UserContext } from 'App'

interface FormData {
	fname: string
	lname: string
	email: string
	password: string
	hfeet: number
	hinches: number
	weight: number
	type: 'trainer' | 'regular'
}

const { baseUrl } = environment

//Checks if the provided email is already associated with an account
const doesEmailExist = async (email: string): Promise<boolean> => {
	const res = await fetch(baseUrl + '/users/accountByEmail', {
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		method: 'POST',
		body: JSON.stringify({ email: email }),
	})

	if (!res.ok) {
		Promise.reject(res)
	}

	return (await res.json()).getEmail //True or false value
}

function CreateAccount() {
	const userContext = useContext(UserContext)
	const navigate = useNavigate()
	const [submitWarning, setSubmitWarning] = useState('')
	const [step, setStep] = useState(1)
	const [emailExistsError, setemailExistsError] = useState(false)

	const [formData, setFormData] = useState<FormData>({
		fname: '',
		lname: '',
		email: '',
		password: '',
		hfeet: 0,
		hinches: 0,
		weight: 0,
		type: 'regular',
	})

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fieldName = event.target.name
		const fieldValue = event.target.value

		if (emailExistsError) {
			setemailExistsError(false)
		}

		setFormData((prevState: any) => ({
			...prevState,
			[fieldName]: fieldValue,
		}))
	}

	async function handleSubmit(e: { preventDefault: () => void }) {
		e.preventDefault()

		if (validateForm(formData)) {
			const jsonData = JSON.stringify(formData)
			console.log(jsonData)
			axios
				.post<User>(baseUrl + '/users/create', jsonData, {
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				})
				.then(({ data }) => {
					userContext?.setUser(data)
					navigate('/dashboard')
				})
				.catch((error) => {
					console.error(error)
				})
		}
	}

	function validateForm(form: FormData) {
		setSubmitWarning('')
		let validForm = true
		//CHECK IF PASSWORD LENGTH IS TOO SHORT
		if (form.password.length < 8) {
			setSubmitWarning('Password must be 8 characters or more')
			validForm = false
		}

		//CHECK IF ACCOUNT ALREADY EXISTS WITH THAT EMAIL
		const emailData = '{"email": "' + form.email + '"}'
		axios
			.post(baseUrl + '/users/accountByEmail', JSON.parse(emailData), {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((res) => {
				if (res.data.getEmail == false) {
					setSubmitWarning('\nEmail is already in use')
					validForm = false
				}
			})
			.catch((error) => {
				console.error(error)
			})

		return validForm
	}

	//Form for signing up with email or ID provider
	const initialForm = () => {
		return (
			<>
				<div className={styles['section'] + ' ' + styles['header']}>
					<h1>Sign Up</h1>
					<p className='subtitle'>Let's get started with your fitness journey.</p>
				</div>

				<div className={styles['section']}>
					<button className='btn-secondary' type='button' onClick={() => setStep(step + 1)}>
						<Google className={styles['icon']} />
						Sign up with Google
					</button>
					<button className='btn-secondary' type='button' onClick={() => setStep(step + 1)}>
						<Facebook className={styles['icon']} />
						Sign up with Facebook
					</button>
				</div>
				<p className='hr'>
					<span>OR</span>
				</p>
				<div className={styles['section']}>
					<button className='btn-primary' type='button' onClick={() => setStep(step + 1)}>
						<EnvelopeClosedIcon className={styles['icon']} />
						Sign up with Email
					</button>
				</div>
			</>
		)
	}

	//Form for email and password
	const emailPswdForm = () => {
		const { email, password } = formData

		const checkEmail = () => {
			doesEmailExist(email)
				.then((exists) => {
					setemailExistsError(exists)

					if (!exists) {
						setStep(step + 1)
					}
				})
				.catch((err) => {
					console.log('error validating email', err)
				})
		}

		return (
			<>
				<div className={styles['section'] + ' ' + styles['header']}>
					<h1>Sign Up</h1>
					<p className='subtitle'>Let's get started with your fitness journey.</p>
				</div>
				<div className={styles['section'] + ' ' + (emailExistsError ? styles['error'] : '')}>
					<label htmlFor='email'>Email</label>
					<div className={'input' + ' ' + styles['input']}>
						<EnvelopeClosedIcon />
						<input
							type='email'
							id='email'
							name='email'
							value={email}
							onChange={handleChange}
							placeholder='johndoe@example.com'
							required></input>
					</div>
					{emailExistsError && (
						<p className={styles['err-msg']}>The provided email is associated with an existing account.</p>
					)}
				</div>
				<div className={styles['section']}>
					<label htmlFor='password'>
						Password
						<span className='subtitle'> (8 Characters or more)</span>
					</label>
					<div className={'input' + ' ' + styles['input']}>
						<LockClosedIcon />
						<input
							type='password'
							id='password'
							name='password'
							value={password}
							onChange={handleChange}
							placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
							required
						/>
					</div>
				</div>
				<div className={styles['section'] + ' ' + styles['submit']}>
					<button className='btn-secondary' type='button' onClick={() => setStep(step - 1)}>
						Back
					</button>
					<button
						className='btn-primary'
						onClick={checkEmail}
						type='button'
						disabled={!email || !password || password.length < 8}>
						Next
					</button>
				</div>
			</>
		)
	}

	//Form for first and last name and profile type
	const profileInfoForm = () => {
		const isTrainer = formData.type === 'trainer'
		const isRegular = formData.type === 'regular'
		const { fname, lname } = formData

		return (
			<>
				<div className={styles['section'] + ' ' + styles['header']}>
					<h1>Profile Information</h1>
					<p className='subtitle'>
						Information such as your first and last name are required for all members.
					</p>
				</div>

				<div className={styles['section']}>
					<label htmlFor='fname'>First Name</label>
					<input
						type='text'
						name='fname'
						id='fname'
						placeholder='John'
						value={fname}
						onChange={handleChange}
					/>
				</div>

				<div className={styles['section']}>
					<label htmlFor='lname'>Last Name</label>
					<input
						type='text'
						name='lname'
						id='lname'
						placeholder='Doe'
						value={lname}
						onChange={handleChange}
					/>
				</div>

				<div className={styles['section']} id={styles['member-type-section']}>
					<label>I Am a</label>
					<label
						htmlFor='trainer'
						className={styles['member-type'] + ' ' + (isTrainer ? styles['active'] : '')}>
						Fitness Trainer
						<input
							type='radio'
							name='type'
							id='trainer'
							value='trainer'
							checked={isTrainer}
							onChange={handleChange}
						/>
					</label>
					<label
						htmlFor='regular'
						className={styles['member-type'] + ' ' + (isRegular ? styles['active'] : '')}>
						Regular User
						<input
							type='radio'
							name='type'
							id='regular'
							value='regular'
							checked={isRegular}
							onChange={handleChange}
						/>
					</label>
				</div>

				<div className={styles['section'] + ' ' + styles['submit']}>
					<button className='btn-secondary' onClick={() => setStep(step - 1)}>
						Back
					</button>
					<button className='btn-primary' type='button' onClick={() => setStep(step + 1)}>
						Next
					</button>
				</div>
			</>
		)
	}

	//Form for personal information
	const bodyMetricsForm = () => {
		const { hfeet, hinches, weight } = formData

		return (
			<>
				<div className={styles['section'] + ' ' + styles['header']}>
					<h1>Complete Signup</h1>
					<p className='subtitle'>We just need a tiny bit more information to complete your profile.</p>
				</div>
				<div className={styles['section']} id={styles['height']}>
					<label htmlFor='hfeet'>
						Height <span className='subtitle'>(in feet)</span>
					</label>
					<input type='number' name='hfeet' id='hfeet' value={hfeet} onChange={handleChange} />

					<label htmlFor='hinches'>
						Height <span className='subtitle'>(in inches)</span>
					</label>
					<input type='number' name='hinches' id='hinches' value={hinches} onChange={handleChange} />
				</div>

				<div className={styles['section']}>
					<label htmlFor='weight'>
						Weight <span className='subtitle'>(in lbs)</span>
					</label>
					<input type='number' name='weight' id='weight' value={weight} onChange={handleChange} />
				</div>

				<div className={styles['section'] + ' ' + styles['submit']}>
					<button className='btn-secondary' onClick={() => setStep(step - 1)}>
						Back
					</button>
					<button
						className='btn-primary'
						type='submit'
						onClick={handleSubmit}
						disabled={!weight || !hfeet || !hinches}>
						Complete Signup
					</button>
				</div>
			</>
		)
	}

	//TODO ADD A USER OR FITNESS TRAINER OPTION ON ACCOUNT SIGNUP
	return (
		<form id={styles['account-form']}>
			{step === 1 && initialForm()}
			{step === 2 && emailPswdForm()}
			{step === 3 && profileInfoForm()}
			{step === 4 && bodyMetricsForm()}

			<NavLink to='/login' id={styles['login']}>
				Already have an account?
			</NavLink>
		</form>
	)
}
export default CreateAccount
