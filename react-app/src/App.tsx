import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './views/home/Home'
import NutritionPlans from 'views/nutrition-plans/nutrition-plans'
import NutritionPlan from 'views/nutrition-plans/nutrition-plan'
import CreateAccount from './views/account/CreateAccount'
import NewWorkout from './views/workouts/workouts-new/NewWorkout'
import PrivateLayout from 'layouts/private/PrivateLayout'
import PublicLayout from 'layouts/public/PublicLayout'
import LoginAccount from './views/account/LoginAccount'
import React, { useState } from 'react'
import { User } from 'shared/models/user'
import Dashboard from 'views/dashboard/Dashboard'
import Workouts from 'views/workouts/Workouts'
import NotFound from 'views/not-found/NotFound'
import WorkoutPage from 'views/workouts/workout-page/WorkoutPage'
import UserProfile from 'shared/components/user-profile/UserProfile'
import About from 'views/about/About'
import Features from 'views/features/Features'
import WorkoutTracking from 'views/workout-tracking/workout-tracking'
import NewNutrition from 'views/nutrition-plans/newNutritionPlan/newNutrition';






type UserContext = {
	user: User | undefined
	setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

export const UserContext = React.createContext<UserContext | undefined>(undefined)

export default function App() {
	const [user, setUser] = useState<User | undefined>(undefined)
	return (
		<UserContext.Provider value={{ user: user, setUser: setUser }}>
			<BrowserRouter>
				<Routes>
					<Route element={<PrivateLayout />}>
						<Route path='/dashboard' index element={<Dashboard />} />
						<Route path='/workouts/:id' element={<WorkoutPage />} />
						<Route path='/workouts' element={<Workouts showWorkouts />} />
						<Route path='/creators' element={<Workouts showCreators />} />
						<Route path='/workouts/new' element={<NewWorkout editMode={false} />} />
						<Route path='/workouts/:id/edit' element={<NewWorkout editMode={true} />} />
						<Route path='/creators/:id' element={<UserProfile />} />
						<Route path='/profile/:id' element={<UserProfile />} />
						<Route path='/nutrition' element={<NutritionPlans />} />
						<Route path='/nutrition/:id' element={<NutritionPlan />} />
						<Route path='/nutrition/new' element={ <NewNutrition editMode={false}/> } />
						<Route path='/tracking' element={<WorkoutTracking />} />
						<Route path='*' element={<NotFound />}></Route>
					</Route>

					<Route element={<PublicLayout />}>
						<Route path='/login' element={<LoginAccount />} />
						<Route path='/createaccount' element={<CreateAccount />} />
						<Route path='/about' element={<About />} />
						<Route path='/features' element={<Features />} />
						<Route path='/' index element={<Home />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</UserContext.Provider>
	)
}
