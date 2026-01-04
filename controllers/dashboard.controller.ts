import type { Request, Response } from "express";
import { prisma
 } from "../lib/prisma";

export const getStatsCard = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;
        const now = new Date();
        
        // Get current month dates
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        
        // Get previous month dates
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        
        // Helper function to calculate percentage change
        const calculatePercentageChange = (current: number, previous: number): string => {
            if (previous === 0) {
                return current === 0 ? '0%' : '100%';
            }
            const change = ((current - previous) / previous) * 100;
            return `${change.toFixed(1)}%`;
        };
        
        // Helper function to get tasks count for a date range
        const getTasksCount = async (startDate: Date, endDate: Date) => {
            const baseWhere = {
                column: {
                    project: {
                        workspace: {
                            ownerId: user.id
                        }
                    }
                },
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            };
            
            const [totalTasks, totalCompleted, totalInProgress] = await Promise.all([
                prisma.task.count({ where: baseWhere }),
                prisma.task.count({ 
                    where: {
                        ...baseWhere,
                        status: "DONE"
                    }
                }),
                prisma.task.count({ 
                    where: {
                        ...baseWhere,
                        status: "IN_PROGRESS"
                    }
                })
            ]);
            
            return { totalTasks, totalCompleted, totalInProgress };
        };
        
        // Get data for both months
        const [currentMonthData, previousMonthData] = await Promise.all([
            getTasksCount(currentMonthStart, currentMonthEnd),
            getTasksCount(prevMonthStart, prevMonthEnd)
        ]);
        
        // Get overdue tasks for current month
        const overDue = await prisma.task.findMany({
            where: {
                column: {
                    project: {
                        workspace: {
                            ownerId: user.id
                        }
                    }
                },
                dueDate: {
                    lt: now,
                    gte: currentMonthStart
                }
            },
            orderBy: {
                dueDate: 'desc'
            }
        });
        
        // Calculate percentage changes
        const percentageChanges = {
            totalTasks: calculatePercentageChange(currentMonthData.totalTasks, previousMonthData.totalTasks),
            totalCompleted: calculatePercentageChange(currentMonthData.totalCompleted, previousMonthData.totalCompleted),
            totalInProgress: calculatePercentageChange(currentMonthData.totalInProgress, previousMonthData.totalInProgress)
        };

        console.log("data ; ", {
            percentageChanges,
            totalCompleted: currentMonthData.totalCompleted || 0,
            totalTasks: currentMonthData.totalTasks || 0,
            totalInProgress: currentMonthData.totalInProgress || 0,
            overDue
        })
        
        res.send({
            percentageChanges,
            totalCompleted: currentMonthData.totalCompleted || 0,
            totalTasks: currentMonthData.totalTasks || 0,
            totalInProgress: currentMonthData.totalInProgress || 0,
            overDue
        });
    } catch (error) {
        console.error('Error in getStatsCard:', error);
        res.status(500).send("Something went wrong.");
    }
};

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
            },
            
           take: 3  
        })

        res.send(projects)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
 }