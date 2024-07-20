import { FunctionComponent } from 'react'
import styles from './Spinner.module.css'

interface SpinnerProps {
	message?: string
}

/**
 * A spinner that can be used in components for loading state
 * @returns Spinner for loading animation
 */
const Spinner: FunctionComponent<SpinnerProps> = (props) => {
	return (
		<div className={styles['container']}>
			<div id={styles['spinner']}></div>
			<p id={styles['message']}>{props.message}</p>
		</div>
	)
}

export default Spinner
