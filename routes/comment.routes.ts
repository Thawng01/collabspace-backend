

import { Router } from "express";
import { createCommnet, getTaskComments } from "../controllers/comment.controller";

const router = Router()

router.get("/:id", getTaskComments)
router.post("/", createCommnet)


export default router