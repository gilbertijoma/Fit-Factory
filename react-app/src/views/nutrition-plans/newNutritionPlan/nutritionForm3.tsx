import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons"
import { FunctionComponent } from "react"
import { FormStepProps } from "./newNutrition";
import defaults from "./newNutrition.module.css"
import styles from "./nutritionForm3.module.css"



/**
 * Form for workout calorie, fat, and carb details
 */
const DetailsForm: FunctionComponent<FormStepProps> = ({setCurrStep, currStep, NewNutritionPlan, setNewNutritionPlan}) => {

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        setNewNutritionPlan({
          ...NewNutritionPlan,
          [event.target.name]: event.target.value,
        });
      }

    return (
        <form className={defaults['form']} id={styles['details-form']}>
            <div className={defaults['header']}>
                <p className={defaults['title']}>Nutrition Facts.</p>
                <p className="subtitle">Include additional nutritional information.</p>
            </div>
            <div className={defaults['section']}>
                <label htmlFor="calories" className="subtitle">Calories</label>
                <input required type="number" name="calories" min="0" onChange={handleChange} value={NewNutritionPlan.calories}/>
            </div>
            <div className={defaults['section']}>
                <label htmlFor="servings" className="subtitle">Servings</label>
                <input required type="number" name="servings" min="0" onChange={handleChange} value={NewNutritionPlan.servings}/>
            </div>
            <div className={defaults['section']}>
                <label htmlFor="carbohydraytes" className="subtitle">Total Carbohydraytes</label>
                <input required type="number" name="carbs" min="0" onChange={handleChange} value={NewNutritionPlan.carbs}/>
            </div>
            <div className={defaults['section']}>
                <label htmlFor="fat" className="subtitle">Total Fat</label>
                <input required type="number" name="fat" min="0" onChange={handleChange} value={NewNutritionPlan.fat}/>
            </div>
            <div className={defaults['section']}>
                <label htmlFor="protein" className="subtitle">Protien</label>
                <input required type="number" name="protein" min="0" onChange={handleChange} value={NewNutritionPlan.protein}/>
            </div>
            <div className={defaults['section']}>
                <label htmlFor="sugars" className="subtitle">Sugars</label>
                <input required type="number" name="sugar" min="0" onChange={handleChange} value={NewNutritionPlan.sugar}/>
            </div>
            <div>
            
            </div>
            <div className={defaults['actions']}>
                <button className="btn-secondary" onClick={() => setCurrStep(currStep-1)}>
                    <ArrowLeftIcon />
                    Back
                </button>
                <button className="btn-primary" onClick={() => setCurrStep(currStep+1)}>
                    Next
                    <ArrowRightIcon />
                </button>
            </div>
            
        </form>
    )
}

export default DetailsForm