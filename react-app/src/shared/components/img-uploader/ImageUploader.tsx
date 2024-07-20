import { FilePlusIcon, TrashIcon, UploadIcon } from '@radix-ui/react-icons'
import { ChangeEvent, DragEvent, FunctionComponent, useState } from 'react'
import styles from './ImageUploader.module.css'
import { getClassNames } from 'shared/utils/utils'
import Spinner from '../Spinner/Spinner'

interface ImageUploaderProps {
	imgUrl?: string
	onImageUploaded?(img: File | undefined): void
}

const ImageUploader: FunctionComponent<ImageUploaderProps> = (props) => {
	const [imgUrl, setImgUrl] = useState(props.imgUrl)
	const [imgFile, setimgFile] = useState<File | undefined>(undefined)
	const [imgLoading, setImgLoading] = useState(false)
	const [dropzoneActive, setDropzoneActive] = useState(false)

	const handleImgUpload = (ev: ChangeEvent<HTMLInputElement>) => {
		const img = ev.currentTarget.files?.item(0)
		uploadImg(img!)
	}

	const uploadImg = (img: File | undefined) => {
		setimgFile(img)
		setImgLoading(!!img)

		if (props.onImageUploaded) {
			props.onImageUploaded(img)
		}
	}

	const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
		ev.preventDefault()

		const img = ev.dataTransfer.files.item(0)

		uploadImg(img!)
		setDropzoneActive(false)
	}

	const onDragOver = (ev: DragEvent<HTMLDivElement>) => {
		ev.preventDefault()
		setDropzoneActive(true)
	}

	const onDragLeave = (ev: DragEvent<HTMLDivElement>) => {
		ev.preventDefault()
		setDropzoneActive(false)
	}

	const startOver = () => {
		if (imgFile) {
			setimgFile(undefined)
		}

		if (imgUrl) {
			setImgUrl(undefined)
		}
	}

	const newImgTemplate = () => {
		let imgFileSize = 'N/A'

		if (imgFile) {
			imgFileSize =
				`${(imgFile!.size / 1000000).toFixed(2)} ` +
				['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'][Math.floor(Math.log2(imgFile!.size) / 10)]
		}

		return (
			<>
				<img id={styles['img']} src={imgUrl} onLoad={() => setImgLoading(false)}></img>
				{imgLoading && <Spinner />}
				{!imgLoading && (
					<>
						<p className={styles['hr']}></p>
						<div id={styles['file-details']}>
							<p>
								<b>File Name:</b> {imgFile?.name || 'N/A'}
							</p>
							<p>
								<b>File Size:</b> {imgFileSize}
							</p>
						</div>
						<button
							type='button'
							className={'btn-secondary ' + styles['file-btn']}
							id={styles['overwrite']}
							onClick={startOver}>
							<TrashIcon />
							Start Over
						</button>
					</>
				)}
			</>
		)
	}

	const imgUploadedTemplate = () => {
		return (
			<>
				<UploadIcon id={styles['icon']} />
				<p>Drag & Drop Image File Here to Upload.</p>
				<p className={styles['hr']}>
					<span>OR</span>
				</p>
				<button
					type='button'
					className={'btn-secondary ' + styles['file-btn']}
					id={styles['new']}
					onClick={() => document.getElementById('img-upload')!.click()}>
					<FilePlusIcon />
					Choose File
				</button>
				<p className='subtitle'>16:9 aspect ratio recommended. (.jpg or .png)</p>
			</>
		)
	}

	const className = getClassNames({
		uploader: styles['uploader'],
		active: dropzoneActive ? styles['active'] : '',
	})

	return (
		<div
			className={className}
			id={styles['drop-zone']}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={handleDrop}>
			{imgFile || imgUrl ? newImgTemplate() : imgUploadedTemplate()}
			<input type='file' id='img-upload' accept='.png, .jpg' hidden onChange={handleImgUpload} />
		</div>
	)
}
export default ImageUploader
