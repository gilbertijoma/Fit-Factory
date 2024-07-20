import client from 'mongodb/client'
import { user as User } from '@routes/users/users-model'

const db = client.db()

export async function getAllCreators(): Promise<User[]> {
	const creators = db.collection<User>('users')

	const cursor = creators.find<User>(
		{ type: 'trainer' },
		{
			projection: { password: 0 },
		}
	)

	return await cursor.toArray()
}
