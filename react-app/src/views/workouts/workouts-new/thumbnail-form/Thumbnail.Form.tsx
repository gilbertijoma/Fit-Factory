import { FunctionComponent, useState } from 'react'
import defaults from '../NewWorkout.module.css'
import { FormStepProps } from '../NewWorkout'
import ImageUploader from 'shared/components/img-uploader/ImageUploader'
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import { uploadImage } from 'shared/utils/utils'

const ThumbnailForm: FunctionComponent<FormStepProps> = ({
	setCurrStep,
	currStep,
	setNewWorkoutForm,
	newWorkoutForm,
}) => {
	const { thumbnailUrl } = newWorkoutForm
	const [deleteUrl, setDeleteUrl] = useState<string>('')

	const onImgUploaded = (imgFile?: File) => {
		if (!imgFile) {
			return
		}

		uploadImage(imgFile!)
			.then(({ data }) => {
				setNewWorkoutForm((prev) => {
					return {
						...prev,
						thumbnailUrl: data.image.url,
					}
				})
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	return (
		<form className={defaults['form']} id='thumbnail-form'>
			<div className={defaults['header']}>
				<p className={defaults['title']}>Say Cheese!</p>
				<p className='subtitle'>
					This is optional, but it is a good idea to upload a thumbnail that will get members interested in
					your workout plan.
				</p>
			</div>
			<div className={defaults['section']}>
				<ImageUploader onImageUploaded={onImgUploaded} imgUrl={thumbnailUrl} />
			</div>
			<div className={defaults['actions']}>
				<button className='btn-secondary' type='button' onClick={() => setCurrStep(currStep - 1)}>
					<ArrowLeftIcon />
					Back
				</button>
				<button className='btn-primary' type='button' onClick={() => setCurrStep(currStep + 1)}>
					{thumbnailUrl ? 'Next' : 'Skip'}
					<ArrowRightIcon />
				</button>
			</div>
		</form>
	)
}

export default ThumbnailForm
