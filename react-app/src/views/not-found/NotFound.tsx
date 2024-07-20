import { FunctionComponent } from 'react'
import styles from './NotFound.module.css'
import Error404Illustration from 'assets/illustrations/Error404'
import { NavLink } from 'react-router-dom'

interface NotFoundProps {}

const NotFound: FunctionComponent<NotFoundProps> = () => {
	return (
		<div className={styles['error']}>
			<Error404Illustration id={styles['err-img']} />
			<h1>Uh, oh.</h1>
			<h3 className='subtitle'>It looks like you've taken a wrong turn in your fitness journey.</h3>
			<NavLink to='/dashboard' className='btn-primary' id={styles['home']}>
				Take Me Home
			</NavLink>
		</div>
	)
}

export default NotFound
