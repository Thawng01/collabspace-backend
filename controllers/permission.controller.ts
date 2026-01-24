import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { aw } from "react-router/dist/development/routeModules-BmVo7q9e";
// import {
//   groupPermissionsByCategoryAsObject,
//   Permission,
// } from "../utils/permission";

interface Permission {
  id: string;
  roleId: string;
  permission: string;
  allowed: boolean;
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
}

// Grouped permission result structure
interface RoleWithGroupedPermissions {
  roleId: string;
  roleName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  permissionsByCategory: {
    [category: string]: Permission[];
  };
}

interface GroupedRolesResult {
  [roleName: string]: RoleWithGroupedPermissions;
}

function groupPermissionsByCategory(roles: Role[]): GroupedRolesResult {
  const result: GroupedRolesResult = {};

  roles.forEach((role) => {
    const permissionsByCategory: { [category: string]: Permission[] } = {};

    // Group permissions by their category
    role.permissions.forEach((permission) => {
      const [category] = permission.permission.split(":");

      if (!permissionsByCategory[category]) {
        permissionsByCategory[category] = [];
      }

      // Push the entire permission object with all properties
      permissionsByCategory[category].push({
        id: permission.id,
        permission: permission.permission,
        allowed: permission.allowed,
        roleId: permission.roleId,
        createdAt: permission.createdAt,
        // Include any other permission properties you might have
      });
    });

    // Sort categories alphabetically
    const sortedPermissionsByCategory: { [category: string]: Permission[] } =
      {};
    Object.keys(permissionsByCategory)
      .sort()
      .forEach((key) => {
        sortedPermissionsByCategory[key] = permissionsByCategory[key];
      });

    // Create the role object with all metadata
    result[role.name] = {
      roleId: role.id,
      roleName: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissionsByCategory: sortedPermissionsByCategory,
    };
  });

  return result;
}

export const getPermissions = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  try {
    const user = res.locals.user;

    // Verify that the user is a member of the workspace
    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: user.id,
      },
    });

    if (!membership) {
      return res.status(403).json({ message: "Access denied" });
    }

    const permissions: any = await prisma.rolePermission.findMany({
      where: { roleId: req.params.roleId },
      orderBy: {
        createdAt: "asc",
      },
    });

    // console.log("permissions : ", permissions);

    // const groupedPermissions = groupPermissionsByCategory(role);

    return res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching role and permissions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSinglePermission = async (req: Request, res: Response) => {
  try {
    console.log("Hello : ", req.body.id);
    const permission = await prisma.rolePermission.findUnique({
      where: { id: req.body.id },
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    await prisma.rolePermission.update({
      where: { id: req.body.id },
      data: {
        allowed: !permission.allowed,
      },
    });

    return res.status(200).json({ message: "Permission updated successfully" });
  } catch (error) {
    console.error("Error updating permission:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateMultiPermissions = async (req: Request, res: Response) => {
  try {
    await prisma.rolePermission.updateMany({
      where: { id: { in: req.body.permissions.map((p: Permission) => p.id) } },
      data: {
        allowed: req.body.type === "enable" ? true : false,
      },
    });

    return res.status(200).json({ message: "Permission updated successfully" });
  } catch (error) {
    // console.error("Error updating permission:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePermissionOnlyRead = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId;
    const roleId = req.body.roleId;
    await prisma.rolePermission.updateMany({
      where: {
        role: {
          workspaceId,
        },
        OR: [
          { permission: { contains: ":read" } },
          { permission: { contains: ":view" } },
        ],
        roleId,
      },
      data: {
        allowed: true,
      },
    });
    await prisma.rolePermission.updateMany({
      where: {
        role: {
          workspaceId,
        },
        AND: [
          { permission: { not: { contains: ":read" } } },
          { permission: { not: { contains: ":view" } } },
        ],
        roleId,
      },
      data: {
        allowed: false,
      },
    });

    return res.status(200).json({ message: "Permission updated successfully" });
  } catch (error) {
    console.error("Error updating permission:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
