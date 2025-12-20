import { Router } from "express";
import { addMemberInWorkspace, getMembersByWorkspace, removeMemberFromWorkspace } from "../controllers/members.controller";
import { auth } from "../middleware/auth";

const router = Router()

router.post("/", auth, addMemberInWorkspace)
router.post("/remove", auth, removeMemberFromWorkspace)
router.get("/:id", auth, getMembersByWorkspace)

export default router