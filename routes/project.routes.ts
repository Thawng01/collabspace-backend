import { Router } from "express";
import { createProject, deleteProject, getProjects, getProjectsByWorkspace, updateProject } from "../controllers/project.controller";


const router = Router()

router.post("/", createProject)
router.get("/", getProjects)
router.get("/:id", getProjectsByWorkspace)
router.put("/:id", updateProject)
router.delete("/:id", deleteProject)

export default router