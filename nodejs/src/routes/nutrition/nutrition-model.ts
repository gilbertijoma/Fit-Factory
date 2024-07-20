import { ObjectId } from 'mongodb'

export interface Nutrition{
    _id: ObjectId,
    title: string,
    creatorId?: ObjectId | string,
    creator?: any | any[],
    description: number,
    food: string[],
    calories: number,
    sugar: number,
    protein: number,
    carbs: number,
    fat: number,
    servings: number,
    imageURL?: string
    
}
