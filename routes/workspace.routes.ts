import { Router } from "express";
import {
  createWorkspace,
  createWorkspaceHandler,
  deleteWorkspace,
  getWorkspaceName,
  getWorkspaces,
  updateWorkspace,
} from "../controllers/workspace.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", auth, getWorkspaces);
router.post("/", auth, createWorkspaceHandler);
router.get("/name", auth, getWorkspaceName);
router.delete("/:id", auth, deleteWorkspace);
router.put("/:id", auth, updateWorkspace);

export default router;
