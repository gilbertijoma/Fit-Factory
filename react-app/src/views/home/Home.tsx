import { FunctionComponent, useState } from 'react'
import styles from './Home.module.css'
import Runner from 'assets/icons/Runner'
import { NavLink } from 'react-router-dom'
import JumpRopleIllustration from 'assets/illustrations/JumpRope'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import DemoIllustration from 'assets/illustrations/Demo'
import SmartHomeIllustration from 'assets/illustrations/SmartHome'
import PricingIllustration from 'assets/illustrations/Pricing'

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
	return (
		<div className={styles['landing']}>
			<div id={styles['caption']}>
				<h1 className={styles['title']}>Take Control of Your Health.</h1>
				<p className={styles['subtitle']}>Fit-Factory helps you to accomplish your fitness dreams.</p>
				<div id={styles['actions']}>
					<NavLink to='/createaccount' className='btn-primary' id={styles['cta']}>
						Try Fit-Factory Free
						<ChevronRightIcon />
					</NavLink>
				</div>
			</div>

			<div id={styles['images']}>
				<JumpRopleIllustration />
			</div>

			<div className='card' id={styles['stats']}>
				<div className={styles['stat-card']}>
					<p className={styles['header']}>First-class Workout Plans</p>
					<p className={styles['desc'] + ' subtitle'}>
						Follow workout plans that are created by experienced fitness trainers.
					</p>
				</div>
				<div className={styles['stat-card']}>
					<p className={styles['header']}>You're in Control</p>
					<p className={styles['desc'] + ' subtitle'}>All workouts and nutrition plans are chosen by you.</p>
				</div>
				<div className={styles['stat-card']}>
					<p className={styles['header']}>Choose the Best Fit</p>
					<p className={styles['desc'] + ' subtitle'}>
						With three different plans to choose from, you can decide on what works best for you.
					</p>
				</div>
			</div>
		</div>
	)
}

export default Home
