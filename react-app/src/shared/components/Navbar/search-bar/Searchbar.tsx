import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { FunctionComponent } from 'react'
import styles from './Searchbar.module.css'

interface SearchbarProps {}

const Searchbar: FunctionComponent<SearchbarProps> = () => {
	return (
		<div id={styles['searchbar']} className='input'>
			<MagnifyingGlassIcon />
			<input type='text' name='search' placeholder='Search for anything' />
		</div>
	)
}

export default Searchbar
