import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createProject = async (req: Request, res: Response) => {
    try {
        const { name, description, color, workspaceId } = req.body
        await prisma.project.create({
            data: {
                name,
                description,
                color,
                workspaceId
            }
        })

        res.send("Project created.")
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}

export const updateProject = async (req: Request, res: Response) => {
    try {
        const { name, description, color } = req.body
        await prisma.project.update({
            where: { id: req.params.id },
            data: {
                name,
                description,
                color,
            }
        })

        res.send("Project updated.")
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}

export const getProjects = async (req: Request, res: Response) => {
    try {
        let query: any = {

        }
        if (req.query.workspace !== "all") {
            query = { workspaceId: req.query.workspace }
        }

        const projects = await prisma.project.findMany({
            where: query,
            select: {
                id: true,
                name: true,
                description: true,
                color: true,
                createdAt: true,
                updatedAt: true,
                workspace: true,
                workspaceId: true,
                columns: true,
                activities: true
            }
        })

        res.send(projects)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}

export const getProjectsByWorkspace = async (req: Request, res: Response) => {
    try {
    
        let query: any = {
              workspaceId: req.params.id
        }
        if (req.query.workspace !== "all") {
            query = { workspaceId: req.query.workspace || req.params.id }
        }

        const projects = await prisma.project.findMany({
            where: query,
            select: {
                id: true,
                name: true,
                description: true,
                color: true,
                createdAt: true,
                updatedAt: true,
                workspace: true,
                workspaceId: true,
                columns: true,
                activities: true
            }
        })

        res.send(projects)
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}



export const deleteProject = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id
        await prisma.project.delete({
            where: { id: projectId }
        })
    } catch (error) {
        res.status(500).send("Something went wrong.")
    }
}