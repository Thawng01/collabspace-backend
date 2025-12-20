import { Router } from "express";
import { getAllTaskActivities, getTaskActivities } from "../controllers/activity.controller";


const router = Router()

router.get("/", getAllTaskActivities)
router.get("/recent/:id", getTaskActivities)

export default router