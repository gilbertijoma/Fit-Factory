import { ReactElement } from 'react'

/** Props for icon components */
export interface IconProps {
	(props: { id?: string; className?: string }): ReactElement<any, any>
}
