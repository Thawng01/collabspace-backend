import { Request, Response } from "express";
import { prisma } from "../lib/prisma";


export const createCommnet = async (req: Request, res: Response) => {
    try {
        const { content, authorId, taskId, projectId } = req.body

        const comment = await prisma.comment.create({
            data: {
                content,
                taskId,
                authorId
            }
        })

        await prisma.activity.create({
            data: {
                userId: authorId,
                taskId,
                projectId,
                action: "COMMENT",
                details: content
            }
        })

        res.send(comment)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}
export const getTaskComments = async (req: Request, res: Response) => {
    try {
        // Add default values for page and limit
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;

        const total = await prisma.comment.count({
            where: { taskId: req.params.id }
        });

        const comments = await prisma.comment.findMany({
            where: { taskId: req.params.id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,

                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit, // Already a number
        });

        const totalPages = Math.ceil(total / limit);
        const hasMore = skip + comments.length < total;

        res.json({
            comments,
            total,
            page,
            totalPages,
            hasMore,
            limit
        });
    } catch (error) {
        console.error('Error fetching task comments:', error);
        res.status(500).json({
            error: 'Failed to fetch comments',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}