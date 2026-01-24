import {
  DEFAULT_WORKSPACE_ROLES,
  PermissionCode,
} from "../constants/permission";
import { prisma } from "./prisma";

export const createDefaultWorkspaceRoles = async (workspaceId: string) => {
  const createdRoles = [];

  for (const [roleName, roleConfig] of Object.entries(
    DEFAULT_WORKSPACE_ROLES,
  )) {
    console.log(`Creating role: ${roleName} for roleConfig:`, roleConfig.name);
    console.log(
      `Creating role: ${roleName} for roleConfig:`,
      roleConfig.permissions,
    );
    console.log("id : ", workspaceId);
    // Create role for this workspace
    const role = await prisma.role.create({
      data: {
        name: roleConfig.name,
        description: roleConfig.description,
        workspaceId,
      },
    });

    // Assign permissions to this workspace role
    await assignPermissionsToWorkspaceRole(role.id, roleConfig.permissions);

    createdRoles.push(role);
  }

  return createdRoles;
};

export const assignPermissionsToWorkspaceRole = async (
  roleId: string,
  permissions: PermissionCode[],
) => {
  // Create role-permission records for this workspace
  const rolePermissions = permissions.map((permission) => ({
    roleId,
    permission,
  }));

  await prisma.rolePermission.createMany({
    data: rolePermissions,
    skipDuplicates: true,
  });
};
