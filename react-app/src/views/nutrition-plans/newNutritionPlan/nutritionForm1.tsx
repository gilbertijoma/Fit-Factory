import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { FunctionComponent, useState } from "react";
import { FormStepProps } from "./newNutrition";
import { getFormValue } from "shared/utils/utils";

import defaults from "./newNutrition.module.css";

/**
 * Form for workout title and description
 */
const TitleDescForm: FunctionComponent<FormStepProps> = ({ NewNutritionPlan, setNewNutritionPlan, currStep, setCurrStep }) => {
    
    const MAX_CHARACTERS = 500
    const [charCount, setCharCount] = useState(MAX_CHARACTERS);

    const handleChange = () => {
        const data = getFormValue<{title: string, description: string}>('basic-info-form')

        setNewNutritionPlan({
            ...NewNutritionPlan,
            title: data.title,
            description: data.description,
        })

        setCharCount(MAX_CHARACTERS - data.description.length)
    }

    return ( 
        <form className={defaults['form']} id="basic-info-form">
            <div className={defaults['header']}>
                <p className={defaults['title']}>New Nutrition Plan</p>
                <p className="subtitle">We just need some basic information to get you started.</p>
            </div>
            <div className={defaults['section']}>
                <label htmlFor="title" className="subtitle">Title</label>
                <input required type="text" name="title" id={defaults['title']}
                placeholder="e.g, Protien pancakes..." value={NewNutritionPlan.title}
                onChange={handleChange}/>
            </div>
            <div className={defaults['section']}>
                <label htmlFor="description" className="subtitle">Description</label>
                <textarea name="description" id={defaults['description']} cols={30} rows={7}
                
                maxLength={MAX_CHARACTERS}
                onChange={handleChange}></textarea>
                <p className="subtitle"> {charCount} characters left</p>
            </div>
            <div className={defaults['actions']}>
                <button className="btn-secondary" disabled>
                    <ArrowLeftIcon />
                    Back
                </button>
                <button className="btn-primary"
                 onClick={() => setCurrStep(currStep+1)}
                 disabled={!NewNutritionPlan.title.trim().length || !NewNutritionPlan.description.trim().length}>
                    Next
                    <ArrowRightIcon />
                </button>
            </div>
        </form>
    )
}

export default TitleDescForm