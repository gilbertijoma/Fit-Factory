import { FunctionComponent } from "react";
import { Exercise, Workout } from "shared/models/workout";
import styles from './workout-tracking.module.css'

interface WorkoutTimelineProps {
    workout: Workout
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDates(current: Date) {

    var week: Date[] = []; 
    // Starting Monday not Sunday
    current.setDate((current.getDate() - current.getDay()));
    for (var i = 0; i < 7; i++) {
        week.push( new Date(current) );
        current.setDate(current.getDate() + 1)
    }

    return week
}

const WeekTimeLine = () => {
    const today = new Date()
    const dates = getDates(today)

    return (
        <ul className={styles['dates']}>
            {
                dates
                .map((d, idx) => (
                    <li className={styles['date'] + ' card ' + ((d.getDay() === today.getDay()) ? styles['today'] : '')} key={idx}>
                        <span>{dayNames[d.getDay()]}</span>
                        <span>{d.toLocaleDateString()}</span>
                    </li>
                ))
            }
        </ul>
    )
}

const ExerciseTracker = ({ reps, sets, title, type }: Exercise) => {
    return (
        <div className={styles['exercise'] + ' card'}>
            <h2>{title}</h2>
            <p>{reps} reps</p>
            <p>{sets} sets</p>
            <p>{type}</p>
            <button className="btn-secondary">Mark as Completed</button>
        </div>
    )
}

const WorkoutTimeline: FunctionComponent<WorkoutTimelineProps> = ({ workout }) => {
    return ( 
        <div className={styles['timeline']}>
            <WeekTimeLine />
            {
                workout.exercises.map((e, idx) => (
                    <ExerciseTracker key={idx} {...e} />
                ))
            }
        </div>
    );
}
 
export default WorkoutTimeline;