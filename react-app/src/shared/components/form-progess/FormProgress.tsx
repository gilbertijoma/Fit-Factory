import { CheckCircledIcon } from '@radix-ui/react-icons'
import { FunctionComponent } from 'react'
import styles from './FormProgress.module.css'
import { getClassNames } from 'shared/utils/utils'

interface FormProgressProps {
	/** Current step of the form */
	currentStep: number
	/** Steps that have been completed */
	completed: number[]
	/** Steps to show in the indicator */
	steps: string[]
	/**
	 * Callback for when a step is clicked.
	 * @param step Step that was clicked
	 */
	onStepClicked?(step: number): void
}

const FormProgress: FunctionComponent<FormProgressProps> = (props) => {
	const onClick = (step: number) => {
		const canClickStep = props.completed.some((s) => s === step)

		if (props.onStepClicked && canClickStep) {
			props.onStepClicked(step)
		}
	}

	const steps = props.steps.map((step, idx) => {
		const isComplete = props.completed.some((completed) => completed === idx + 1)

		const classNames = getClassNames({
			active: props.currentStep === idx + 1 ? styles['active'] : '',
			complete: isComplete ? styles['complete'] : '',
			clickDisabled: !props.completed.some((s) => s === idx + 1) ? styles['click-disabled'] : '',
		})

		return (
			<li className={styles['step'] + ' ' + classNames} key={idx} onClick={() => onClick(idx + 1)}>
				<div className={styles['active-border']}></div>
				<CheckCircledIcon />
				<p className={styles['title'] + ' ' + classNames}>{step}</p>
			</li>
		)
	})

	return <ul className={styles['container']}>{steps}</ul>
}

export default FormProgress
