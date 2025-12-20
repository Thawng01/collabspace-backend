import { Router } from "express";
import { createProject, deleteProject, getProjects, updateProject } from "../controllers/project.controller";


const router = Router()

router.post("/", createProject)
router.get("/", getProjects)
router.put("/:id", updateProject)
router.delete("/:id", deleteProject)

export default router