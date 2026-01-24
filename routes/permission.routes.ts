import { Router } from "express";

const router = Router();

import {
  getPermissions,
  updateMultiPermissions,
  updatePermissionOnlyRead,
  updateSinglePermission,
} from "../controllers/permission.controller";
import { auth } from "../middleware/auth";

router.get("/:roleId/permissions", auth, getPermissions);
router.put("/permissions/update", auth, updateSinglePermission);
router.put("/permissions/multi-permissions", auth, updateMultiPermissions);
router.put(
  "/permissions/readonly/:workspaceId",
  auth,
  updatePermissionOnlyRead,
);

export default router;
