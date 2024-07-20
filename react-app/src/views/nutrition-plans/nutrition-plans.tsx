// NutritionPlans.tsx
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import NutritionPlanCard from 'views/nutrition-plans/NutritionPlanCard'
import { Nutrition } from 'shared/models/nutrition'
import { environment } from 'environment/environment'
import styles from './nutrition-plan.module.css'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'
import NutritionSidebar from './nutritionSidebar'
import './nutritionSidebar.module.css'

const NutritionPlans: React.FC = () => {
	const baseUrl = environment.baseUrl
	const [nutritionPlans, setNutritionPlans] = useState<Nutrition[]>([])
	const [sortBy, setSortBy] = useState<keyof Nutrition | 'none'>('none')

	const handleSortChange = (property: keyof Nutrition | 'none') => {
		setSortBy(property)
	}

	useEffect(() => {
		fetch(baseUrl + '/nutrition/all')
			.then((res) => res.json())
			.then((data) => setNutritionPlans(data))
	}, [])
	const theme = createTheme({
		components: {
			MuiGrid: {
				styleOverrides: {
					root: {
						// replace with your desired CSS rule
					},
				},
			},
			MuiCardContent: {
				styleOverrides: {
					root: {
						// replace with your desired CSS rule
						paddingBottom: '0px',
						padding: '0px',
						boxSizing: 'border-box',
					},
				},
			},
			MuiCard: {
				styleOverrides: {
					root: {
						borderRadius: '10px', // replace with your desired CSS rule
						padding: '0px',
						boxSizing: 'border-box',
					},
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						// replace with your desired CSS rule
						padding: '0px',
						backgroundColor: 'transparent',
						boxShadow: 'none',
						boxSizing: 'border-box',
					},
				},
			},
			MuiTypography: {
				styleOverrides: {
					root: {
						// replace with your desired CSS rule
						padding: '0px',
					},
				},
			},
		},
	})

             
             

  

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
      <NutritionSidebar onSortChange={handleSortChange} />

      </div>
      <main className={styles.main}>
        <h2 className={styles._title}>Nutrition Plans</h2>
        <Grid className={styles.grid} container spacing={2}>
          {nutritionPlans
            .sort((a, b) => {
              if (sortBy === "none") {
                return 0;
              }
              let order = b[sortBy] - a[sortBy];
              if (sortBy === "sugar" || sortBy === "fat") {
                order = -order;
              }
              return order;
            })
            .map((nutritionPlan) => (
              <ThemeProvider theme={theme} key={nutritionPlan._id}>
                <Grid className={styles.grid}>
                  <NutritionPlanCard className={styles.cardAni} nutritionPlan={nutritionPlan} />
                </Grid>
              </ThemeProvider>
            ))}
        </Grid>
      </main>
    </div>
  );
  
};



export default NutritionPlans
