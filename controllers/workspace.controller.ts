import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createWorkspace = async (req: Request, res: Response) => {
    try {
        const { name, description, ownerId } = req.body
        const workspace = await prisma.workspace.create({
            data: {
                name,
                description,
                ownerId
            }
        })

        await prisma.workspaceMember.create({
            data: {
                workspaceId: workspace.id,
                role: "OWNER",
                userId: ownerId
            }
        })

        res.send("Successfully created.")
    } catch (error) {
        res.status(500).send("Something went wrong.")

    }
}
export const getWorkspaces = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user
        const workspaces = await prisma.workspace.findMany({
            where: { ownerId: user.id },


            select: {
                id: true,
                name: true,
                description: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                createdAt: true,
                updatedAt: true,

                members: {
                    select: {
                        id: true, role: true, user: true
                    }
                },

                labels: true,
                _count: {
                    select: {
                        projects: true,
                        members: true
                    }
                }
            }
        })
        console.log(workspaces)
        res.send(workspaces)
    } catch (error) {
        res.status(500).send("Something went wrong.")

    }
}



export const getWorkspaceDetails = async (req: Request, res: Response) => {
    try {
        const workspaceId = req.params.id
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId },
            select: {
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                members: true,
                projects: true
            }
        })
        res.send(workspace)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}

export const updateWorkspace = async (req: Request, res: Response) => {
    try {
        const workspaceId = req.params.id

        await prisma.workspace.update({
            where: { id: workspaceId },
            data: {
                name: req.body.name,
                description: req.body.description,
            }
        })


        res.send("Successfully deleted.")
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}



export const deleteWorkspace = async (req: Request, res: Response) => {
    try {
        const workspaceId = req.params.id
        console.log("Hii")
        await prisma.workspace.delete({
            where: { id: workspaceId }
        })

        res.send("Successfully deleted.")
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}