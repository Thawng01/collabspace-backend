import { Router } from "express";
import { addColumn, deleteColumn, editColumn, getColumns } from "../controllers/column.controller";

const router = Router()

router.post("/", addColumn)
router.get("/:id", getColumns)
router.put("/:id", editColumn)
router.delete("/:id", deleteColumn)



export default router