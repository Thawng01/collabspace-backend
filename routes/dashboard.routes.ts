import { Router } from "express";
import { getDashboardProjectsOverview, getDashboardTaskOverview, getDashboardTaskWeeklyOverview, getStatsCard } from "../controllers/dashboard.controller";
import { auth } from "../middleware/auth";

const router = Router()

router.get("/", auth, getStatsCard)
router.get("/projects", auth, getDashboardProjectsOverview)
router.get("/task/overview", auth, getDashboardTaskOverview)
router.get("/task/weekly/overview", auth, getDashboardTaskWeeklyOverview)

export default router