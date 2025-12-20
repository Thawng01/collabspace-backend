import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const createLabel = async (req: Request, res: Response) => {
    try {

        const { color, name, workspaceId } = req.body
        await prisma.label.create({
            data: {
                color,
                name,
                workspaceId
            }
        })

        res.send("Label created.")
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong.")
    }
}

export const getLabelByWorkspace = async (req: Request, res: Response) => {
    try {
        const labels = await prisma.label.findMany({
            where: { workspaceId: req.params.workspaceId }
        })
        res.send(labels)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}