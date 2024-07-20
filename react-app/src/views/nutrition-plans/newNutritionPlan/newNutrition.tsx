import React, { FunctionComponent, useState } from "react";
import FormProgress from "shared/components/form-progess/FormProgress";
import styles from "./newNutrition.module.css";
import TitleDescForm from "./nutritionForm1";
import RoutineForm from "./nutritionForm2";
import DetailsForm from "./nutritionForm3";
import ThumbnailForm from "./nutritionForm4";
import SummaryForm from "./nutritionForm5";

interface NewNutritionProps {
    editMode: boolean
}
interface Ingredient{
    id: number,
    name: string
}
export interface NewNutritionPlan{
    title: string,
    description: string,
    food: string[],
    calories: number,
    sugar: number,
    protein: number,
    carbs: number,
    fat: number,
    servings: number,
    imageURL?: string
}

export interface FormStepProps{
    NewNutritionPlan: NewNutritionPlan,
    setNewNutritionPlan: React.Dispatch<React.SetStateAction<NewNutritionPlan>>,
    currStep: number,
    setCurrStep: React.Dispatch<React.SetStateAction<number>>,
    Ingredient: Ingredient,
    setIngredient: React.Dispatch<React.SetStateAction<Ingredient>>
    ingredients: Ingredient[]
    setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>
}

const NewNutrion: FunctionComponent<NewNutritionProps> = (props) => {
    const [NewNutritionPlan, setNewNutritionPlan] = useState<NewNutritionPlan>({
        title: '',
        description: '',
        food: [],
        calories: 0,
        sugar: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        servings: 0
        
    })
    
    const [currStep, setCurrStep] = useState(1);
    const [Ingredient, setIngredient] = useState<Ingredient>({ id: 0, name: '' });
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    const formSteps = [
        'General Information',
        'Ingredients',
        'Nutritional Information',
        'Thumbnail',
        'Finish',
    ]

    /**
     * Will return the appropriate form component given the provided step
     * @param step Current Step
     * @returns The appropriate form that corresponds to the step parameter
     */
    const getCurrentStepForm = (step: number) => { 
        const props: FormStepProps = {NewNutritionPlan, setNewNutritionPlan, currStep, setCurrStep, Ingredient, setIngredient, ingredients, setIngredients}

        switch(step){
            case 1:
                return <TitleDescForm {...props} />
            case 2:
                return <RoutineForm {...props} />
            case 3:
                return <DetailsForm {...props} />
            case 4:
                return <ThumbnailForm {...props} />
            case 5:
                return <SummaryForm {...props} />
        }
    }
    
    const completedSteps = new Array(currStep-1).fill(0).map( (_, idx) => idx+1)
    
    return(
        <div className={styles['container']}>
            <div id={styles['progress']}>
                <FormProgress 
                    steps={formSteps}
                    currentStep={currStep}
                    completed={completedSteps}
                    onStepClicked={e => setCurrStep(e)}/>
            </div>
            { getCurrentStepForm(currStep) }
        </div>
           
    )
}
 
export default NewNutrion;