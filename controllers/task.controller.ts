
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { TaskStatus } from '@prisma/client'


export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, label, priority, dueDate, assigneeId, columnId } = req.body
        const task = await prisma.task.findFirst({
            where: {
                columnId
            },

            orderBy: { order: 'desc' }
        })

        if (!task) {
            await prisma.task.create({
                data: {
                    title,
                    description,
                    priority,
                    columnId,
                    assigneeId,
                    order: 0,
                    dueDate,

                }
            })
        } else {
            await prisma.task.create({
                data: {
                    title,
                    description,
                    priority,
                    columnId,
                    assigneeId,
                    order: task.order + 1
                }
            })
        }

        await prisma.taskLabel.create({
            data: {
                taskId: task?.id!,
                labelId: label
            }
        })

        res.send("Task successfully created.")

    } catch (error) {

        res.status(500).send("Something went wrong.")
    }
}
export const editTask = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.id
        const { title, description, label, priority, dueDate, assigneeId } = req.body
        await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                title,
                description,
                priority,
                dueDate,
                assigneeId,
            }
        })

        const l = await prisma.taskLabel.findFirst({
            where: {
                labelId: label
            }
        })

        if (l) {
            await prisma.taskLabel.update({
                where: { id: l.id },
                data: {
                    labelId: label
                }
            })
        } else {
            await prisma.taskLabel.create({
                data: {
                    labelId: label,
                    taskId: taskId
                }
            })
        }

        res.send("Task successfully updated.")

    } catch (error) {

        res.status(500).send("Something went wrong.")
    }
}

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                assignee: { select: { name: true, email: true, id: true, avatar: true } }
            }
        })

        res.send(tasks)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}
export const getTasksByColumn = async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                columnId: req.params.id
            },

            include: {
                assignee: { select: { name: true, email: true, id: true, avatar: true } }
            }
        })

        res.send(tasks)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}

// move task to a different column
export const updateColumnTask = async (req: Request, res: Response) => {
    
    try {

        const { columnId, taskId } = req.body

        const column = await prisma.column.findFirst({
            where: {
                id: columnId
            }
        })

        let Status = "BACKLOG"
        if (column?.title === "In Progress") {
            Status = "IN_PROGRESS"
        } else if (column?.title === "In Review") {
            Status = "IN_REVIEW"
        } else if (column?.title === "DONE") {
            Status = "DONE"
        } else if (column?.title === "To Do") {
            Status = "TODO"
        } else {
            Status = "BACKLOG"
        }

        const task = await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                columnId,
                status: Status as TaskStatus
            }
        })

        res.send(task)
    } catch (error) {
        res.status(500).send("Something went wrong." + error)
    }
}

export const getTaskDetail = async (req: Request, res: Response) => {
    try {
        const task = await prisma.task.findFirst({
            where: { id: req.params.id },
            include: {
                comments: true,
                assignee: {
                    select: { id: true, name: true, email: true, avatar: true }
                },
                activities: true,
                attachments: true,
                column: true,
                labels: {
                    select: {
                        label: true
                    }
                }
            }
        })


        res.send(task)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}
export const updateTaskDescription = async (req: Request, res: Response) => {
    
    try {
        const { userId, projectId, priority, description } = req.body
        const task = await prisma.task.update({
            where: { id: req.params.id },
            data: {
                description: description
            }
        })

        await prisma.activity.create({
            data: {
                taskId: req.params.id,
                userId,
                projectId,
                action: "TASK_UPDATE",
                details: `updated task description.`
            }
        })

        res.send(task)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}



export const updateTaskPriority = async (req: Request, res: Response) => {
    try {
        const { userId, projectId, priority } = req.body
        const updatedTask = await prisma.task.update({
            where: { id: req.params.id },
            data: {
                priority: priority
            }
        })

        const task = await prisma.task.findFirst({
            where: { id: req.params.id }
        })

        await prisma.activity.create({
            data: {
                taskId: req.params.id,
                userId,
                projectId,
                action: "PRIORITY_CHANGE",
                details: `changed priority status ${task?.priority} to ${priority}`
            }
        })

        res.send(updatedTask)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}
export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const { userId, projectId, status, columnId } = req.body

        let statusType = "Backlog"
        if (status === "IN_PROGRESS") {
            statusType = "In Progress"
        } else if (status === "TODO") {
            statusType = "To Do"
        } else if (status === "DONE") {
            statusType = "Done"
        }

        const column = await prisma.column.findFirst({
            where: {
                projectId,
                title: statusType
            }
        })


        const updatedTask = await prisma.task.update({
            where: { id: req.params.id },
            data: {
                status,
                columnId: column?.id
            }
        })

        const task = await prisma.task.findFirst({
            where: { id: req.params.id }
        })

        await prisma.activity.create({
            data: {
                taskId: req.params.id,
                userId,
                projectId,
                action: "STATUS_CHANGE",
                details: `changed task status ${task?.status} to ${status}`
            }
        })

        res.send(updatedTask)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        await prisma.task.delete({
            where: {
                id: req.params.id
            }
        })

        res.send("Deleted.")
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}