import { FunctionComponent } from "react";
import { FormStepProps } from "./newNutrition";
import defaults from "./newNutrition.module.css";
import styles from "./nutritionForm5.module.css";
import { ArrowLeftIcon, UploadIcon } from "@radix-ui/react-icons";
import { environment } from 'environment/environment';
import { NavLink } from "react-router-dom";



const SummaryForm: FunctionComponent<FormStepProps> = ({ NewNutritionPlan, currStep, setCurrStep, ingredients }) => {
    const { title, description, food, calories, sugar, protein, carbs, fat, imageURL } = NewNutritionPlan
    
    const getSrcFromBlob = (blob: Blob) => {
        return URL.createObjectURL(blob)
    }
    
    const publishWorkout = () => {
        const { baseUrl } = environment
        console.log(NewNutritionPlan);
        
        fetch(baseUrl + '/nutrition/add', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(NewNutritionPlan)
        })
        .then(res => res.json())
        .then(id => {
            console.log(id);
        })
        .catch(err => {
            console.log(err);
        })
    }


    return (
        <div className={defaults['form'] + ' ' + styles['summary-form']}>
            <div className={defaults['header']}>
                <p className={defaults['title']}>One Last Thing.</p>
                <p className="subtitle">This is your chance to review your nutrition plan and verify that everything
                is in order. <br /> Once you click the upload button, this nutrition plan will go live for any member
                to access.</p>
            </div>

            <div className={defaults['section'] + ' ' + styles['section']}>
                <div className={styles['info']}>
                    <p className="subtitle">Thumbnail:</p>
                    {
                        imageURL ? <img src={imageURL} id={styles['img']}/> : 'No Thumbnail Uploaded.'
                    }
                </div>
            </div>

            <div className={defaults['section'] + ' ' + styles['section']}>
                <div className={styles['info']}>
                    <p className="subtitle">Title:</p>
                    <p>{title}</p>
                </div>
                <div className={styles['info']} id={styles['description']}>
                    <p className="subtitle">Description:</p>
                    <textarea defaultValue={description} readOnly rows={5} cols={5}></textarea>
                </div>
            </div>

            <div className={defaults['section'] + ' ' + styles['section']} id={styles['exercises']}>
                <div className={styles['info']}>
                    <p className="subtitle">Ingredients ({ingredients.length}):</p>
                    <ul>
                       {
                        food.map( (element, idx) => (
                            <li className={ styles['routine']} key={idx}>
                                <p className={styles['ex-title']}>{element}</p>
                                
                            </li>
                        ))
                       } 
                    </ul>
                </div>
            </div>

            <div className={defaults['actions']}>
                <button className="btn-secondary" onClick={() => setCurrStep(currStep-1)}>
                    <ArrowLeftIcon />
                    Back
                </button>
                <NavLink to={`/nutrition`}>
                    <button className="btn-primary" id={styles['publish']} onClick={publishWorkout}>
                        Publish
                        <UploadIcon />
                    </button>
                </NavLink>
            </div>
    </div>
    )
}


 export default SummaryForm