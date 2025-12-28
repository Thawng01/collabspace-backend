import { Router } from "express";
import { createTask, deleteTask, editTask, getTaskDetail, getTasks, getTasksByColumn, updateColumnTask, updateTaskDescription, updateTaskPriority, updateTaskStatus } from "../controllers/task.controller";

const router = Router()

router.get("/index/:id", getTasks)
router.get("/details/:id", getTaskDetail)
router.get("/:id", getTasksByColumn)
router.post("/", createTask)
router.put("/update-task", updateColumnTask)
router.put("/:id", editTask)
router.put("/update-description/:id", updateTaskDescription)
router.put("/update-priority/:id", updateTaskPriority)
router.put("/update-status/:id", updateTaskStatus)
router.delete("/:id", deleteTask)
export default router