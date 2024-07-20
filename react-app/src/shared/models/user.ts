export interface User {
	_id: string
	fname: string
	lname: string
	email: string
	password: string
	hfeet: number
	hinches: number
	weight: number
	imgUrl?: string
	fitnessGoals: string[]
	type: UserType
	socials: Social[]
}

export interface Social {
	type: 'Facebook' | 'Twitter' | 'Instagram'
	link: string
}

export type UserType = 'regular' | 'trainer'
