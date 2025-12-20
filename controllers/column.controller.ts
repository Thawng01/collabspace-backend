import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const addColumn = async (req: Request, res: Response) => {
    try {
        const { projectId, title } = req.body

        const column = await prisma.column.findFirst({
            where: {
                projectId
            },
            orderBy: { order: 'desc' }
        })

        if (!column) {
            await prisma.column.create({
                data: {
                    projectId,
                    order: 0,
                    title: title
                }
            })
        } else {
            await prisma.column.create({
                data: {
                    projectId,
                    order: column.order + 1,
                    title: title
                }
            })
        }

        res.send("Column successfully created.")

    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong.")
    }
}


export const getColumns = async (req: Request, res: Response) => {
    try {
        const columns = await prisma.column.findMany({
            where: {
                projectId: req.params.id
            },
            orderBy: { order: 'asc' }
        })

        res.send(columns)
    } catch (error) {
        return res.status(500).send("Something went wrong.")
    }
}

export const editColumn = async (req: Request, res: Response) => {
    try {
        await prisma.column.update({
            where: { id: req.params.id },
            data: {
                title: req.body.title
            }
        })

        res.send("Successfully updated.")
    } catch (error) {
        return res.status(500).send("Something went wrong.")
    }
}

export const deleteColumn = async (req: Request, res: Response) => {
    try {
        await prisma.column.delete({
            where: { id: req.params.id }
        })
        res.send("deleted.")
    } catch (error) {
        return res.status(500).send("Something went wrong.")
    }
}