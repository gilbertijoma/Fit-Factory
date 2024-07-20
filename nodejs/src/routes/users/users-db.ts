import { InferIdType, ObjectId } from 'mongodb'
import client from 'mongodb/client'
import { Social, user } from './users-model'
import { webcrypto } from 'crypto'

const db = client.db()

export async function generateAuthToken() {
	let tokenUnique = false
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
	let result = ''

	while (!tokenUnique) {
		result = ''
		for (let i = 0; i < 10; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * characters.length)
			)
		}
		const AuthCollection = db.collection('userAuthentication')
		const checkAuthExists = await AuthCollection.findOne({ token: result })
		if (checkAuthExists == null) {
			tokenUnique = true
		}
	}

	return result
}

async function hash(password: string) {
	const utf8 = new TextEncoder().encode(password)
	const hashBuffer = await webcrypto.subtle.digest('SHA-256', utf8)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	const hashHex = hashArray
		.map((bytes) => bytes.toString(16).padStart(2, '0'))
		.join('')

	return hashHex
}

export async function createUser(userData: user) {
	try {
		console.log(userData)

		userData.password = await hash(userData.password)
		userData.socials = []
		
		const usersCollection = db.collection<user>('users')
		const result = await usersCollection.insertOne(userData)

		const authToken = await generateAuthToken()
		const AuthCollection = db.collection('userAuthentication')
		await AuthCollection.insertOne({
			user: result.insertedId,
			token: authToken,
		})

		return { id: result.insertedId, token: authToken }
	} catch (e) {
		console.log(e)
		return null
	}
}

//LOGIN TO ACCOUNT
export async function userLogin(userLogin: user) {
	try {
		const usersCollection = db.collection<user>('users')
		const email = userLogin.email
		const password = await hash(userLogin.password)
		console.log('PASSWORD: ' + password)
		const result = await usersCollection.findOne({
			email: email,
			password: password,
		})

		if (result == null) {
			console.log('no account found')
			return 'xxx'
		} else {
			console.log('ACCOUNT EXISTS')
			const authToken = await generateAuthToken()
			const AuthCollection = db.collection('userAuthentication')
			await removeAuthTokens(result._id)
			await AuthCollection.insertOne({
				user: result._id,
				token: authToken,
			})
			return authToken
		}
	} catch (e) {
		console.log(e)
		return null
	}
}

//Get user by id
export async function getUserById(userId: ObjectId | string) {
	const usersCollection = db.collection<user>('users')
	return await usersCollection.findOne(
		{ _id: new ObjectId(userId) },
		{ projection: { password: 0 } }
	)
}

//LOGOUT OF ACCOUNT
export async function userLogout(authToken: string) {
	try {
		const AuthCollection = db.collection('userAuthentication')
		return await AuthCollection.deleteOne({ token: authToken })
	} catch (e) {
		console.log(e)
		return null
	}
}

//REMOVE EXISTING USER TOKEN
export async function removeAuthTokens(userID: InferIdType<user>) {
	try {
		const AuthCollection = db.collection('userAuthentication')
		return await AuthCollection.deleteOne({ user: userID })
	} catch (e) {
		console.log(e)
		return null
	}
}

//query database to get an account by email, returns if is found
export async function getUserByEmail(email: string) {
	try {
		const usersCollection = db.collection<user>('users')
		const result = await usersCollection.findOne({ email: email })
		if (result == null) {
			console.log('no email found')
			return false
		} else {
			console.log('EMAIL EXISTS')
			return true
		}
	} catch (e) {
		console.log(e)
		return null
	}
}

export async function updateUserSocial(id: string, socials: Social[]) {
	try {
		const usersCollection = db.collection<user>('users')
		await usersCollection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{
				$set: { socials: socials },
			}
		)
	} catch (e) {
		console.log(e)
	}
}
