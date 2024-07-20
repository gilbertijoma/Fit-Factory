// NutritionPlanCard.tsx

import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Nutrition } from 'shared/models/nutrition'
import styles from './nutrition-plan.module.css'
import facts from './nutritionFacts.module.css'
import { calculateCarbPercentDV, calculateFatPercentDV } from './nutritionPlanFunctions'
import { NavLink } from 'react-router-dom'
//import { createTheme } from '@mui/material/styles';
//import { ThemeProvider } from '@mui/material/styles';

interface NutritionPlanCardProps {
	nutritionPlan: Nutrition
	className?: string
}
const truncateString = (str: string, num: number) => {
	if (str.length <= num) {
	  return str;
	}
	return str.slice(0, num) + '...';
  };

const NutritionPlanCard: React.FC<NutritionPlanCardProps> = ({ nutritionPlan, className }) => {
	const truncatedDescription = truncateString(nutritionPlan.description, 200);
	return (
		<Card className={`${styles.card} ${styles.cardAni} ${className || ''}`}>
			<CardContent className={styles.flip_card_inner}>
				<CardContent className={styles.flip_card_front}>
					<img className={styles.image} src={nutritionPlan.imageURL} alt='thumbnail' />
					<div className={styles.words}>
						<Typography
							style={{
								color: '#111827',
								fontSize: '1.125Srem',
								lineHeight: '1.75rem',
								fontWeight: '600',
							}}>
							{nutritionPlan.title}
						</Typography>
						<Typography color='text.secondary'>{truncatedDescription}</Typography>
					</div>
				</CardContent>
				<CardContent className={styles.flip_card_back} style={{ fontFamily: 'sans-serif' }}>
					<section className={facts.performance_facts}>
						<header className={facts.performance_facts__header}>
							<h1 className={facts.performance_facts__title}>Nutrition Facts</h1>
							<p style={{ textAlign: 'left' }}>Servings: {nutritionPlan.servings}</p>
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
									<td></td>
								</tr>
								<tr className={facts.thick_row}>
									<td colSpan={3} className={facts.small_info} style={{ textAlign: 'right' }}>
										<b>% Daily Value*</b>
									</td>
								</tr>
								<tr>
									<th colSpan={2}>
										<b>Total Fat </b>
										{nutritionPlan.fat}g
									</th>
									<td style={{ textAlign: 'right' }}>
										<b>{calculateFatPercentDV(nutritionPlan.fat)}</b>
									</td>
								</tr>
								<tr>
									<th colSpan={2}>
										<b>Total Carbohydrate </b>
										{nutritionPlan.carbs}g
									</th>
									<td style={{ textAlign: 'right' }}>
										<b>{calculateCarbPercentDV(nutritionPlan.carbs)}</b>
									</td>
								</tr>
								<tr>
									<td className={facts.blank_cell}></td>
									<th>
										Sugars&nbsp;
										{nutritionPlan.sugar}g
									</th>
									<td></td>
								</tr>
								<tr className={facts.thick_end}>
									<th colSpan={2}>
										<b>Protein </b>
										{nutritionPlan.protein}g
									</th>
									<td></td>
								</tr>
							</tbody>
						</table>
						<NavLink to={`/nutrition/${nutritionPlan._id}`}>
							<button className={styles.button}>
								<span className={styles.button_content}>More Information</span>
							</button>
						</NavLink>
					</section>
				</CardContent>
			</CardContent>
		</Card>
	)
}

export default NutritionPlanCard
