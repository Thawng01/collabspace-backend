import { Router } from "express";
import { getDashboardProjectsOverview, getStatsCard } from "../controllers/dashboard.controller";
import { auth } from "../middleware/auth";

const router = Router()

router.get("/", auth, getStatsCard)
router.get("/projects", auth, getDashboardProjectsOverview)

export default router