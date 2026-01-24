import { Router } from "express";
import { getRoles } from "../controllers/role.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", auth, getRoles);

export default router;
