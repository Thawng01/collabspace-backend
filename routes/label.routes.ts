import { Router } from "express";
import { createLabel, getLabelByWorkspace } from "../controllers/label.controller";


const router = Router()

router.get("/:workspaceId", getLabelByWorkspace)
router.post("/", createLabel)

export default router