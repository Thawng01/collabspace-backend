import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { DEFAULT_WORKSPACE_ROLES } from "../constants/permission";

export const createWorkspaceHandler = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const ownerId = res.locals.user.id;

    const workspace = await createWorkspace({
      name,
      description,
      ownerId,
    });

    res.status(201).json({
      success: true,
      data: workspace,
      message: "Workspace created successfully",
    });
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create workspace",
    });
  }
};

export const createWorkspace = async (data: {
  name: string;
  description?: string;
  ownerId: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
      },
    });

    const createdRoles = [];

    for (const [roleName, roleConfig] of Object.entries(
      DEFAULT_WORKSPACE_ROLES,
    )) {
      // Create role for this workspace
      const role = await tx.role.create({
        data: {
          name: roleConfig.name,
          description: roleConfig.description,
          workspaceId: workspace.id,
        },
      });

      const rolePermissions = roleConfig.permissions.map((permission) => ({
        roleId: role.id,
        permission,
      }));

      await tx.rolePermission.createMany({
        data: rolePermissions,
        skipDuplicates: true,
      });

      createdRoles.push(role);
    }

    // 3. Find OWNER role for this workspace
    const ownerRole = createdRoles.find((role) => role.name === "OWNER");
    if (!ownerRole) {
      throw new Error("OWNER role not created");
    }

    // 4. Add owner as workspace member with OWNER role
    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        roleId: ownerRole.id,
        userId: data.ownerId,
      },
    });

    return workspace;
  });
};

export const getWorkspaces = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },

      select: {
        id: true,
        name: true,
        description: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        createdAt: true,
        updatedAt: true,

        members: {
          select: {
            id: true,
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
            user: true,
          },
        },

        labels: true,
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
    });
    // console.log(workspaces)
    res.send(workspaces);
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
};

export const getWorkspaceName = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const workspace = await prisma.workspace.findMany({
      where: { ownerId: user.id },
      select: {
        id: true,
        name: true,
      },
    });
    res.send(workspace);
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
};

export const getWorkspaceDetails = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.id;
    const workspace = await prisma.workspace.findFirst({
      where: { id: workspaceId },
      select: {
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        members: true,
        projects: true,
      },
    });
    res.send(workspace);
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
};

export const updateWorkspace = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.id;

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        name: req.body.name,
        description: req.body.description,
      },
    });

    res.send("Successfully deleted.");
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
};

export const getRoleAndPermissions = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.id;
    const userId = res.locals.user.id;

    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
      },
      select: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: {
              select: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "User is not a member of this workspace",
      });
    }

    res.json({
      success: true,
      data: member.role,
    });
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.id;
    // console.log("Hii")
    await prisma.workspace.delete({
      where: { id: workspaceId },
    });

    res.send("Successfully deleted.");
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
};
