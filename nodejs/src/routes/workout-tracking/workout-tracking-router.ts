import { Router } from "express";
import * as workoutTrackerDB from "./workout-tracking-db"
import { WorkoutTracker } from "./workout-tracking-model";
import sessionAuthMiddleware from "middleware/session-auth";

const router = Router();

router.use('*', sessionAuthMiddleware)

router.use('/*/:id', (req, res, next) => {
    const { id } = req.params

    if(id.length != 24){
        res.sendStatus(400)
        return
    }

    next()
})

router.get("/", (req, res) => {
    res.send("Workout completed")
})

export default router;