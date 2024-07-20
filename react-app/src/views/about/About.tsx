import { FunctionComponent } from "react";
import styles from "./About.module.css";
import luxGymImage1 from './AboutImages/luxury_gym.jpg'
import luxGymImage2 from './AboutImages/luxury_gym_2.jpg'
import purposeImg from './AboutImages/purpose_pic.jpg'
import trainingImg from './AboutImages/barbell_lunge.jpg'
import rightArrow from './AboutImages/right-arrow.svg'
import foodImg from './AboutImages/healthy_meals.jpg'
import leftArrow from './AboutImages/left-arrow.svg'
import meditationImg from './AboutImages/meditation-coaching-1.webp'
import dwayneImg from './AboutImages/dwayne_johnson.png'
import chrisImg from './AboutImages/chris_hemsworth.png'
import blondeImg from './AboutImages/blonde_trainer.png'
import baldImg from './AboutImages/bald_beard.png'
import trainer5 from './AboutImages/trainer5.png'
import { NavLink } from "react-router-dom";




interface Props {

}

const About: FunctionComponent = () => {
    return (
        <div className={styles['about-container']}>
            <div className={styles["gymBanner"]}>
                <div>
                    <img src={luxGymImage1} alt="luxury gym" />
                </div>
                <div>
                    <img src={luxGymImage2} alt="luxury2 gym" />
                </div>
                <div className={styles["general"]}>
                    <h1>FIT-FACTORY<br /></h1>
                    <p>Workouts <br />
                        Nutriton <br />
                        Training <br />
                        Progress Monitor <br />
                        Wellness <br />
                        Health
                    </p>
                </div>
            </div>

            <div className={styles["whoAreWe"]}>
                <div className={styles["purpose_statement"]}>
                    <h1>PURPOSE</h1>
                    <br />
                    <p>
                        Fit-Factory strives to be the perfect supplement to your health and fitness goals.
                        We provide an easy-to-use interface for workout and nutrition tracking. 
                        Browse our set workout routines, or connect with
                        any of our top-notch trainers for a more personalized experience.
                        We are a one stop hub for workouts, training, nutrition, and lifestyle.
                    </p>
                </div>
                <div>
                    <img src={purposeImg} alt="3 fit people" />
                </div>
            </div>

            <div className={styles["training"]}>
                <div>
                    <img src={trainingImg} alt="guy doing a lunge" />
                </div>
                <div>
                    <h1>TRAINING</h1>
                    <br />
                    <p>
                        Transform your body, transform your life with our fitness app! Our app offers a personalized 
                        training experience like no other. With customizable workout plans and real-time feedback, you'll achieve your
                        fitness goals faster than ever before. 
                        From cardio to strength training, we've got you covered. Sign up now and become the best version of yourself!
                    </p>
                    <p>
                        <br />
                        <NavLink className={styles["view-workouts"]} to="/login">View Workouts<span className={styles["icon-right-arrow"]}> <img src={rightArrow} alt="right arrow" /></span></NavLink>
                    </p>
                </div>
            </div>

            <div className={styles["nutrition"]}>
                <div className={styles["nutrition-statement"]}>
                    <h1>NUTRITION</h1>
                    <br />
                    <p>
                    Get Fit, Eat Right, Feel Strong with our Nutrition Plans!
                    Achieve your fitness goals with our personalized nutrition plans.
                    Transform your body and your health with our science-backed meal plans.
                    From macronutrients to micronutrients, we've got you covered with our comprehensive nutrition programs.
                    </p>
                    <p>
                        <br />
                        <NavLink className={styles["view-recipes"]} to="/login"><span className={styles["icon-left-arrow"]}> <img src={leftArrow} alt="left arrows" /></span>View Recipes</NavLink>
                    </p>
                </div>
                <div>
                    <img src={foodImg} alt="random healthy meals" />
                </div>
            </div>

            <div className={styles["wellness"]}>
                <div>
                    <img src={meditationImg} alt="girl meditating" />
                </div>
                <div>
                    <h1>WELLNESS</h1>
                    <br />
                    <p>
                        Achieve wellness in every step with our fitness app!
                        Wellness made easy with our all-in-one fitness solution.
                        Transform your body and mind with our holistic wellness approach.
                        Experience the power of wellness at your fingertips with our fitness app.
                    </p>
                    <p>
                        <br />
                        <a className={styles["learn-more"]} href="">Learn More<span className={styles["icon-right-arrow"]}> <img src={rightArrow} alt="right arrow" /></span></a>
                    </p>
                </div>
            </div>

            <div className={styles["trainer-intro"]}>
                <h1>Meet our Factory models</h1>
                <br />
                <h2>A world-class team to guide and help you reach your goals</h2>
                <br />
            </div>

            <div className={styles["trainers-grid"]}>
                <img src={dwayneImg} alt="Trainer 1" />
                <img src={chrisImg} alt="Trainer 2" />
                <img src={baldImg} alt="Trainer 3" />
                <img src={blondeImg} alt="Trainer 4" />
                <img src={trainer5} alt="Trainer 5" />
            </div>
        </div>
    );
}

export default About;