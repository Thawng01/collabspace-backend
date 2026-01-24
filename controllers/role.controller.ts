import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;

    const roles = await prisma.role.findMany({
      where: { workspaceId },
    });

    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch roles along with their permissions for the given workspace
