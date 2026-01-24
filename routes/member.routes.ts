import { Router } from "express";
import {
  addMemberInWorkspace,
  getAllMembers,
  getMembersByWorkspace,
  removeMemberFromWorkspace,
} from "../controllers/members.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", auth, getAllMembers);
router.post("/", auth, addMemberInWorkspace);
router.post("/remove", auth, removeMemberFromWorkspace);
router.get("/:id", auth, getMembersByWorkspace);

export default router;
