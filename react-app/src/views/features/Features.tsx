import { FunctionComponent } from "react";
import styles from "./Features.module.css";
import FFImage1 from './FeatureImages/FFImage1.jpeg'
import FFImage2 from './FeatureImages/FFImage2.webp'
import FFImage3 from './FeatureImages/FFImage3.jpeg'

interface Props {

}
 
const Features: FunctionComponent = () => {
    return (
  <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.heading}>Features</h2>
      </div>
      <img src={FFImage1} alt="Feature 1" className={styles.image} />

      <div className={styles.section}>
        <h2 className={styles.heading}>Workout Plan</h2>
        <p className={styles.description}>At Fit-Factory, we develop a workout plan specifically for each member. This workout plan will be created by our amazing 
            instructors and will work towards the goals of the member. You will be able to talk to our instructors throughout the plan
            to help find what is and is not working for you. </p>
      </div>
      <img src={FFImage2} alt="Feature 2" className={styles.image} />

      <div className={styles.section}>
        <h2 className={styles.heading}>Nutrition Plan</h2>
        <p className={styles.description}>Along with the workout plan, Fit-Factory will also generate a nutrition plan that fits perfectly int
            the workout plan. The nutrition plan will be made to make sure you gaining muscle, losing fat, and making
            sure your body is energized for the next workout..</p>
      </div>
      <img src={FFImage3} alt="Feature 3" className={styles.image} />

      <div className={styles.section}>
        <h2 className={styles.heading}>Workout Tracking</h2>
        <p className={styles.description}> On the Fit-Factory app, users will be able to track their workouts and see their progression.
            You will be able to see the improvemnts you hvae made to your workouts, how far you have come 
            and the goals you hva e reached. Your nutrition plan will also be tracked here so you know how your diet is going.</p>
      </div>
      <img src={FFImage1} alt="Feature 4" className={styles.image} />
    </div>
  );
}
 
export default Features ;
