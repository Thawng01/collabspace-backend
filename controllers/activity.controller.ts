import { Request, Response } from "express";
import { prisma } from "../lib/prisma";


// recently 3 activities
export const getTaskActivities = async (req: Request, res: Response) => {
    try {

        const activities = await prisma.activity.findMany({
            where: {
                taskId: req.params.id
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 3
        })

        res.send(activities)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}
// all task activities
export const getAllTaskActivities = async (req: Request, res: Response) => {
    try {

        const activities = await prisma.activity.findMany({
            where: {
                taskId: req.params.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.send(activities)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}