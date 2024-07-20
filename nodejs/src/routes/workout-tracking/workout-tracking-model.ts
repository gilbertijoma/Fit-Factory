import { ObjectId } from "mongodb";

export interface WorkoutTracker{
    _id: ObjectId,
    workout_id: ObjectId,
    title: string,
    description: string,
    days: number
}