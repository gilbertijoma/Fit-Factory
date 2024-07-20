import { environment } from "environment/environment";
import { FunctionComponent, useEffect, useState } from 'react';
import React from "react";
import styles from "./workout-tracking.module.css";
import { Workout } from "shared/models/workout";
import WorkoutService from "shared/services/WorkoutService";
import Spinner from "shared/components/Spinner/Spinner";
import WorkoutTimeline from "./workout-timeline";


interface SelectableWorkoutProps{
    workout: Workout
    setWorkout: React.Dispatch<React.SetStateAction<Workout | undefined>>
}

const SelectableWorkout: FunctionComponent<SelectableWorkoutProps> = ({ workout, setWorkout }) => {
    const { title, exercises, creator } = workout

    return (
        <li className={styles['selectable-workout'] + ' card'}>
            <h2>{title}</h2>
            <p>Created By {creator.fname} {creator.lname}</p>
            <p>{exercises.length} exercises</p>
            <button className="btn-primary" 
            onClick={() => setWorkout(workout)}>Track</button>
        </li>
    )
}

const WorkoutTracking: FunctionComponent = () => {
    const { baseUrl } = environment
    const [loading, setloading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [selectedWorkout, setSelectedWorkout] = useState<Workout | undefined>(undefined);
    const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
        setloading(true)

        WorkoutService
        .getAllWorkouts()
        .then(workouts => setAllWorkouts(workouts))
        .catch(() => setIsError(true))
        .finally(() => setloading(false))
    }, [])

    if(loading){
        return <Spinner />
    }

    if(selectedWorkout){
        return (
            <WorkoutTimeline workout={selectedWorkout} />
        )
    }

    return (
        <div className={styles['container']}>
            <h1>Select a Workout to Track</h1>
            <div className={styles['select-workout']}>
                {
                    allWorkouts.map((w, idx) => {
                        return (
                            <SelectableWorkout workout={w} setWorkout={setSelectedWorkout} key={idx}/>
                        )
                    })
                }
            </div>
        </div>
    );
}
export default WorkoutTracking