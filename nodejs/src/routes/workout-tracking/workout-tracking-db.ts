import { DeleteResult, ObjectId, UpdateResult, Document } from 'mongodb'
import client from 'mongodb/client'
import { WorkoutTracker } from './workout-tracking-model'
const db = client.db()

const pipeline = [
    { "$addFields": { "userId": {"$toObjectId": "$creatorId"} } },
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "creator"
        }
    }
]

