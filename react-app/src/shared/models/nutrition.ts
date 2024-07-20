import React, { FunctionComponent, useState } from "react";
export interface Nutrition{
    _id: string,
    title: string,
    creatorId: string,
    creator?: any | any[],
    food: string[],
    description: string,
    calories: number,
    sugar: number,
    protein: number,
    carbs: number,
    fat: number,
    imageURL?: string,
    servings: number,
    
}
export const [nutritionPlan, setNutritionPlan] = useState<Nutrition>({
    _id: '',
    creatorId: '',
    title: '',
    description: '',
    food: [],
    calories: 0,
    sugar: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    servings: 0,
    imageURL: ''
    
})

export interface Ingredient{
    id: number,
    name: string
    
}
