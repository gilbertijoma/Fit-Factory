
import React, { useEffect, useState, useRef } from "react";
import { environment } from "environment/environment";
import { Nutrition, nutritionPlan } from "shared/models/nutrition";
import styles from './nutrition-plan.module.css';
import { useParams } from 'react-router-dom';
import facts from './nutritionFacts.module.css';
import {calculateCarbPercentDV, calculateFatPercentDV} from './nutritionPlanFunctions';
import { TrashIcon, Pencil2Icon, UploadIcon } from '@radix-ui/react-icons'
import defaults from "./newNutritionPlan/newNutrition.module.css";
import { getFormValue } from "shared/utils/utils";
import ImageURLInput from "shared/components/img-uploader/ImageURLInput";
import { NavLink } from "react-router-dom";
import style from './nutritionSidebar.module.css';
const NutritionPlan: React.FC = () => {
    // const originalState = useRef<Nutrition>();
    const { id } = useParams();
    const baseUrl = environment.baseUrl;
    const [nutritionPlan, setNutritionPlan] = useState<Nutrition>({
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
    const [showNewSection, setShowNewSection] = useState(false);

    const handleUploadClick = () => {
        setShowNewSection(prevShowNewSection => !prevShowNewSection);
    };
    const handleDeleteClick = () => {
      if (window.confirm("Are you sure you want to delete?")) {
        // Your delete logic here
        fetch(baseUrl + `/nutrition/delete/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          
      })
      .then(res => res.json())
      .then(id => {
          console.log(id);
          
      })
      .catch(err => {
          console.log(err);
      })
      }
      
    };
    const handleImageURLUpdate = (newURL: string) => {
      setNutritionPlan((oldPlan) => ({
        ...oldPlan,
        imageURL: newURL,
      }));
    };
    const handleSubmit = () => {
      
      console.log(nutritionPlan);
        
        fetch(baseUrl + `/nutrition/update/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nutritionPlan)
        })
        .then(res => res.json())
        .then(id => {
            console.log(id);
            
        })
        .catch(err => {
            console.log(err);
        })
        window.location.reload();
    }
    const handleCancel = () => {
      window.location.reload();
    }

	useEffect(() => {
		fetch(baseUrl + `/nutrition/${id}`)
			.then((res) => res.json())
			.then((data) => setNutritionPlan(data))
	}, [])

    const MAX_CHARACTERS = 500
    const [charCount, setCharCount] = useState(MAX_CHARACTERS);

    const handleChange = () => {
        const data = getFormValue<{title: string, description: string, food: string[], calories: number
        sugars: number, protein: number, carbs: number, fat: number, imageURL: string, servings: number}>('basic-info-form')
        setImageURL(data.imageURL);
        setNutritionPlan({
            ...setNutritionPlan,
            title: data.title,
            description: data.description,
            food: nutritionPlan.food,
            calories: data.calories,
            sugar: data.sugars,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
            imageURL: nutritionPlan.imageURL,
            servings: data.servings,
            _id: nutritionPlan._id,
            creatorId: nutritionPlan.creatorId || ''

        })

        setCharCount(MAX_CHARACTERS - data.description.length)
    }
    const [imageURL, setImageURL] = useState<string | undefined>(nutritionPlan.imageURL);

    

    return (
        <div>
          {showNewSection ? (
            <div>
              {nutritionPlan ? (
                  <div className={styles.container4}>
                    <h2 className={styles.title2}>Edit Nutrition Plan</h2>
                    <form className={defaults['form']} id="basic-info-form">
                      <div className={defaults['section']}>
                        <label htmlFor="title" className="subtitle">Title</label>
                        <input required type="text" name="title" id={defaults['title']}
                        value={nutritionPlan.title} onChange={handleChange}/>
                      </div>
                      <div className={defaults['section']}>
                        <label htmlFor="description" className="subtitle">Description</label>
                        <textarea name="description" id={defaults['description']} cols={30} rows={7}
                        maxLength={MAX_CHARACTERS}
                        onChange={handleChange} value={nutritionPlan.description}></textarea>
                        <p className="subtitle"> {charCount} characters left</p>
                      </div>
                      <div className={defaults['form']} id={styles['details-form']}>
                        <div className={defaults['header']}>
                            <p className={defaults['title']}>Nutrition Facts.</p>
                            <p className="subtitle">Edit nutritional information.</p>
                        </div>
                        <div className={defaults['section']}>
                            <label htmlFor="calories" className="subtitle">Calories</label>
                            <input required type="number" name="calories" min="0" onChange={handleChange} value={nutritionPlan.calories}/>
                        </div>
                        <div className={defaults['section']}>
                            <label htmlFor="servings" className="subtitle">Servings</label>
                            <input required type="number" name="servings" min="0" onChange={handleChange} value={nutritionPlan.servings}/>
                        </div>
                        <div className={defaults['section']}>
                            <label htmlFor="carbohydraytes" className="subtitle">Total Carbohydraytes</label>
                            <input required type="number" name="carbs" min="0" onChange={handleChange} value={nutritionPlan.carbs}/>
                        </div>
                        <div className={defaults['section']}>
                            <label htmlFor="fat" className="subtitle">Total Fat</label>
                            <input required type="number" name="fat" min="0" onChange={handleChange} value={nutritionPlan.fat}/>
                        </div>
                        <div className={defaults['section']}>
                            <label htmlFor="protein" className="subtitle">Protien</label>
                            <input required type="number" name="protein" min="0" onChange={handleChange} value={nutritionPlan.protein}/>
                        </div>
                        <div className={defaults['section']}>
                            <label htmlFor="sugars" className="subtitle">Sugars</label>
                            <input required type="number" name="sugars" min="0" onChange={handleChange} value={nutritionPlan.sugar}/>
                        </div>
                      </div>
                      <div className={defaults['form']} id="thumbnail-form">
                        <div className={defaults['header']}>
                            <p className={defaults['title']}>Change Photo.</p>
                            <p className="subtitle">Edit the URL of the prepared food image. </p>
                        </div>
                        <div className={defaults['section']}>
                            <ImageURLInput onImageURLUpdated={handleImageURLUpdate} name ="imageURL" imgURL={imageURL} value={nutritionPlan.imageURL || ''} /> 
                        </div>
                        
                      </div>
                      <div className={defaults['actions']}>
                          <button className="btn-secondary" type="button"
                          onClick={handleCancel}>
                              
                              Cancel
                          </button>
                          <button className="btn-primary" type="button"
                          onClick={handleSubmit}>
                             Submit
                          </button>
                        </div>
                    </form>
                  </div>
                  ) : (
                    <div></div>
                  )}
            </div>
              ) : (
            <div className={styles.container2}>
              {nutritionPlan ? (
                <div>
                  <div className={styles.actions}>
                        <button className="btn-primary " onClick={handleUploadClick} style={{ width:'150px' }}>
                          Edit
                        <Pencil2Icon  />
                        </button>
                        <NavLink to='/nutrition'>
                          <button className="btn-secondary" onClick={handleDeleteClick} style={{ width:'150px', color:'red' }}>
                            Delete
                            <TrashIcon  />
                          </button>
                        </NavLink>
                      </div>
                  <div className={styles.title2}>
                      <h2>{nutritionPlan.title}</h2>
                      
                  </div>
                  
                <div className={styles.container3}>
                  
                  <div className={styles.content}>
                    
                    <p className={styles.description}> {nutritionPlan.description}</p>
                    <img className={styles.image2} src ={nutritionPlan.imageURL}  alt="" />
                      <div className={styles.cont}>
                        <div className = {styles.ingredients}>
                          <h2 className = {styles.title3}>Ingredients</h2>
                          <ul className ={styles.ingredients2}>
                            {nutritionPlan.food.map((ingredient, ingredientIndex) =>(
                              <li key={ingredientIndex}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        <div className={styles.nutritionFacts}>
                          <section className={facts.performance_facts}  >
                            <header className={facts.performance_facts__header}>
                              <h1 className={facts.performance_facts__title}  >Nutrition Facts</h1>
                              <p style={{textAlign: 'left'}}>Servings: {nutritionPlan.servings}</p>
                            </header>
                              <table className={facts.performance_facts__table}>
                                <thead>
                                  <tr>
                                    <th colSpan={3} className={facts.small_info}>
                                      Amount Per Serving
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th colSpan={2}>
                                      <b>Calories </b>
                                      {nutritionPlan.calories}
                                    </th>
                                    <td>
                                    </td>
                                  </tr>
                                  <tr className={facts.thick_row}>
                                    <td colSpan={3} className={facts.small_info} style={{textAlign: 'right'}}>
                                      <b>% Daily Value*</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th colSpan={2}>
                                      <b>Total Fat </b>
                                      {nutritionPlan.fat}g
                                    </th>
                                    <td style={{textAlign: 'right'}}>
                                      <b>{calculateFatPercentDV(nutritionPlan.fat)}</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th colSpan={2}>
                                      <b>Total Carbohydrate </b>
                                      {nutritionPlan.carbs}g
                                    </th>
                                    <td style={{textAlign: 'right'}}>
                                      <b>{calculateCarbPercentDV(nutritionPlan.carbs)}</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className={facts.blank_cell}>
                                    </td>
                                    <th>
                                      Sugars&nbsp; 
                                      {nutritionPlan.sugar}g
                                    </th>
                                    <td>
                                    </td>
                                  </tr>
                                  <tr className={facts.thick_end}>
                                    <th colSpan={2}>
                                      <b>Protein </b>
                                        {nutritionPlan.protein}g
                                    </th>
                                    <td>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <p className="small-info" style={{color: 'black'}}>* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.</p>

                          </section>
                        </div>
                      </div>
                  </div>
                </div>
              </div>  
              ) : (
                <div></div>
                
              )}
            
          </div>
              )}
          
        </div>
      );
      
    
    




};



export default NutritionPlan
