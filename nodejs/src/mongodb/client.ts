import { MongoClient } from 'mongodb'

const connectionString =
	'mongodb+srv://gilbert:fitnessapp123@fitnessapp.1sdhepc.mongodb.net/?retryWrites=true&w=majority'

/* Use this client for interacting with the DB*/
const client = new MongoClient(connectionString)

export default client
