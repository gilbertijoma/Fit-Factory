import { ObjectId } from 'mongodb'

export interface user {
	_id: ObjectId | string
	fname: string
	lname: string
	email: string
	password: string
	hfeet: number
	hinches: number
	weight: number
	type: 'trainer' | 'user'
	socials: Social[]
}

export interface Social {
	type: 'Facebook' | 'Twitter' | 'Instagram'
	link: string
}

export interface Session {
	_id: ObjectId
	user: ObjectId
	token: string
}
