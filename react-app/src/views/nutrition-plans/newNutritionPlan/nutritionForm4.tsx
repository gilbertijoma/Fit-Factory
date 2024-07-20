import { FunctionComponent, useState } from "react";
import defaults from "./newNutrition.module.css";
import { FormStepProps } from "./newNutrition";
import ImageURLInput from "shared/components/img-uploader/ImageURLInput";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
//import { newWorkoutForm } from "../workouts/workouts-new/NewWorkout";


const ThumbnailForm: FunctionComponent<FormStepProps> = ({ setCurrStep, currStep, setNewNutritionPlan, NewNutritionPlan }) => {
    const [imageURL, setImageURL] = useState<string | undefined>(NewNutritionPlan.imageURL);

    const onImgURLUpdated = (imgURL?: string) => {
        setImageURL(imgURL);
        setNewNutritionPlan(prev => {
            return {
                ...prev,
                imageURL: imgURL
            }
        })
    }

    return (
        <form className={`${defaults['form']} ${defaults['form2']}`} id="thumbnail-form">
            <div className={defaults['header']}>
                <p className={defaults['title']}>Yum, Looks Tasty!</p>
                <p className="subtitle">Enter the image URL food so that members can get interested in your nutrition plan.</p>
            </div>
            <div className={defaults['section']}>
                 <ImageURLInput onImageURLUpdated={onImgURLUpdated} imgURL={imageURL} name="URL" value ={''} /> 
            </div>
            <div className={defaults['actions']}>
                <button className="btn-secondary" type="button"
                 onClick={() => setCurrStep(currStep-1)}>
                    <ArrowLeftIcon />
                    Back
                </button>
                <button className="btn-primary" type="button"
                 onClick={() => setCurrStep(currStep+1)}>
                    {
                        imageURL ? 'Next' : 'Skip'
                    }
                    <ArrowRightIcon />
                </button>
            </div>
        </form>
    )
}

export default ThumbnailForm