import type { Request, Response } from "express";
import { prisma
 } from "../lib/prisma";

export const getStatsCard = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;
        const now = new Date();
        
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        
        // Helper function to calculate percentage change
        const calculatePercentageChange = (current: number, previous: number): string => {
            if (previous === 0) {
                return current === 0 ? '0%' : '100%';
            }
            const change = (( current - previous) / previous) * 100;
            return `${change}%`;
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
                        members: true,
                        name: true,
                        description: true
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

 export const getDashboardTaskOverview = async (req: Request, res: Response) => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

            const baseWhere = {
                column: {
                    project: {
                        workspace: {
                            ownerId: res.locals.user.id
                        }
                    }
                },
                createdAt: {
                    gte: today,
                    lte: tomorrow
                }
            };

        const totalTaskCompleted = await prisma.task.count({
            where: {
                ...baseWhere,
                status: "DONE"
            }
        })
        const totalTaskInProgress = await prisma.task.count({
            where: {
                ...baseWhere,
                status: "IN_PROGRESS"
            }
        })
        const totalTaskPending = await prisma.task.count({
            where: {
                ...baseWhere,
                status:"TODO"
            }
        })

        res.send({
            totalTaskCompleted,
            totalTaskInProgress,
            totalTaskPending
        })
    } catch (error) {
         res.status(500).send("Something went wrong.")
    }
 }
 
 export const getDashboardTaskWeeklyOverview = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Get Monday of current week
        const getMonday = (date: Date) => {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
            d.setDate(diff);
            d.setHours(0, 0, 0, 0);
            return d;
        };
        
        // Start from Monday
        const monday = getMonday(today);
        
        // Create array for each work day (Monday to Friday)
        const weekDays = [];
        const currentDay = new Date(monday);
        
        // Fetch data for each work day
        const dailyPromises = [];
        
        for (let i = 0; i < 5; i++) {
            const dayStart = new Date(currentDay);
            const dayEnd = new Date(currentDay);
            dayEnd.setHours(23, 59, 59, 999);
            
            // Create query for this specific day
            const dayWhere = {
                column: {
                    project: {
                        workspace: {
                            ownerId: res.locals.user.id
                        }
                    }
                },
                createdAt: {
                    gte: dayStart,
                    lte: dayEnd
                }
            };
            
            // Push promise for this day's data
            dailyPromises.push(
                Promise.all([
                    prisma.task.count({
                        where: { ...dayWhere, status: "DONE" }
                    }),
                    prisma.task.count({
                        where: { ...dayWhere, status: "IN_PROGRESS" }
                    }),
                    prisma.task.count({
                        where: { ...dayWhere, status: "TODO" }
                    })
                ]).then(([completed, inProgress, pending]) => ({
                   
                    day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
                    completed,
                    inProgress,
                    pending,
                    total: completed + inProgress + pending
                }))
            );
            
            // Move to next day
            currentDay.setDate(currentDay.getDate() + 1);
        }
        
        // Execute all day queries in parallel
        const dailyData = await Promise.all(dailyPromises);
        
        // Calculate weekly totals
        const weeklyTotals = dailyData.reduce((totals, day) => {
            totals.totalCompleted += day.completed;
            totals.totalInProgress += day.inProgress;
            totals.totalPending += day.pending;
            totals.totalTasks += day.total;
            return totals;
        }, {
            totalCompleted: 0,
            totalInProgress: 0,
            totalPending: 0,
            totalTasks: 0
        });

        res.send({
            dailyData,
            weeklyTotals,
            weekRange: {
                monday: monday,
                friday: new Date(monday.getTime() + (4 * 24 * 60 * 60 * 1000)),
                mondayFormatted: monday.toISOString().split('T')[0],
                fridayFormatted: new Date(monday.getTime() + (4 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
            }
        });
    } catch (error) {
        console.error("Weekly overview error:", error);
        res.status(500).send("Something went wrong.");
    }
};