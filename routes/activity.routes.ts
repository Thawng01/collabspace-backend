import { Router } from "express";
import { getAllTaskActivitiesByTask, getTaskActivities } from "../controllers/activity.controller";


const router = Router()

router.get("/:id", getAllTaskActivitiesByTask)
router.get("/recent/:id", getTaskActivities)

export default router