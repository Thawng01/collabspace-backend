import { Router } from "express";
import { createWorkspace, deleteWorkspace, getWorkspaces, updateWorkspace } from "../controllers/workspace.controller";
import { auth } from "../middleware/auth";

const router = Router()

router.post("/", auth, createWorkspace)
router.get("/", auth, getWorkspaces)
router.delete("/:id", auth, deleteWorkspace)
router.put("/:id", auth, updateWorkspace)

export default router