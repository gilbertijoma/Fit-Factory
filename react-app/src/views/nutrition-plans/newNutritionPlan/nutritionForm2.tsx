import { ArrowLeftIcon, ArrowRightIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { FormStepProps } from "./newNutrition";
import defaults from "./newNutrition.module.css";
import styles from "./nutritionForm2.module.css";
import { Exercise, ExerciseType } from "shared/models/workout";
import {Ingredient} from "shared/models/nutrition"


 
interface ExerciseItem extends FormStepProps{
    ingredient: Ingredient,
}

const RoutineForm: FunctionComponent<FormStepProps> = (props) => {
    const {
      setCurrStep,
      currStep,
      NewNutritionPlan,
      setNewNutritionPlan,
      ingredients,
      setIngredients,
    } = props;
  
    const { food } = NewNutritionPlan;
  
    const newNutrition = () => {
      const newIngredient = {
        id: ingredients.reduce((id, s) => Math.max(id, s.id), 0) + 1,
        name: "New Ingredient",
      };
      setIngredients((prev) => [...prev, newIngredient]);
    };
  
    const handleNextClick = () => {
      const food = ingredients.map((ingredient) => ingredient.name);
      setNewNutritionPlan((prev) => {
        return { ...prev, food };
      });
      setCurrStep(currStep + 1);
    };
  
    return (
      <div className={defaults["form"]} id={styles["routine-form"]}>
        <div className={defaults["header"]}>
          <p className={defaults["title"]}>Ingredients.</p>
          <p className="subtitle">
            {" "}
            Add ingredients so that members know what they are eating.
          </p>
        </div>
        <div className={defaults["section"]} id={styles["exercises"]}>
          <h2>At least one ingredient is required.</h2>
          <button className="btn-primary" onClick={newNutrition}>
            Add Ingredient
          </button>
        </div>
        <hr />
        {
          <ul className={styles["routines"]}>
            {ingredients.map((e, idx) => (
              <RoutineListItem {...props} key={idx} ingredient={e} />
            ))}
          </ul>
        }
        <div className={defaults["actions"]}>
          <button
            className="btn-secondary"
            onClick={() => setCurrStep(currStep - 1)}
          >
            <ArrowLeftIcon />
            Back
          </button>
          <button
            className="btn-primary"
            disabled={ingredients.length < 1}
            onClick={handleNextClick}
          >
            Next
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    );
  };
  
  const RoutineListItem: FunctionComponent<ExerciseItem> = (props) => {
    const { ingredient } = props;
    const [isCollapsed, setIsCollapsed] = useState(false);
  
    return (
      <li
        className={
          styles["routine"] + " " + (isCollapsed ? styles["collapsed"] : "")
        }
      >
        <NewExercise {...props} />
      </li>
    );
  };
  

const NewExercise: FunctionComponent<ExerciseItem> = ({ ingredient, setNewNutritionPlan, setIngredients }) => {
    
    const [showConfirmation, setShowConfirmation] = useState(false);

    
    
    const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        const updatedIngredientName = ev.target.value;

        setIngredients(prev => {
            return prev.map(item => 
                item.id === ingredient.id ? { ...item, name: updatedIngredientName } : item);
        })
    }

    const removeExercise = () => {
        setIngredients(prev => prev.filter(item => item.id !== ingredient.id));
    

        setShowConfirmation(false);
    }


    const confirmation = (
        <div className={styles['confirm-remove']}>
            <p>Are you sure?</p>
            <button type="button" className={styles['cancel'] + ' btn-secondary'}
            onClick={() => setShowConfirmation(false)}>No, Cancel</button>
            <button type="button" className={styles['remove'] + ' btn-secondary'}
            onClick={removeExercise}>Yes, Remove</button>
        </div>
    )

    const removeBtn = (
        <button className={styles['remove-btn'] + ' btn-secondary'} type="button"
        onClick={() => setShowConfirmation(true)}>Remove</button>
    )
    

    return (
        <form className={styles['form2'] + ' ' + styles['new-exercise']}>
            {/* <div className={defaults['section']}> */}
                {/* <label htmlFor="title">Title</label> */}
                <input required type="text" name="title" id="title" placeholder="e.g, 3 cups of flour"
                value={ingredient.name}
                onChange={handleChange}/>
            {/* </div> */}

            

           

            <div className={defaults['section']} id={styles['remove']}>
                {
                    showConfirmation ? confirmation : removeBtn
                }
            </div>
        </form>
    )
}

export default RoutineForm