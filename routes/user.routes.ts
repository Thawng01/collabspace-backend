import { Router } from "express";
import { createNewUser, getAllUsers, getMe, updateInfo, updatePassword } from "../controllers/user.controller";
import { auth } from "../middleware/auth";

const router = Router()

router.post("/", createNewUser)
router.get("/me", auth, getMe)
router.get("/all", auth, getAllUsers)
router.put("/update/:id", auth, updateInfo)
router.put("/password/:id", auth, updatePassword)

export default router