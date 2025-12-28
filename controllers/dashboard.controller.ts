import type { Request, Response } from "express";
import { prisma
 } from "../lib/prisma";


 export const getStatsCard = async (req: Request, res: Response) => {
    try {

         const now = new Date();
         const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
           const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
          const user = res.locals.user
        const totalTasks = await prisma.task.count({
            where: {
                column: {
                    project: {
                        workspace: {
                            ownerId: user.id
                        }
                    }
                }
            },
        })

        const totalCompleted = await prisma.task.count({
            where: {
                AND: [
                    {
                    column: {
                    project: {
                        workspace: {
                            ownerId: user.id
                        }
                    }
                }},
                {
                    status: "DONE"
                }
                ]
            }
        })
        const totalInProgress = await prisma.task.count({
            where: {
                AND: [
                    {
                    column: {
                    project: {
                        workspace: {
                            ownerId: user.id
                        }
                    }
                }},
                {
                    status:"IN_PROGRESS"
                }
                ]
            }
        })

        
        const overDue = await prisma.task.findMany({
            where: { AND : [
            
                {column: {
                    project: {
                        workspace: {
                            ownerId: user.id
                        }
                    }
                }

                },
                {
                    dueDate:{
                        lt: now
                    }
                }
            ]
                
            },

            orderBy: {
                dueDate: 'desc'
            }
        })

        res.send({totalCompleted: totalCompleted || 0, totalTasks: totalTasks ||0, totalInProgress: totalInProgress, overDue})
    } catch (error) {
         res.status(500).send("Something went wrong.")
    }
 }

 export const getDashboardProjectsOverview = async (req: Request, res: Response) =>{
    try {
        const user = res.locals.user
        const projects = await prisma.project.findMany({
            where: {
                workspace: {
                    ownerId: user.id
                }
            },
            orderBy: {
                createdAt: "asc"
            },
            include: {
                workspace: {
                    select: {
                        members: true
                    }
                }
            }
            
        })

        res.send(projects)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
 }