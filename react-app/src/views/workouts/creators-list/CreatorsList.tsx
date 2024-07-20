import { FunctionComponent, useState } from 'react'
import { User } from 'shared/models/user'
import styles from './CreatorsList.module.css'
import Avatar from 'react-avatar'
import { NavLink } from 'react-router-dom'

interface CreatorsListProps {
	creators: User[]
}

const CreatorsList: FunctionComponent<CreatorsListProps> = ({ creators }) => {
	return (
		<ul className={styles['creators']}>
			{creators.map(({ _id, fname, lname, email }, idx) => {
				return (
					<li key={idx}>
						<NavLink to={'/creators/' + _id}>
							<Avatar size='96' round name={fname + ' ' + lname} />
						</NavLink>
						<p>
							{fname} {lname}
						</p>
						<p className='subtitle'>{email}</p>
					</li>
				)
			})}
		</ul>
	)
}

export default CreatorsList
