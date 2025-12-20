import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'


export const addMemberInWorkspace = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user
        const { workspaceId, role, memberId } = req.body
        const workspace = await prisma.workspace.findFirst({
            where: {
                id: workspaceId
            }
        })

        if (!workspace) return res.status(404).send("No workspace found with the given ID.")

        if (workspace.ownerId !== user.id) return res.status(400).send("You don't have permission to add members.")


        const m = await prisma.workspaceMember.findFirst({
            where: {
                AND: [
                    { workspaceId },
                    { userId: memberId }
                ]
            }
        })

        if (m) return res.status(400).send("This user is already in this workspace.")

        await prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId: memberId,
                role
            }
        })

        res.send("Added successfully.")
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}

export const getMembersByWorkspace = async (req: Request, res: Response) => {
    try {

        const project = await prisma.project.findFirst({
            where: {
                id: req.params.id
            }
        })

        if (!project) return res.status(400).send("No item found with the given ID.")

        const workspaceMembers = await prisma.workspaceMember.findMany({
            where: {
                workspaceId: project.workspaceId
            },
            select: {
                id: true,
                role: true,
                joinedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        res.send(workspaceMembers)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}

export const removeMemberFromWorkspace = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user
        const { id } = req.body

        // if (user.role !== "OWNER" || user.role !== "ADMIN") return res.status(400).send("Access denied.")

        await prisma.workspaceMember.delete({
            where: {
                id
            }
        })
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}